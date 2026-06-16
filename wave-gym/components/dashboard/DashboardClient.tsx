'use client';
import { useState } from 'react';
import { BarChart3, Users, ShoppingBag, UserCog, Store, LogOut } from 'lucide-react';
import VentasSection from './VentasSection';
import ClientesSection from './ClientesSection';
import PreventasSection from './PreventasSection';
import PersonalSection from './PersonalSection';
import TiendaSection from './TiendaSection';

type Section = 'ventas' | 'clientes' | 'preventas' | 'personal' | 'tienda';

interface Props {
  adminNombre: string;
  clientes: any[];
  ventas: any[];
  colaboradores: any[];
  productos: any[];
}

const NAV = [
  { id: 'ventas' as Section, label: 'VENTAS', icon: BarChart3 },
  { id: 'clientes' as Section, label: 'CLIENTES', icon: Users },
  { id: 'preventas' as Section, label: 'PREVENTAS', icon: ShoppingBag },
  { id: 'personal' as Section, label: 'PERSONAL', icon: UserCog },
  { id: 'tienda' as Section, label: 'TIENDA', icon: Store },
];

export default function DashboardClient({ adminNombre, clientes, ventas, colaboradores, productos }: Props) {
  const [section, setSection] = useState<Section>('ventas');

  const ventasAprobadas = ventas.filter((v) => v.estado === 'aprobado' || v.estado === 'approved');
  const totalIngresos = ventasAprobadas.reduce((s, v) => s + (v.monto || 0), 0);
  const totalVentas = ventasAprobadas.length;
  const clientesActivos = clientes.filter((c) => c.estado_pago === 'activo').length;

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/5 bg-[#0A0A0A] flex flex-col shrink-0">
        <div className="p-5 border-b border-white/5">
          <div className="font-display text-xl tracking-wider text-white">WAVE</div>
          <div className="font-heading text-[9px] tracking-[0.3em] text-[#C9A84C] mt-0.5">DASHBOARD</div>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left font-heading text-[10px] tracking-[0.15em] uppercase transition-all duration-200 ${
                section === item.id
                  ? 'text-[#C9A84C] bg-[rgba(201,168,76,0.08)] border-r-2 border-[#C9A84C]'
                  : 'text-[#555] hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-5 border-t border-white/5">
          <div className="font-heading text-[10px] text-[#444] tracking-wider truncate">{adminNombre}</div>
          <a href="/" className="flex items-center gap-2 mt-3 font-heading text-[9px] text-[#333] hover:text-[#C9A84C] tracking-widest transition-colors">
            <LogOut size={11} /> SALIR
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'INGRESOS TOTALES', value: fmt(totalIngresos) },
            { label: 'VENTAS APROBADAS', value: String(totalVentas) },
            { label: 'CLIENTES ACTIVOS', value: String(clientesActivos) },
          ].map((m) => (
            <div key={m.label} className="border border-white/5 bg-[#0A0A0A] p-5">
              <div className="font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase">{m.label}</div>
              <div className="font-display text-3xl text-white mt-1">{m.value}</div>
            </div>
          ))}
        </div>

        {section === 'ventas' && <VentasSection ventas={ventas} fmt={fmt} />}
        {section === 'clientes' && <ClientesSection clientes={clientes} />}
        {section === 'preventas' && <PreventasSection productos={productos} fmt={fmt} />}
        {section === 'personal' && <PersonalSection colaboradores={colaboradores} />}
        {section === 'tienda' && <TiendaSection productos={productos} fmt={fmt} />}
      </main>
    </div>
  );
}
