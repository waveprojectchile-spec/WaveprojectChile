import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('cupos_config')
      .select('cupos_vendidos, total_cupos')
      .eq('activo', true)
      .single()

    if (error || !data) {
      return Response.json(
        { cupos_vendidos: 0, total_cupos: 50 },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache' } }
      )
    }

    return Response.json(
      data,
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache' } }
    )
  } catch {
    return Response.json({ cupos_vendidos: 0, total_cupos: 50 })
  }
}
