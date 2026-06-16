import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redirect } from 'next/navigation'
import { CheckCircle, Clock, AlertCircle, LogOut, CreditCard } from 'lucide-react'

const fmt = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)

const PRECIOS: Record<string, number> = {
  MENSUAL: 32990, TRIMESTRAL: 98970, SEMESTRAL: 197940, ANUAL: 395880,
}

const ESTADO_CONFIG: Record<string, { label: string; color: string; Icon: any }> = {
  activo: { label: 'ACTIVO', color: 'text-green-400 bg-green-500/10 border-green-500/20', Icon: CheckCircle },
  pendiente: { label: 'PENDIENTE', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', Icon: Clock },
  vencido: { label: 'VENCIDO', color: 'text-red-400 bg-red-500/10 border-red-500/20', Icon: AlertCircle },
}

export default async function MiCuentaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin' || profile?.role === 'colaborador') {
    redirect('/dashboard')
  }

  const estadoCfg = ESTADO_CONFIG[profile?.estado_pago || 'pendiente'] || ESTADO_CONFIG.pendiente
  const { Icon: EstadoIcon } = estadoCfg
  const isPaid = profile?.estado_pago === 'activo'
  const monto = profile?.plan ? PRECIOS[profile.plan.toUpperCase()] || 0 : 0

  return (
    <div className="bg-[#050505] min-h-screen flex flex-col selection:bg-[#FFD600] selection:text-black">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,214,0,0.03),transparent)] pointer-events-none" />
        <div className="w-full max-w-3xl relative z-10">
          <h1 className="text-4xl font-black uppercase tracking-widest text-white mb-2 text-center">
            HOLA, <span style={{ color: '#FFD600' }}>{(profile?.nombre || user.email || '').toUpperCase().split(' ')[0]}</span>
          </h1>
          <p className="text-center text-white/30 text-xs tracking-widest mb-10">{user.email}</p>

          <div className="bg-[#0A0A0A] border border-white/10 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-white/10 pb-8 mb-8">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase mb-1">NOMBRE</p>
                <p className="text-xl font-black text-white uppercase tracking-wider">{profile?.nombre || '—'}</p>
              </div>
              <form action="/auth/signout" method="post">
                <button className="flex items-center gap-2 border border-white/10 text-white/30 hover:text-white hover:border-[#FFD600]/40 transition-all px-5 py-2.5 text-xs font-bold uppercase tracking-widest">
                  <LogOut size={13} /> CERRAR SESIÓN
                </button>
              </form>
            </div>

            {/* Cards plan + estado */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-black border border-white/5 p-6">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase mb-3">PLAN CONTRATADO</p>
                <p className="text-3xl font-black text-white uppercase tracking-wider">
                  {profile?.plan || <span className="text-white/20 text-lg">Sin plan</span>}
                </p>
                {monto > 0 && <p className="text-[#FFD600] font-bold mt-1">{fmt(monto)}</p>}
              </div>
              <div className="bg-black border border-white/5 p-6">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase mb-3">ESTADO DE PAGO</p>
                <div className="flex items-center gap-3">
                  <EstadoIcon className={estadoCfg.color.split(' ')[0]} size={24} />
                  <span className={`text-2xl font-black uppercase tracking-wider ${estadoCfg.color.split(' ')[0]}`}>
                    {estadoCfg.label}
                  </span>
                </div>
                {profile?.fecha_pago && (
                  <p className="text-white/20 text-[10px] mt-2">Pagado el {new Date(profile.fecha_pago).toLocaleDateString('es-CL')}</p>
                )}
              </div>
            </div>

            {/* Acción */}
            {!isPaid && profile?.plan && (
              <div className="text-center">
                <p className="text-white/30 text-sm mb-6">Completa el pago para activar tu membresía y asegurar tu cupo.</p>
                <form action="/api/checkout-redirect" method="get">
                  <input type="hidden" name="plan" value={profile.plan} />
                  <input type="hidden" name="monto" value={monto} />
                  <input type="hidden" name="user_id" value={user.id} />
                  <input type="hidden" name="email" value={user.email || ''} />
                  <button type="submit"
                    className="flex items-center justify-center gap-3 mx-auto px-10 py-4 font-black text-sm tracking-[0.2em] uppercase text-black"
                    style={{ background: 'linear-gradient(120deg, #C9A84C 0%, #FFD600 50%, #C9A84C 100%)', backgroundSize: '200% auto' }}
                  >
                    <CreditCard size={18} strokeWidth={2.5} />
                    PAGAR AHORA
                  </button>
                </form>
              </div>
            )}
            {isPaid && (
              <div className="text-center p-6 border border-green-500/20 bg-green-500/5">
                <p className="text-green-400 font-black tracking-widest uppercase">PLAN ACTIVO ✓</p>
                <p className="text-white/30 text-xs mt-2">Gracias por ser parte de Wave Project Gym.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
