'use server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    return { error: 'Credenciales incorrectas' }
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  // CRÍTICO: redirect() FUERA de try/catch
  if (profile?.role === 'admin') redirect('/dashboard')
  redirect('/mi-cuenta')
}

export async function registerAction(formData: FormData) {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nombre = formData.get('nombre') as string
  const rut = formData.get('rut') as string
  const telefono = formData.get('telefono') as string
  const fecha_nacimiento = formData.get('fecha_nacimiento') as string
  const plan = formData.get('plan') as string
  const direccion = formData.get('direccion') as string
  const ciudad = formData.get('ciudad') as string
  const region = formData.get('region') as string
  const codigo_postal = formData.get('codigo_postal') as string
  const enfermedades = (formData.get('enfermedades') as string) || null
  const operaciones = (formData.get('operaciones') as string) || null
  const medicamentos = (formData.get('medicamentos') as string) || null
  const lesiones = (formData.get('lesiones') as string) || null

  const birthDate = new Date(fecha_nacimiento)
  const edad = Math.floor(
    (Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  )

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error || !data.user) return { error: error?.message || 'Error al crear usuario' }

  await supabaseAdmin.from('profiles').insert({
    id: data.user.id,
    role: 'cliente',
    nombre, rut, telefono, fecha_nacimiento, edad,
    plan, direccion, ciudad, region, codigo_postal,
    enfermedades, operaciones, medicamentos, lesiones,
    estado_pago: 'pendiente',
  })

  redirect('/confirmar-email')
}
