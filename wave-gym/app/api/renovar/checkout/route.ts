import { MercadoPagoConfig, Preference } from 'mercadopago'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const CORTE_P1 = new Date('2026-07-12T23:59:59-04:00')

export async function POST(req: Request) {
  try {
    const { clienteId } = await req.json()
    if (!clienteId) return NextResponse.json({ error: 'clienteId requerido' }, { status: 400 })

    const { data: cliente, error } = await getSupabaseAdmin()
      .from('clientes')
      .select('id, nombre, email, plan, monto, fecha_pago, renovaciones_usadas, estado_pago')
      .eq('id', clienteId)
      .eq('estado_pago', 'aprobado')
      .single()

    if (error || !cliente) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })

    const esP1 = cliente.fecha_pago && new Date(cliente.fecha_pago) <= CORTE_P1
    const maxRenovaciones = esP1 ? 4 : 2
    const usadas = cliente.renovaciones_usadas ?? 0

    if (usadas >= maxRenovaciones) {
      return NextResponse.json({ error: `Ya usaste todas tus renovaciones (${maxRenovaciones})` }, { status: 409 })
    }

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
    const preference = await new Preference(client).create({
      body: {
        items: [{
          id: `renovacion-${cliente.plan}`,
          title: `Wave Project Gym — Renovación Plan ${cliente.plan.toUpperCase()}`,
          quantity: 1,
          unit_price: Number(cliente.monto),
          currency_id: 'CLP',
        }],
        payer: { email: cliente.email, name: cliente.nombre },
        // external_reference con prefijo "renov:" para que el webhook lo distinga
        external_reference: `renov:${cliente.id}`,
        back_urls: {
          success: 'https://www.waveproject.cl/gracias?tipo=renovacion',
          failure: 'https://www.waveproject.cl/renovar',
          pending: 'https://www.waveproject.cl/renovar',
        },
        auto_return: 'approved',
        notification_url: 'https://waveproject-chile.vercel.app/api/notify',
      },
    })

    return NextResponse.json({ init_point: preference.init_point })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
