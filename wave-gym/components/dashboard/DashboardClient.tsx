'use client';
import { useState } from 'react';
import { BarChart3, Users, LogOut, Gauge, Tag, RefreshCw, CalendarDays, TrendingUp } from 'lucide-react';
import VentasSection from './VentasSection';
import ClientesSection from './ClientesSection';
import ContadorSection from './ContadorSection';
import RenovacionesSection from './RenovacionesSection';
import PlanesSection from './PlanesSection';
import BalanceSection from './BalanceSection';

type Section = 'ventas' | 'clientes' | 'contador' | 'preventa1' | 'preventa2' | 'renovaciones' | 'planes' | 'balance';

interface Props {
  adminNombre: string;
  clientes: any[];
  cuposConfig: { cupos_vendidos: number; total_cupos: number };
}

// Preventa 1: hasta el 12/07/2026 23:59:59 Chile (UTC-4)
const CORTE_P1 = new Date('2026-07-12T23:59:59-04:00');

const NAV = [
  { id: 'balance'      as Section, label: 'BALANCE',        icon: TrendingUp },
  { id: 'clientes'     as Section, label: 'CLIENTES',       icon: Users },
  { id: 'ventas'       as Section, label: 'VENTAS',         icon: BarChart3 },
  { id: 'planes'       as Section, label: 'PLANES',         icon: CalendarDays },
  { id: 'preventa1'    as Section, label: 'PREVENTA 1',     icon: Tag },
  { id: 'preventa2'    as Section, label: 'PREVENTA 2',     icon: Tag },
  { id: 'renovaciones' as Section, label: 'RENOVACIONES',   icon: RefreshCw },
  { id: 'contador'     as Section, label: 'CONTADOR',       icon: Gauge },
];

export default function DashboardClient({ adminNombre, clientes, cuposConfig }: Props) {
  const [section, setSection] = useState<Section>('balance');

  const ventasAprobadas = clientes.filter((c) => c.estado_pago === 'aprobado');
  const totalIngresos = ventasAprobadas.reduce((s, c) => s + (c.monto || 0), 0);
  const totalVentas = ventasAprobadas.length;
  const clientesActivos = ventasAprobadas.length;

  // Segmentación por fecha de pago
  const clientesPreventa1 = ventasAprobadas.filter((c) => {
    if (!c.fecha_pago) return false;
    return new Date(c.fecha_pago) <= CORTE_P1;
  });
  const clientesPreventa2 = ventasAprobadas.filter((c) => {
    if (!c.fecha_pago) return false;
    return new Date(c.fecha_pago) > CORTE_P1;
  });

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-hair bg-ink-900 flex flex-col shrink-0">
        <div className="p-5 border-b border-hair">
          <div className="font-display text-xl tracking-wider text-white">WAVE</div>
          <div className="font-heading text-[9px] tracking-[0.3em] text-accent mt-0.5">DASHBOARD</div>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left font-heading text-[10px] tracking-[0.15em] uppercase transition-all duration-200 ${
                section === item.id
                  ? 'text-accent bg-[rgb(var(--accent)/0.08)] border-r-2 border-accent'
                  : 'text-chalk-muted hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-5 border-t border-hair">
          <div className="font-heading text-[10px] text-chalk-faint tracking-wider truncate">{adminNombre}</div>
          <a href="/" className="flex items-center gap-2 mt-3 font-heading text-[9px] text-chalk-faint hover:text-accent tracking-widest transition-colors">
            <LogOut size={11} /> SALIR
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'INGRESOS TOTALES',  value: fmt(totalIngresos) },
            { label: 'VENTAS APROBADAS',  value: String(totalVentas) },
            { label: 'CLIENTES ACTIVOS',  value: String(clientesActivos) },
          ].map((m) => (
            <div key={m.label} className="border border-hair bg-ink-900 p-5">
              <div className="font-heading text-[9px] tracking-[0.2em] text-chalk-faint uppercase">{m.label}</div>
              <div className="font-display text-3xl text-white mt-1">{m.value}</div>
            </div>
          ))}
        </div>

        {section === 'balance'       && <BalanceSection clientes={ventasAprobadas} fmt={fmt} />}
        {section === 'ventas'        && <VentasSection ventas={clientes} fmt={fmt} />}
        {section === 'clientes'      && <ClientesSection clientes={ventasAprobadas} titulo="TODOS LOS CLIENTES" />}
        {section === 'planes'        && <PlanesSection clientes={ventasAprobadas} />}
        {section === 'preventa1' && (
          <ClientesSection
            clientes={clientesPreventa1}
            titulo="PREVENTA 1 — hasta 12/07/2026"
            badge="P1"
          />
        )}
        {section === 'preventa2' && (
          <ClientesSection
            clientes={clientesPreventa2}
            titulo="PREVENTA 2 — 13/07 al 31/07/2026"
            badge="P2"
          />
        )}
        {section === 'contador'      && (
          <ContadorSection
            cuposVendidos={cuposConfig.cupos_vendidos}
            totalCupos={cuposConfig.total_cupos}
          />
        )}
        {section === 'renovaciones'  && <RenovacionesSection clientes={ventasAprobadas} />}
      </main>
    </div>
  );
}
