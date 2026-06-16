import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function MiCuentaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="bg-black min-h-screen flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-24">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-white mb-6">
            MI CUENTA
          </h1>
          <div className="bg-neutral-950 border border-neutral-800 p-8">
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">
              BIENVENIDO/A, TU CUENTA ESTÁ ACTIVA
            </h2>
            <p className="text-neutral-400 text-sm uppercase tracking-widest mb-8">
              {profile?.nombre || user.email}
            </p>
            <p className="text-neutral-500 text-xs">
              MÁS FUNCIONES ESTARÁN DISPONIBLES PRÓXIMAMENTE.
            </p>
            
            <form action="/auth/signout" method="post" className="mt-8">
              <button className="border border-neutral-800 text-white hover:bg-neutral-900 transition-colors px-8 py-3 text-sm font-bold uppercase tracking-widest">
                CERRAR SESIÓN
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
