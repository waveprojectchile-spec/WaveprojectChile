import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import DashboardClient from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, nombre')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/mi-cuenta')

  // Cargar datos en paralelo
  const [
    { data: clientes },
    { data: ventas },
    { data: colaboradores },
    { data: productos },
  ] = await Promise.all([
    supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('role', 'cliente')
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('ventas')
      .select('*')
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('profiles')
      .select('*')
      .in('role', ['admin', 'colaborador'])
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false }),
  ])

  return (
    <DashboardClient
      adminNombre={profile?.nombre || user.email || 'Admin'}
      clientes={clientes || []}
      ventas={ventas || []}
      colaboradores={colaboradores || []}
      productos={productos || []}
    />
  )
}
