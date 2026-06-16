import { MercadoPagoConfig, Preference } from 'mercadopago'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { plan, monto, titulo, nombre, rut, email, telefono } = body

    if (!plan || !monto || !titulo || !nombre || !rut || !email || !telefono) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 })
    }

    const externalReferenceData = JSON.stringify({ plan, monto, nombre, rut, email, telefono })

    console.log('[CHECKOUT] Datos recibidos y enviados a MP:', { 
      plan, monto, titulo, email, external_reference: externalReferenceData 
    })

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
    const preference = await new Preference(client).create({
      body: {
        items: [{ id: plan, title: `Wave Project Gym — Plan ${titulo}`, quantity: 1, unit_price: Number(monto), currency_id: 'CLP' }],
        payer: email ? { email, name: nombre } : undefined,
        external_reference: externalReferenceData,
        back_urls: {
          success: 'https://www.waveproject.cl/gracias',
          failure: 'https://www.waveproject.cl/planes',
          pending: 'https://www.waveproject.cl/planes',
        },
        auto_return: 'approved',
        notification_url: 'https://waveproject-chile.vercel.app/api/notify',
      },
    })

    return NextResponse.json({ id: preference.id, init_point: preference.init_point })
  } catch (err: any) {
    console.error('[CHECKOUT ERROR]', err)
    return NextResponse.json(
      { 
        error: 'Error al crear preferencia',
        details: process.env.NODE_ENV !== 'production' ? (err.cause || err.message || err) : undefined
      }, 
      { status: 500 }
    )
  }
}
