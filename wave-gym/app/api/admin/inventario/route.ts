import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const sb = getSupabaseAdmin()

  const [{ data: items, error: itemsErr }, { data: cats, error: catsErr }] = await Promise.all([
    sb.from('inventario').select('*').order('created_at', { ascending: false }),
    sb.from('categorias_inventario').select('*').order('nombre'),
  ])

  if (itemsErr || catsErr) {
    return Response.json({ error: itemsErr?.message ?? catsErr?.message }, { status: 500 })
  }

  return Response.json({ items: items ?? [], categorias: cats ?? [] })
}

export async function POST(req: Request) {
  const sb = getSupabaseAdmin()
  const body = await req.json()

  // Si viene nueva_categoria, crearla primero
  if (body.nueva_categoria) {
    const nombre = body.nueva_categoria.trim()
    const { data: cat, error: catErr } = await sb
      .from('categorias_inventario')
      .insert({ nombre })
      .select()
      .single()
    if (catErr) return Response.json({ error: catErr.message }, { status: 400 })
    body.categoria_id = cat.id
  }

  const { nueva_categoria: _, ...item } = body
  const { data, error } = await sb.from('inventario').insert(item).select().single()

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json(data, { status: 201 })
}
