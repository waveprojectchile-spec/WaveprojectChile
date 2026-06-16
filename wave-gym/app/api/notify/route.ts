import { MercadoPagoConfig, Payment } from 'mercadopago'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { Resend } from 'resend'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (body.type !== 'payment') return new Response(null, { status: 200 })

    const payment = await new Payment(client).get({ id: body.data.id })
    console.log('[WEBHOOK] Pago recibido:', payment.id, payment.status)
    if (payment.status !== 'approved') return new Response(null, { status: 200 })

    const ref = JSON.parse(payment.external_reference || '{}')
    const paymentIdStr = String(payment.id)

    // 1. Idempotencia: Verificar si ya existe en clientes
    const { data: existingCliente } = await getSupabaseAdmin()
      .from('clientes')
      .select('id')
      .eq('payment_id', paymentIdStr)
      .single()

    console.log('[WEBHOOK] Cliente ya existía?', !!existingCliente)

    if (existingCliente) {
      console.log(`Webhook ignorado: Pago ${paymentIdStr} ya procesado.`)
      return new Response(null, { status: 200 })
    }

    console.log('[WEBHOOK] Insertando nuevo cliente:', ref)

    await getSupabaseAdmin().from('clientes').insert({
      nombre: ref.nombre,
      rut: ref.rut,
      email: ref.email,
      telefono: ref.telefono,
      plan: ref.plan,
      monto: ref.monto || payment.transaction_amount,
      payment_id: paymentIdStr,
    })

    // Enviar email al admin
    try {
      await resend.emails.send({
        from: 'Wave Project Gym <onboarding@resend.dev>',
        to: ['waveprojectchile@gmail.com'],
        subject: `Nueva venta preventa — ${ref.plan} — ${ref.nombre}`,
        html: `
          <p>Nueva venta confirmada en Wave Project Gym</p>
          <br/>
          <p><strong>Plan:</strong> ${ref.plan}</p>
          <p><strong>Monto:</strong> $${ref.monto || payment.transaction_amount}</p>
          <p><strong>Nombre:</strong> ${ref.nombre}</p>
          <p><strong>RUT:</strong> ${ref.rut}</p>
          <p><strong>Email:</strong> ${ref.email}</p>
          <p><strong>Teléfono:</strong> ${ref.telefono}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CL')} ${new Date().toLocaleTimeString('es-CL')}</p>
          <p><strong>ID Pago MercadoPago:</strong> ${paymentIdStr}</p>
        `
      })
      console.log('[WEBHOOK] Email enviado a waveprojectchile@gmail.com')
    } catch (emailErr) {
      console.error('[WEBHOOK] Error enviando email:', emailErr)
    }

  } catch (err) {
    console.error('Webhook error:', err)
  }
  return new Response(null, { status: 200 })
}
