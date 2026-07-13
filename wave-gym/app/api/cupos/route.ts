import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

async function getCupos() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('cupos_config')
      .select('cupos_vendidos, total_cupos')
      .eq('activo', true)
      .single()

    if (error || !data) return { cupos_vendidos: 0, total_cupos: 50 }
    return data
  } catch {
    return { cupos_vendidos: 0, total_cupos: 50 }
  }
}

export async function GET() {
  const data = await getCupos()
  return Response.json(data, {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache' },
  })
}

// POST evita caché del browser y de Vercel CDN
export async function POST() {
  const data = await getCupos()
  return Response.json(data)
}

