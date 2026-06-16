import { MercadoPagoConfig, Payment } from 'mercadopago'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (body.type !== 'payment') return new Response(null, { status: 200 })

    const payment = await new Payment(client).get({ id: body.data.id })
    console.log('[WEBHOOK] Pago recibido:', payment.id, payment.status)
    if (payment.status !== 'approved') return new Response(null, { status: 200 })

    const ref = JSON.parse(payment.external_reference || '{}')
    const paymentIdStr = String(payment.id)

    // 1. Idempotencia: Verificar si ya existe la venta
    const { data: existingVenta } = await getSupabaseAdmin()
      .from('ventas')
      .select('id')
      .eq('payment_id', paymentIdStr)
      .single()

    console.log('[WEBHOOK] Venta ya existía?', !!existingVenta)

    if (existingVenta) {
      console.log(`Webhook ignorado: Pago ${paymentIdStr} ya procesado.`)
      return new Response(null, { status: 200 })
    }

    console.log('[WEBHOOK] Insertando venta:', { user_id: ref.user_id, plan: ref.plan, monto: payment.transaction_amount })

    await getSupabaseAdmin().from('ventas').insert({
      user_id: ref.user_id || null,
      plan: ref.plan,
      monto: payment.transaction_amount,
      estado: 'aprobado',
      email: payment.payer?.email,
      payment_id: paymentIdStr,
    })

    if (ref.user_id) {
      await getSupabaseAdmin()
        .from('profiles')
        .update({ estado_pago: 'activo', fecha_pago: new Date().toISOString() })
        .eq('id', ref.user_id)
    }

    // Decrementar stock preventa con concurrencia optimista
    const { data: producto } = await getSupabaseAdmin()
      .from('productos')
      .select('id, stock')
      .ilike('nombre', `%${ref.plan}%`)
      .eq('es_preventa', true)
      .single()

    if (producto && producto.stock > 0) {
      const nuevoStock = producto.stock - 1
      const updateResult = await getSupabaseAdmin()
        .from('productos')
        .update({ stock: nuevoStock, activo: nuevoStock > 0 })
        .eq('id', producto.id)
        .eq('stock', producto.stock) // Concurrencia optimista
        .gt('stock', 0) // Evitar negativos en carrera
      console.log('[WEBHOOK] Stock decrementado. Producto:', producto?.id, 'Filas afectadas:', updateResult?.error ? 0 : 1)
    }
  } catch (err) {
    console.error('Webhook error:', err)
  }
  return new Response(null, { status: 200 })
}
