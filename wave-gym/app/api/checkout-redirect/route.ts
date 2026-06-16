import { redirect } from 'next/navigation'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const plan = formData.get('plan')?.toString() || ''
    const monto = formData.get('monto')?.toString() || '0'
    const titulo = formData.get('titulo')?.toString() || plan

    // Reenviar las cookies para que /api/checkout pueda leer la sesión del usuario
    const cookieHeader = req.headers.get('cookie') || ''

    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://waveproject-chile.vercel.app'}/api/checkout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(cookieHeader ? { 'cookie': cookieHeader } : {})
      },
      body: JSON.stringify({ plan, monto: Number(monto), titulo }),
    })
    
    const data = await res.json()
    if (data.init_point) {
      redirect(data.init_point)
    }
  } catch (err) {
    console.error('[CHECKOUT REDIRECT ERROR]', err)
  }

  redirect('/mi-cuenta')
}
