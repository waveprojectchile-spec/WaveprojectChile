import { MercadoPagoConfig, Preference } from 'mercadopago'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { plan, monto, titulo, nombre, rut, email, telefono, fecha_nacimiento, direccion, ciudad, region, enfermedades, operaciones, medicamentos, lesiones, contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_relacion } = body

    if (!plan || !monto || !titulo || !nombre || !rut || !email || !telefono) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 })
    }

    // 1. Crear el cliente en Supabase con estado_pago = 'pendiente'
    const { data: nuevoCliente, error: dbError } = await getSupabaseAdmin()
      .from('clientes')
      .insert({
        nombre,
        rut,
        email,
        telefono,
        plan,
        monto,
        fecha_nacimiento,
        direccion,
        ciudad,
        region,
        contacto_emergencia_nombre,
        contacto_emergencia_telefono,
        contacto_emergencia_relacion,
        enfermedades,
        operaciones,
        medicamentos,
        lesiones,
        estado_pago: 'pendiente'
      })
      .select('id')
      .single()

    if (dbError || !nuevoCliente) {
      console.error('[CHECKOUT DB ERROR]', dbError)
      return NextResponse.json({ error: 'Error al registrar cliente temporal' }, { status: 500 })
    }

    console.log('[CHECKOUT] Cliente pendiente creado con ID:', nuevoCliente.id)

    // 2. Crear la preferencia en MercadoPago
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
    const preference = await new Preference(client).create({
      body: {
        items: [{ id: plan, title: `Wave Project Gym — Plan ${titulo}`, quantity: 1, unit_price: Number(monto), currency_id: 'CLP' }],
        payer: email ? { email, name: nombre } : undefined,
        external_reference: nuevoCliente.id, // El ID de Supabase
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
