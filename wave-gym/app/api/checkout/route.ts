import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: Request) {
  try {
    const { plan, monto, titulo, user_id, email } = await req.json()

    if (!plan || !monto || !titulo) {
      return Response.json({ error: 'Faltan parámetros requeridos: plan, monto o titulo' }, { status: 400 })
    }

    const preference = await new Preference(client).create({
      body: {
        items: [{ id: plan, title: `Wave Project Gym — Plan ${titulo}`, quantity: 1, unit_price: Number(monto), currency_id: 'CLP' }],
        payer: email ? { email } : undefined,
        external_reference: JSON.stringify({ plan, user_id }),
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
