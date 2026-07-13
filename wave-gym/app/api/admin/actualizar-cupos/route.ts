import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'
import { clampCupos } from '@/lib/preventa'

/**
 * Control de stock de la preventa (ventas físicas + online).
 * Escribe en cupos_config. El home escucha realtime y se actualiza solo.
 * Solo admin. No toca el flujo de pagos (el webnify sigue sumando online).
 *
 * Body: { cuposVendidos?: number, totalCupos?: number }
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'No autorizado' }, { status: 401 })

    const { data: profile } = await getSupabaseAdmin()
      .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return Response.json({ error: 'Prohibido' }, { status: 403 })

    const { cuposVendidos, totalCupos } = await req.json()

    // Config activa
    const { data: cfg, error: getErr } = await getSupabaseAdmin()
      .from('cupos_config')
      .select('id, cupos_vendidos, total_cupos')
      .eq('activo', true)
      .single()

    if (getErr || !cfg) {
      return Response.json({ error: 'No se encontró la configuración de cupos activa' }, { status: 404 })
    }

    const nuevoTotal =
      totalCupos !== undefined ? Math.max(0, Math.floor(Number(totalCupos))) : cfg.total_cupos

    const updateData: { cupos_vendidos?: number; total_cupos?: number } = {}

    if (totalCupos !== undefined) {
      if (Number.isNaN(nuevoTotal)) return Response.json({ error: 'Total inválido' }, { status: 400 })
      updateData.total_cupos = nuevoTotal
    }

    if (cuposVendidos !== undefined) {
      const v = Math.floor(Number(cuposVendidos))
      if (Number.isNaN(v)) return Response.json({ error: 'Vendidos inválido' }, { status: 400 })
      // No permitir vendidos negativos ni por encima del total
      updateData.cupos_vendidos = clampCupos(v, nuevoTotal)
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: 'Nada para actualizar' }, { status: 400 })
    }

    const { data: updated, error } = await getSupabaseAdmin()
      .from('cupos_config')
      .update(updateData)
      .eq('id', cfg.id)
      .select('cupos_vendidos, total_cupos')
      .single()

    if (error) return Response.json({ error: error.message }, { status: 400 })
    return Response.json({ success: true, ...updated })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
