'use client';
import { useMemo, useState } from 'react';
import { X, Clock, CheckCircle, AlertTriangle, XCircle, CalendarDays } from 'lucide-react';

interface Props {
  clientes: any[];
}

// Todos los planes arrancan el 01/08/2026
const INICIO_PLANES = new Date('2026-08-01T00:00:00-04:00');

const DURACION_DIAS: Record<string, number> = {
  mensual:     30,
  trimestral:  90,
  semestral:  180,
  anual:      365,
};

type Estado = 'pendiente' | 'activo' | 'por-vencer' | 'vencido';

function calcPlan(cliente: any, hoy: Date) {
  const plan = cliente.plan?.toLowerCase() ?? 'mensual';
  const dias = DURACION_DIAS[plan] ?? 30;
  const inicio = INICIO_PLANES;
  const fin = new Date(inicio.getTime() + dias * 86_400_000);
  const diasTotal = dias;
  const diasRestantes = Math.max(0, Math.ceil((fin.getTime() - hoy.getTime()) / 86_400_000));
  const diasTranscurridos = Math.max(0, diasTotal - diasRestantes);
  const progreso = Math.min(1, diasTranscurridos / diasTotal);

  let estado: Estado;
  if (hoy < inicio)            estado = 'pendiente';
  else if (diasRestantes <= 0) estado = 'vencido';
  else if (diasRestantes <= 7) estado = 'por-vencer';
  else                         estado = 'activo';

  return { inicio, fin, diasTotal, diasRestantes, diasTranscurridos, progreso, estado };
}

const ESTADO_META = {
  pendiente:   { label: 'AÚN NO INICIÓ', color: 'text-[#555]',      bg: 'bg-[#555]/10',      border: 'border-[#555]/20',      icon: Clock },
  activo:      { label: 'ACTIVO',         color: 'text-accent',      bg: 'bg-accent/10',      border: 'border-accent/20',      icon: CheckCircle },
  'por-vencer':{ label: 'POR VENCER',     color: 'text-yellow-400',  bg: 'bg-yellow-400/10',  border: 'border-yellow-400/20',  icon: AlertTriangle },
  vencido:     { label: 'VENCIDO',        color: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/20',     icon: XCircle },
};

const FILTROS = ['TODOS', 'activo', 'pendiente', 'por-vencer', 'vencido', 'mensual', 'trimestral', 'semestral', 'anual'];

export default function PlanesSection({ clientes }: Props) {
  const [filtro, setFiltro] = useState('TODOS');
  const [selected, setSelected] = useState<any>(null);
  const hoy = useMemo(() => new Date(), []);

  const clientesConPlan = useMemo(() =>
    clientes.map(c => ({ ...c, _plan: calcPlan(c, hoy) }))
    .sort((a, b) => a._plan.diasRestantes - b._plan.diasRestantes),
    [clientes, hoy]
  );

  const filtrados = useMemo(() => {
    if (filtro === 'TODOS') return clientesConPlan;
    const estadoKeys = ['activo', 'pendiente', 'por-vencer', 'vencido'];
    if (estadoKeys.includes(filtro)) return clientesConPlan.filter(c => c._plan.estado === filtro);
    return clientesConPlan.filter(c => c.plan?.toLowerCase() === filtro);
  }, [clientesConPlan, filtro]);

  // Estadísticas globales
  const stats = useMemo(() => ({
    activos:    clientesConPlan.filter(c => c._plan.estado === 'activo').length,
    pendientes: clientesConPlan.filter(c => c._plan.estado === 'pendiente').length,
    porVencer:  clientesConPlan.filter(c => c._plan.estado === 'por-vencer').length,
    vencidos:   clientesConPlan.filter(c => c._plan.estado === 'vencido').length,
  }), [clientesConPlan]);

  return (
    <>
      {/* Cards resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'ACTIVOS',     val: stats.activos,    color: 'text-accent',     estado: 'activo' },
          { label: 'PENDIENTES',  val: stats.pendientes, color: 'text-[#666]',     estado: 'pendiente' },
          { label: 'POR VENCER',  val: stats.porVencer,  color: 'text-yellow-400', estado: 'por-vencer' },
          { label: 'VENCIDOS',    val: stats.vencidos,   color: 'text-red-400',    estado: 'vencido' },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setFiltro(filtro === s.estado ? 'TODOS' : s.estado)}
            className={`border p-4 text-left transition-all duration-200 ${
              filtro === s.estado ? 'border-white/15 bg-white/[0.03]' : 'border-white/5 bg-[#0A0A0A] hover:border-white/10'
            }`}
          >
            <div className="font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase mb-1">{s.label}</div>
            <div className={`font-display text-3xl ${s.color}`}>{s.val}</div>
          </button>
        ))}
      </div>

      <div className="border border-white/5 bg-[#0A0A0A] overflow-hidden">
        {/* Header + filtros */}
        <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-heading font-bold text-xs tracking-[0.15em] text-white uppercase">
              PLANES ({filtrados.length})
            </div>
            <div className="font-body text-[10px] text-[#555] mt-0.5 flex items-center gap-1.5">
              <CalendarDays size={10} />
              Todos los planes arrancan el 01 agosto 2026
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTROS.map(f => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-3 py-1.5 font-heading text-[9px] tracking-widest uppercase transition-colors border ${
                  filtro === f
                    ? 'bg-accent/10 border-accent/50 text-accent'
                    : 'bg-transparent border-white/10 text-[#666] hover:text-white hover:border-white/30'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtrados.length === 0 ? (
          <div className="p-10 text-center">
            <div className="font-heading text-[11px] text-[#444] tracking-widest uppercase">
              No hay clientes en este filtro
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['NOMBRE', 'PLAN', 'ESTADO', 'PROGRESO', 'DÍAS RESTANTES', 'VENCE'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c, i) => {
                  const { estado: _estado, diasRestantes, diasTotal, progreso, fin } = c._plan;
                  const estado = _estado as Estado;
                  const meta = ESTADO_META[estado];
                  const Icon = meta.icon;

                  return (
                    <tr
                      key={c.id || i}
                      onClick={() => setSelected(c)}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3">
                        <div className="font-heading text-xs text-white tracking-wider">{c.nombre || '—'}</div>
                        <div className="font-body text-[10px] text-[#555] mt-0.5">{c.rut || c.email || ''}</div>
                      </td>
                      <td className="px-5 py-3 font-heading text-[10px] text-white tracking-wider uppercase">
                        {c.plan || '—'}
                        <div className="font-body text-[9px] text-[#444] mt-0.5">{diasTotal} días</div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 font-heading text-[9px] tracking-widest uppercase border ${meta.color} ${meta.bg} ${meta.border}`}>
                          <Icon size={9} />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 min-w-[120px]">
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              estado === 'vencido' ? 'bg-red-400/60' :
                              estado === 'por-vencer' ? 'bg-yellow-400/60' :
                              estado === 'pendiente' ? 'bg-white/10' :
                              'bg-accent/70'
                            }`}
                            style={{ width: `${progreso * 100}%` }}
                          />
                        </div>
                        <div className="font-body text-[9px] text-[#444] mt-1">
                          {Math.round(progreso * 100)}% transcurrido
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`font-heading text-sm font-bold ${
                          estado === 'vencido'     ? 'text-red-400' :
                          estado === 'por-vencer'  ? 'text-yellow-400' :
                          estado === 'pendiente'   ? 'text-[#555]' :
                          'text-white'
                        }`}>
                          {estado === 'pendiente' ? `${Math.ceil((INICIO_PLANES.getTime() - hoy.getTime()) / 86_400_000)} para inicio` :
                           estado === 'vencido'   ? 'VENCIDO' :
                           `${diasRestantes} días`}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-body text-[11px] text-[#555]">
                        {fin.toLocaleDateString('es-CL')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal detalle */}
      {selected && (() => {
        const { inicio, fin, diasTotal, diasRestantes, diasTranscurridos, progreso, estado: _e } = selected._plan;
        const estado = _e as Estado;
        const meta = ESTADO_META[estado];
        const Icon = meta.icon;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <div className="bg-[#0E0E0E] border border-white/10 w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors">
                <X size={16} />
              </button>

              <div className="font-display text-2xl text-white mb-0.5">{selected.nombre || 'Sin nombre'}</div>
              <div className="font-body text-[11px] text-[#555] mb-5">{selected.email}</div>

              {/* Estado badge */}
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 font-heading text-[10px] tracking-widest uppercase border mb-5 ${meta.color} ${meta.bg} ${meta.border}`}>
                <Icon size={11} />
                {meta.label}
              </span>

              {/* Barra de progreso grande */}
              <div className="mb-5 p-4 border border-white/5 bg-[#0A0A0A]">
                <div className="font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase mb-3">
                  {selected.plan?.toUpperCase()} — {diasTotal} días totales
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${
                      estado === 'vencido' ? 'bg-red-400/70' :
                      estado === 'por-vencer' ? 'bg-yellow-400/70' :
                      estado === 'pendiente' ? 'bg-white/10' :
                      'bg-accent/80'
                    }`}
                    style={{ width: `${progreso * 100}%` }}
                  />
                </div>
                <div className="flex justify-between font-heading text-[10px] tracking-widest">
                  <span className="text-[#555]">{diasTranscurridos} días usados</span>
                  <span className={meta.color}>{diasRestantes} días restantes</span>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['RUT',          selected.rut],
                  ['Teléfono',     selected.telefono],
                  ['Plan',         selected.plan?.toUpperCase()],
                  ['Monto pagado', selected.monto ? `$${selected.monto.toLocaleString('es-CL')}` : '—'],
                  ['Inicio plan',  inicio.toLocaleDateString('es-CL')],
                  ['Fin plan',     fin.toLocaleDateString('es-CL')],
                  ['Fecha pago',   selected.fecha_pago ? new Date(selected.fecha_pago).toLocaleDateString('es-CL') : '—'],
                  ['Preventa',     selected.fecha_pago && new Date(selected.fecha_pago) <= new Date('2026-07-12T23:59:59-04:00') ? 'Preventa 1' : 'Preventa 2'],
                ].map(([label, val]) => (
                  <div key={label as string}>
                    <div className="font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase mb-1">{label}</div>
                    <div className="font-body text-sm text-white">{(val as string) || '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
