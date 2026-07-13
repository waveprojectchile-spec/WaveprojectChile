import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { rut } = await req.json()
    if (!rut) return NextResponse.json({ error: 'RUT requerido' }, { status: 400 })

    const rutLimpio = rut.replace(/\s/g, '').toLowerCase()

    const { data: cliente, error } = await getSupabaseAdmin()
      .from('clientes')
      .select('id, nombre, email, plan, monto, fecha_pago, renovaciones_usadas, estado_pago')
      .ilike('rut', rutLimpio)
      .eq('estado_pago', 'aprobado')
      .order('fecha_pago', { ascending: false })
      .limit(1)
      .single()

    if (error || !cliente) {
      return NextResponse.json({ error: 'No encontramos una membresía activa con ese RUT' }, { status: 404 })
    }

    const CORTE_P1 = new Date('2026-07-12T23:59:59-04:00')
    const esP1 = cliente.fecha_pago && new Date(cliente.fecha_pago) <= CORTE_P1
    const maxRenovaciones = esP1 ? 4 : 2
    const usadas = cliente.renovaciones_usadas ?? 0
    const restantes = maxRenovaciones - usadas

    return NextResponse.json({
      id: cliente.id,
      nombre: cliente.nombre,
      email: cliente.email,
      plan: cliente.plan,
      monto: cliente.monto,
      renovaciones_usadas: usadas,
      renovaciones_restantes: restantes,
      max_renovaciones: maxRenovaciones,
      puede_renovar: restantes > 0,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
