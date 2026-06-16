import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

export async function POST(req: Request) {
  try {
    const { plan, monto, titulo } = await req.json();

    if (!plan || !monto || !titulo) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: plan,
            title: titulo,
            quantity: 1,
            unit_price: Number(monto),
            currency_id: 'CLP',
          },
        ],
        back_urls: {
          success: 'https://waveproject-chile.vercel.app/gracias',
          failure: 'https://waveproject-chile.vercel.app/planes',
          pending: 'https://waveproject-chile.vercel.app/planes',
        },
        auto_return: 'approved',
        external_reference: plan,
        notification_url: 'https://waveproject-chile.vercel.app/api/notify',
      },
    });

    return NextResponse.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error('MP Error:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pago', detail: error }, 
      { status: 500 }
    );
  }
}
