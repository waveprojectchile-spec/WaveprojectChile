'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Correo y contraseña son requeridos' }
  }

  const supabase = await createClient()

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Credenciales inválidas' }
  }

  let userRole = 'cliente'
  let profileData = null
  
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY no está definida')
    }

    // Cliente con permisos totales para leer roles
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Después del login exitoso:
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('Error al obtener perfil:', profileError)
    } else {
      userRole = profile?.role || 'cliente'
      profileData = profile
      console.log('Profile encontrado:', profile)
    }
  } catch (err: any) {
    console.error('Error en Supabase Admin:', err.message)
    return { error: 'Error interno del servidor (ver logs)' }
  }

  console.log('=== AUTH DEBUG ===')
  console.log('User ID:', data.user.id)
  console.log('Profile data:', JSON.stringify(profileData))
  console.log('Role detectado:', userRole)
  console.log('==================')

  if (userRole === 'admin') {
    redirect('/dashboard')
  } else {
    redirect('/mi-cuenta')
  }
}

export async function registerAction(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nombre = formData.get('nombre') as string
  const rut = formData.get('rut') as string
  const fecha_nacimiento = formData.get('fecha_nacimiento') as string
  const telefono = formData.get('telefono') as string
  const plan = formData.get('plan') as string
  const direccion = formData.get('direccion') as string
  const ciudad = formData.get('ciudad') as string
  const region = formData.get('region') as string
  const codigo_postal = formData.get('codigo_postal') as string
  
  // Condicionales booleanos
  const enfermedades_cronicas = formData.get('enfermedades_cronicas') === 'on'
  const operaciones = formData.get('operaciones') === 'on'
  const medicamentos = formData.get('medicamentos') === 'on'
  const lesiones = formData.get('lesiones') === 'on'

  if (!email || !password || !nombre || !rut) {
    return { error: 'Faltan campos obligatorios' }
  }

  // 1. Crear usuario en Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError || !authData.user) {
    return { error: authError?.message || 'Error al crear usuario' }
  }

  // 2. Insertar en perfiles
  const { error: profileError } = await supabase.from('profiles').insert([
    {
      id: authData.user.id,
      role: 'cliente',
      nombre,
      rut,
      email, // guardado en auth y en profiles para fácil acceso
      fecha_nacimiento,
      telefono,
      plan,
      direccion,
      ciudad,
      region,
      codigo_postal,
      enfermedades_cronicas,
      operaciones,
      medicamentos,
      lesiones
    }
  ])

  if (profileError) {
    return { error: 'Error al guardar el perfil: ' + profileError.message }
  }

  redirect('/login?registered=true')
}
