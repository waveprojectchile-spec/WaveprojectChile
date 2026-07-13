import { MercadoPagoConfig, Payment } from 'mercadopago'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { Resend } from 'resend'

// Las inicializamos con un fallback para que Vercel no falle al momento de hacer el build
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || 'dummy' })
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy')

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (body.type !== 'payment') return new Response(null, { status: 200 })

    const payment = await new Payment(client).get({ id: body.data.id })
    console.log('[WEBHOOK] Pago recibido:', payment.id, payment.status)
    if (payment.status !== 'approved') return new Response(null, { status: 200 })

    const clientId = payment.external_reference;
    if (!clientId) {
      console.error('Webhook error: no external_reference')
      return new Response(null, { status: 200 })
    }

    // ── RENOVACIÓN ──────────────────────────────────────────────────────────
    if (clientId.startsWith('renov:')) {
      const realId = clientId.replace('renov:', '')
      const { data: cli } = await getSupabaseAdmin()
        .from('clientes').select('id, renovaciones_usadas').eq('id', realId).single()
      if (cli) {
        await getSupabaseAdmin()
          .from('clientes')
          .update({ renovaciones_usadas: (cli.renovaciones_usadas ?? 0) + 1 })
          .eq('id', realId)
        console.log('[WEBHOOK] Renovación registrada para cliente:', realId)
      }
      return new Response(null, { status: 200 })
    }
    // ── FIN RENOVACIÓN ───────────────────────────────────────────────────────

    const paymentIdStr = String(payment.id)

    // 1. Obtener cliente
    const { data: cliente, error: getErr } = await getSupabaseAdmin()
      .from('clientes')
      .select('*')
      .eq('id', clientId)
      .single()

    if (getErr || !cliente) {
      console.error('[WEBHOOK] Cliente no encontrado:', clientId)
      return new Response(null, { status: 200 })
    }

    if (cliente.estado_pago === 'aprobado' || cliente.payment_id === paymentIdStr) {
      console.log(`Webhook ignorado: Pago ${paymentIdStr} ya procesado para cliente ${clientId}.`)
      return new Response(null, { status: 200 })
    }

    // 2. Actualizar estado del cliente
    console.log('[WEBHOOK] Aprobando cliente:', clientId)
    await getSupabaseAdmin()
      .from('clientes')
      .update({
        estado_pago: 'aprobado',
        payment_id: paymentIdStr,
        fecha_pago: new Date().toISOString()
      })
      .eq('id', clientId)

    // 3. Descontar stock (sumar 1 a cupos_vendidos)
    const { data: cupos } = await getSupabaseAdmin()
      .from('cupos_config')
      .select('id, cupos_vendidos')
      .eq('activo', true)
      .single()
      
    if (cupos) {
      await getSupabaseAdmin()
        .from('cupos_config')
        .update({ cupos_vendidos: (cupos.cupos_vendidos || 0) + 1 })
        .eq('id', cupos.id)
    }

    // 4. Enviar email al admin con TODO el detalle
    try {
      await resend.emails.send({
        from: 'Wave Project Gym <onboarding@resend.dev>',
        to: ['waveprojectchile@gmail.com'],
        subject: `Nueva venta preventa — ${cliente.plan} — ${cliente.nombre}`,
        html: `
          <p>Nueva venta confirmada en Wave Project Gym</p>
          <br/>
          <h3>Detalles de la compra</h3>
          <p><strong>Plan:</strong> ${cliente.plan}</p>
          <p><strong>Monto:</strong> $${cliente.monto}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CL')} ${new Date().toLocaleTimeString('es-CL')}</p>
          <p><strong>ID Pago MercadoPago:</strong> ${paymentIdStr}</p>
          <br/>
          <h3>Datos Personales</h3>
          <p><strong>Nombre:</strong> ${cliente.nombre}</p>
          <p><strong>RUT:</strong> ${cliente.rut}</p>
          <p><strong>Email:</strong> ${cliente.email}</p>
          <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
          <p><strong>Fecha de Nacimiento:</strong> ${cliente.fecha_nacimiento || 'N/A'}</p>
          <p><strong>Dirección:</strong> ${cliente.direccion || 'N/A'}</p>
          <p><strong>Ciudad:</strong> ${cliente.ciudad || 'N/A'}</p>
          <p><strong>Región:</strong> ${cliente.region || 'N/A'}</p>
          <br/>
          <h3>Antecedentes Médicos</h3>
          <p><strong>Enfermedades crónicas:</strong> ${cliente.enfermedades || 'Ninguna'}</p>
          <p><strong>Operaciones o cirugías:</strong> ${cliente.operaciones || 'Ninguna'}</p>
          <p><strong>Medicamentos actuales:</strong> ${cliente.medicamentos || 'Ninguno'}</p>
          <p><strong>Lesiones activas:</strong> ${cliente.lesiones || 'Ninguna'}</p>
          <br/>
          <h3>Contacto de Emergencia</h3>
          <p><strong>Nombre:</strong> ${cliente.contacto_emergencia_nombre || 'No registrado'}</p>
          <p><strong>Teléfono:</strong> ${cliente.contacto_emergencia_telefono || 'No registrado'}</p>
          <p><strong>Relación:</strong> ${cliente.contacto_emergencia_relacion || 'No registrado'}</p>
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
