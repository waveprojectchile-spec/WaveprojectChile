import { MercadoPagoConfig, Payment } from 'mercadopago'
import { supabaseAdmin } from '@/lib/supabase-admin'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (body.type !== 'payment') return new Response(null, { status: 200 })

    const payment = await new Payment(client).get({ id: body.data.id })
    if (payment.status !== 'approved') return new Response(null, { status: 200 })

    const ref = JSON.parse(payment.external_reference || '{}')
    const paymentIdStr = String(payment.id)

    // 1. Idempotencia: Verificar si ya existe la venta
    const { data: existingVenta } = await supabaseAdmin
      .from('ventas')
      .select('id')
      .eq('payment_id', paymentIdStr)
      .single()

    if (existingVenta) {
      console.log(`Webhook ignorado: Pago ${paymentIdStr} ya procesado.`)
      return new Response(null, { status: 200 })
    }

    await supabaseAdmin.from('ventas').insert({
      user_id: ref.user_id || null,
      plan: ref.plan,
      monto: payment.transaction_amount,
      estado: 'aprobado',
      email: payment.payer?.email,
      payment_id: paymentIdStr,
    })

    if (ref.user_id) {
      await supabaseAdmin
        .from('profiles')
        .update({ estado_pago: 'activo', fecha_pago: new Date().toISOString() })
        .eq('id', ref.user_id)
    }

    // Decrementar stock preventa con concurrencia optimista
    const { data: producto } = await supabaseAdmin
      .from('productos')
      .select('id, stock')
      .ilike('nombre', `%${ref.plan}%`)
      .eq('es_preventa', true)
      .single()

    if (producto && producto.stock > 0) {
      const nuevoStock = producto.stock - 1
      await supabaseAdmin
        .from('productos')
        .update({ stock: nuevoStock, activo: nuevoStock > 0 })
        .eq('id', producto.id)
        .eq('stock', producto.stock) // Concurrencia optimista
        .gt('stock', 0) // Evitar negativos en carrera
    }
  } catch (err) {
    console.error('Webhook error:', err)
  }
  return new Response(null, { status: 200 })
}
