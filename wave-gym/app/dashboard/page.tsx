import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import DashboardClient from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await getSupabaseAdmin()
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/mi-cuenta')

  // Obtener datos reales de Supabase en paralelo para optimizar tiempo de carga
  const [
    { data: clientes },
    { data: ventas },
    { data: productos },
    { data: colaboradores }
  ] = await Promise.all([
    getSupabaseAdmin()
      .from('profiles')
      .select('*')
      .eq('role', 'cliente')
      .order('created_at', { ascending: false }),
    getSupabaseAdmin()
      .from('ventas')
      .select('*')
      .order('created_at', { ascending: false }),
    getSupabaseAdmin()
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false }),
    getSupabaseAdmin()
      .from('profiles')
      .select('*')
      .in('role', ['admin', 'colaborador'])
      .order('created_at', { ascending: false })
  ])

  // Calcular métricas
  const ingresosActuales = (ventas || []).reduce((acc: number, v: any) => acc + (v.monto || 0), 0)
  const metricas = {
    ingresos: ingresosActuales,
    ventas: ventas?.length || 0,
    clientes: clientes?.length || 0,
  }

  return (
    <DashboardClient 
      clientes={clientes || []}
      ventas={ventas || []}
      productos={productos || []}
      colaboradores={colaboradores || []}
      metricas={metricas}
    />
  )
}
