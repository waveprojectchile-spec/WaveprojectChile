import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'No autorizado' }, { status: 401 })
    
    const { data: profile } = await getSupabaseAdmin().from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return Response.json({ error: 'Prohibido' }, { status: 403 })

    const body = await req.json()
    const { nombre, descripcion, precio, stock, categoria, es_preventa, imagen_url } = body

    const { error } = await getSupabaseAdmin().from('productos').insert({
      nombre,
      descripcion,
      precio: Number(precio),
      stock: Number(stock),
      stock_inicial: Number(stock),
      categoria,
      es_preventa: Boolean(es_preventa),
      imagen_url: imagen_url || null,
      activo: true,
    })

    if (error) return Response.json({ error: error.message }, { status: 400 })
    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
