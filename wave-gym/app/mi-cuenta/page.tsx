import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CreditCard, LogOut, CheckCircle, Clock } from 'lucide-react';

export default async function MiCuentaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Obtener perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Obtener estado de pago de la última venta
  const { data: latestSale } = await supabase
    .from('ventas')
    .select('estado')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Mapeamos 'aprobado' a 'activo' visualmente
  const isPaid = latestSale?.estado === 'aprobado' || latestSale?.estado === 'activo';
  const estadoPago = isPaid ? 'ACTIVO' : 'PENDIENTE';
  
  // Determinamos el plan
  const planContratado = profile?.plan || 'NO ESPECIFICADO';

  return (
    <div className="bg-[#050505] min-h-screen flex flex-col font-sans selection:bg-[#C9A84C] selection:text-black">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-24 relative overflow-hidden">
        {/* Fondo radial para dar textura dark luxury */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(201,168,76,0.03),transparent)] pointer-events-none" />

        <div className="w-full max-w-3xl relative z-10">
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-widest text-white mb-10 text-center">
            MI CUENTA
          </h1>
          
          <div className="bg-[#0A0A0A] border border-white/10 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Cabecera perfil */}
            <div className="border-b border-white/10 pb-8 mb-8 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {profile?.nombre || 'USUARIO'}
                </h2>
                <p className="text-[#888] text-sm tracking-widest font-mono">
                  {user.email}
                </p>
              </div>
              
              <form action="/auth/signout" method="post">
                <button className="flex items-center gap-2 border border-white/20 text-[#888] hover:text-white hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5 transition-all px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded">
                  <LogOut size={14} />
                  CerrAR SESIÓN
                </button>
              </form>
            </div>

            {/* Detalles del Plan */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-black/50 border border-white/5 p-6 flex flex-col">
                <p className="text-[#555] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">PLAN CONTRATADO</p>
                <p className="text-2xl font-black text-white uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {planContratado}
                </p>
              </div>
              
              <div className="bg-black/50 border border-white/5 p-6 flex flex-col">
                <p className="text-[#555] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">ESTADO DE PAGO</p>
                <div className="flex items-center gap-3">
                  {isPaid ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : (
                    <Clock className="text-yellow-500" size={24} />
                  )}
                  <p className={`text-2xl font-black uppercase tracking-wider ${isPaid ? 'text-green-500' : 'text-yellow-500'}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {estadoPago}
                  </p>
                </div>
              </div>
            </div>

            {/* Acción de Pago */}
            {!isPaid && (
              <div className="text-center mt-10">
                <p className="text-[#888] text-sm mb-6 max-w-md mx-auto">
                  Para activar tu membresía y asegurar tu cupo en la preventa, por favor completa el pago de tu plan.
                </p>
                
                {/* Formulario que hace POST a /api/checkout (o redirecciona vía GET) */}
                <form action={`/api/checkout`} method="GET">
                  <input type="hidden" name="plan" value={planContratado} />
                  <button className="flex items-center justify-center gap-3 w-full md:w-auto md:mx-auto relative overflow-hidden group px-10 py-4 font-black text-sm tracking-[0.2em] uppercase text-black"
                          style={{
                            background: 'linear-gradient(120deg, #C9A84C 0%, #F5C842 50%, #C9A84C 100%)',
                            backgroundSize: '200% auto',
                            transition: 'background-position 0.4s ease, box-shadow 0.3s ease',
                          }}
                          onMouseEnter={e => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.backgroundPosition = 'right center';
                            el.style.boxShadow = '0 0 30px rgba(201,168,76,0.3)';
                          }}
                          onMouseLeave={e => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.backgroundPosition = 'left center';
                            el.style.boxShadow = 'none';
                          }}
                  >
                    <CreditCard size={18} strokeWidth={2.5} />
                    PAGAR AHORA
                  </button>
                </form>
              </div>
            )}
            
            {isPaid && (
              <div className="text-center mt-10 p-6 border border-green-500/20 bg-green-500/5">
                <p className="text-green-400 font-bold tracking-widest uppercase text-sm">
                  PLAN ACTIVO ✓
                </p>
                <p className="text-[#888] text-xs mt-2">
                  Gracias por ser parte de Wave Project Gym.
                </p>
              </div>
            )}
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
