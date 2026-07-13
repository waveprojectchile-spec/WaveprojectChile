import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY

    const { data, error } = await getSupabaseAdmin()
      .from('cupos_config')
      .select('cupos_vendidos, total_cupos')
      .eq('activo', true)
      .single()

    if (error || !data) {
      return Response.json(
        { cupos_vendidos: 0, total_cupos: 50, _debug: { hasServiceKey, error: error?.message } },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    }

    return Response.json(
      { ...data, _debug: { hasServiceKey } },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (e: any) {
    return Response.json(
      { cupos_vendidos: 0, total_cupos: 50, _debug: { error: e.message } },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
