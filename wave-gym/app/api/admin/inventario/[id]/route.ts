import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const sb = getSupabaseAdmin()
  const body = await req.json()

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

  const { nueva_categoria: _, ...updates } = body
  const { data, error } = await sb
    .from('inventario')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json(data)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const sb = getSupabaseAdmin()
  const { error } = await sb.from('inventario').delete().eq('id', params.id)
  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json({ ok: true })
}
