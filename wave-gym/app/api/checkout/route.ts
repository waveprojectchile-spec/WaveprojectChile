import { MercadoPagoConfig, Preference } from 'mercadopago'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
    )
    const { data: { user } } = await supabase.auth.getUser()

    const body = await req.json()
    const { plan, monto, titulo } = body
    const email = user?.email || ''
    const user_id = user?.id || null

    if (!user_id) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para comprar' },
        { status: 401 }
      )
    }

    console.log('[CHECKOUT] Usuario resuelto:', { email, user_id })

    if (!plan || !monto || !titulo) {
      return Response.json({ error: 'Faltan parámetros requeridos: plan, monto o titulo' }, { status: 400 })
    }

    const externalReferenceData = JSON.stringify({ plan, user_id })

    console.log('[CHECKOUT] Datos enviados a MP:', { 
      plan, monto, titulo, email, userId: user_id, external_reference: externalReferenceData 
    })

    const preference = await new Preference(client).create({
      body: {
        items: [{ id: plan, title: `Wave Project Gym — Plan ${titulo}`, quantity: 1, unit_price: Number(monto), currency_id: 'CLP' }],
        payer: email ? { email } : undefined,
        external_reference: externalReferenceData,
        back_urls: {
          success: 'https://waveproject-chile.vercel.app/gracias',
          failure: 'https://waveproject-chile.vercel.app/planes',
          pending: 'https://waveproject-chile.vercel.app/planes',
        },
        auto_return: 'approved',
        notification_url: 'https://waveproject-chile.vercel.app/api/notify',
      },
    })

    return Response.json({ id: preference.id, init_point: preference.init_point })
  } catch (err: any) {
    console.error('[CHECKOUT ERROR]', err)
    console.error('[CHECKOUT ERROR DETAILS]', JSON.stringify(err, null, 2))
    return Response.json(
      { 
        error: 'Error al crear preferencia',
        details: process.env.NODE_ENV !== 'production' ? (err.cause || err.message || err) : undefined
      }, 
      { status: 500 }
    )
  }
}
