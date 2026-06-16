import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'No autorizado' }, { status: 401 })
    
    const { data: profile } = await getSupabaseAdmin().from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return Response.json({ error: 'Prohibido' }, { status: 403 })

    const { id, stock, activo } = await req.json()

    if (!id) return Response.json({ error: 'Falta el ID del producto' }, { status: 400 })

    const updateData: any = {}
    if (stock !== undefined) updateData.stock = Number(stock)
    if (activo !== undefined) updateData.activo = Boolean(activo)

    const { error } = await getSupabaseAdmin().from('productos').update(updateData).eq('id', id)

    if (error) return Response.json({ error: error.message }, { status: 400 })
    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
