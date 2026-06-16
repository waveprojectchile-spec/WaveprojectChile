import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  return handleSignOut(request)
}

export async function GET(request: Request) {
  return handleSignOut(request)
}

async function handleSignOut(request: Request) {
  const supabase = await createClient()

  // Cerrar sesión en el servidor
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error al cerrar sesión:', error)
  }

  // Redirigir al home o al login después de cerrar sesión
  return NextResponse.redirect(new URL('/', request.url))
}
