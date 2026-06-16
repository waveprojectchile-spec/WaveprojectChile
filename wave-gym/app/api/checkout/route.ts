import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: Request) {
  try {
    const { plan, monto, titulo, user_id, email } = await req.json()

    const preference = await new Preference(client).create({
      body: {
        items: [{ id: plan, title: `Wave Project Gym — Plan ${titulo}`, quantity: 1, unit_price: Number(monto), currency_id: 'CLP' }],
        payer: { email: email || '' },
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
  } catch (err) {
    console.error('MP Checkout Error:', err)
    return Response.json({ error: 'Error al crear preferencia' }, { status: 500 })
  }
}
