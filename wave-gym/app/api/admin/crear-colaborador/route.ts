import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'No autorizado' }, { status: 401 })
    
    const { data: profile } = await getSupabaseAdmin().from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return Response.json({ error: 'Prohibido' }, { status: 403 })

    const { nombre, email, password, role } = await req.json()

    const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error || !data.user) {
      return Response.json({ error: error?.message || 'Error al crear usuario' }, { status: 400 })
    }

    await getSupabaseAdmin().from('profiles').insert({
      id: data.user.id,
      nombre,
      role: role || 'colaborador',
    })

    return Response.json({ success: true, userId: data.user.id })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
