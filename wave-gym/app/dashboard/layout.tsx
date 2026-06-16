import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { LayoutDashboard, Users, CreditCard, UserPlus, LogOut } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-black flex font-sans text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-neutral-800">
          <Link href="/" className="font-bold text-xl uppercase tracking-[0.2em] text-white">
            WAVE<span className="text-[#888]">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white bg-neutral-900 rounded transition-colors hover:bg-neutral-800">
            <LayoutDashboard size={18} />
            VENTAS
          </Link>
          <Link href="/dashboard/clientes" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-neutral-400 rounded transition-colors hover:bg-neutral-900 hover:text-white">
            <Users size={18} />
            CLIENTES
          </Link>
          <Link href="/dashboard/preventas" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-neutral-400 rounded transition-colors hover:bg-neutral-900 hover:text-white">
            <CreditCard size={18} />
            PREVENTAS
          </Link>
          <Link href="/dashboard/personal" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-neutral-400 rounded transition-colors hover:bg-neutral-900 hover:text-white">
            <UserPlus size={18} />
            PERSONAL
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <div className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 truncate">
            {user.email}
          </div>
          <form action="/auth/signout" method="post">
            <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-neutral-400 rounded transition-colors hover:bg-neutral-900 hover:text-white">
              <LogOut size={18} />
              CERRAR SESIÓN
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black">
        <div className="p-8 md:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
