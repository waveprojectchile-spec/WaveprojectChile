import { redirect } from 'next/navigation'

// Ruta de redirección al checkout de MercadoPago
// Recibe los params via GET y hace el POST internamente
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const plan = searchParams.get('plan') || ''
  const monto = searchParams.get('monto') || '0'
  const user_id = searchParams.get('user_id') || ''
  const email = searchParams.get('email') || ''

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://waveproject-chile.vercel.app'}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, monto: Number(monto), titulo: plan, user_id, email }),
    })
    const data = await res.json()
    if (data.init_point) redirect(data.init_point)
  } catch {}

  redirect('/mi-cuenta')
}
