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
    .select('role, nombre')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/mi-cuenta')

  // Obtener datos reales de Supabase en paralelo para optimizar tiempo de carga
  const [
    { data: clientes },
    { data: ventas }
  ] = await Promise.all([
    getSupabaseAdmin()
      .from('clientes')
      .select('*')
      .order('fecha_pago', { ascending: false }),
    getSupabaseAdmin()
      .from('ventas')
      .select('*')
      .order('created_at', { ascending: false })
  ])

  return (
    <DashboardClient 
      adminNombre={profile?.nombre || user.email || 'Admin'}
      clientes={clientes || []}
      ventas={ventas || []}
    />
  )
}
