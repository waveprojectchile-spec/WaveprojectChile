import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN || '' 
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get('topic') || searchParams.get('type');
    const idParam = searchParams.get('data.id') || searchParams.get('id');

    let paymentId = idParam;
    let type = topic;

    // Si no vienen en los query params, buscar en el body
    if (!paymentId) {
      try {
        const body = await req.json();
        paymentId = body?.data?.id;
        type = body?.type;
      } catch (e) {
        // body could be empty or not json
      }
    }

    if (type === 'payment' && paymentId) {
      const paymentClient = new Payment(client);
      const paymentInfo = await paymentClient.get({ id: paymentId });

      if (paymentInfo.status === 'approved') {
        const externalReference = paymentInfo.external_reference;
        const monto = paymentInfo.transaction_amount;

        const { error } = await supabase.from('ventas').insert({
          plan: externalReference || 'desconocido',
          monto: monto,
          estado: paymentInfo.status,
        });

        if (error) {
          console.error('Error al insertar venta en Supabase:', error);
        }
      }
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error en webhook MP:', error);
    return new NextResponse('OK', { status: 200 });
  }
}
