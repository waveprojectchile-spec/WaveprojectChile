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

  // Obtener datos reales de Supabase
  const { data: clientes } = await getSupabaseAdmin()
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false });

  // Configuración de cupos (para el control de stock)
  const { data: cuposConfig } = await getSupabaseAdmin()
    .from('cupos_config')
    .select('cupos_vendidos, total_cupos')
    .eq('activo', true)
    .single();

  return (
    <DashboardClient
      adminNombre={profile?.nombre || user.email || 'Admin'}
      clientes={clientes || []}
      cuposConfig={cuposConfig || { cupos_vendidos: 0, total_cupos: 50 }}
    />
  )
}
