import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'

const CORTE_P1 = new Date('2026-07-12T23:59:59-04:00')

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'No autorizado' }, { status: 401 })

    const { data: profile } = await getSupabaseAdmin()
      .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return Response.json({ error: 'Prohibido' }, { status: 403 })

    const { clienteId } = await req.json()
    if (!clienteId) return Response.json({ error: 'clienteId requerido' }, { status: 400 })

    // Obtener cliente actual
    const { data: cliente, error: getErr } = await getSupabaseAdmin()
      .from('clientes')
      .select('id, fecha_pago, renovaciones_usadas')
      .eq('id', clienteId)
      .single()

    if (getErr || !cliente) return Response.json({ error: 'Cliente no encontrado' }, { status: 404 })

    // Determinar máximo según preventa
    const esP1 = cliente.fecha_pago && new Date(cliente.fecha_pago) <= CORTE_P1
    const maxRenovaciones = esP1 ? 4 : 2
    const usadas = cliente.renovaciones_usadas ?? 0

    if (usadas >= maxRenovaciones) {
      return Response.json({ error: `Límite alcanzado (${maxRenovaciones} renovaciones)` }, { status: 409 })
    }

    const { data: updated, error: updErr } = await getSupabaseAdmin()
      .from('clientes')
      .update({ renovaciones_usadas: usadas + 1 })
      .eq('id', clienteId)
      .select('renovaciones_usadas')
      .single()

    if (updErr) return Response.json({ error: updErr.message }, { status: 500 })

    return Response.json({
      success: true,
      renovaciones_usadas: updated.renovaciones_usadas,
      renovaciones_restantes: maxRenovaciones - updated.renovaciones_usadas,
      max: maxRenovaciones,
    })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
