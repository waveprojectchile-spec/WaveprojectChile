'use client';
import { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface Venta {
  id: string;
  nombre: string;
  rut?: string;
  email?: string;
  plan: string;
  monto: number;
  estado_pago: string;
  fecha_pago?: string;
  created_at?: string;
  renovaciones_usadas?: number;
}

interface Props {
  ventas: any[];
  fmt: (n: number) => string;
}

const CORTE_P1 = new Date('2026-07-12T23:59:59-04:00');

const PLAN_BADGE: Record<string, string> = {
  mensual:    'border-accent/30 text-accent bg-accent/5',
  trimestral: 'border-blue-400/30 text-blue-400 bg-blue-400/5',
  semestral:  'border-purple-400/30 text-purple-400 bg-purple-400/5',
  anual:      'border-yellow-400/30 text-yellow-400 bg-yellow-400/5',
};

type SortKey = 'nombre' | 'plan' | 'monto' | 'fecha_pago';
type SortDir = 'asc' | 'desc';

export default function VentasSection({ ventas, fmt }: Props) {
  const [search, setSearch]       = useState('');
  const [filterPlan, setFilterPlan]   = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterPrev, setFilterPrev]   = useState('todos');
  const [sortKey, setSortKey]   = useState<SortKey>('fecha_pago');
  const [sortDir, setSortDir]   = useState<SortDir>('desc');

  const stats = useMemo(() => {
    const aprobadas = ventas.filter(v => v.estado_pago === 'aprobado');
    const pendientes = ventas.filter(v => v.estado_pago === 'pendiente');
    const total = aprobadas.reduce((s, v) => s + (v.monto ?? 0), 0);
    const planes: Record<string, number> = {};
    for (const v of aprobadas) {
      const p = v.plan?.toLowerCase() ?? 'otro';
      planes[p] = (planes[p] ?? 0) + 1;
    }
    return { aprobadas: aprobadas.length, pendientes: pendientes.length, total, planes };
  }, [ventas]);

  const filtered = useMemo(() => {
    let list = [...ventas] as Venta[];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(v =>
        v.nombre?.toLowerCase().includes(q) ||
        v.rut?.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q)
      );
    }
    if (filterPlan !== 'todos') list = list.filter(v => v.plan?.toLowerCase() === filterPlan);
    if (filterEstado !== 'todos') list = list.filter(v => v.estado_pago === filterEstado);
    if (filterPrev !== 'todos') {
      list = list.filter(v => {
        const fp = v.fecha_pago ? new Date(v.fecha_pago) : null;
        if (!fp) return false;
        return filterPrev === 'p1' ? fp <= CORTE_P1 : fp > CORTE_P1;
      });
    }

    list.sort((a, b) => {
      let av: any, bv: any;
      if (sortKey === 'fecha_pago') {
        av = a.fecha_pago ? new Date(a.fecha_pago).getTime() : 0;
        bv = b.fecha_pago ? new Date(b.fecha_pago).getTime() : 0;
      } else if (sortKey === 'monto') {
        av = a.monto ?? 0; bv = b.monto ?? 0;
      } else if (sortKey === 'nombre') {
        av = a.nombre?.toLowerCase() ?? ''; bv = b.nombre?.toLowerCase() ?? '';
      } else {
        av = a.plan?.toLowerCase() ?? ''; bv = b.plan?.toLowerCase() ?? '';
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [ventas, search, filterPlan, filterEstado, filterPrev, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown size={10} className="text-[#444]" />;
    return sortDir === 'asc'
      ? <ArrowUp size={10} className="text-accent" />
      : <ArrowDown size={10} className="text-accent" />;
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-heading font-bold text-xs tracking-[0.15em] text-white uppercase">HISTORIAL DE VENTAS</div>
          <div className="font-body text-[11px] text-[#555] mt-0.5">{filtered.length} de {ventas.length} registros</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'TOTAL INGRESOS',  value: fmt(stats.total),              color: 'text-accent' },
          { label: 'APROBADAS',       value: String(stats.aprobadas),       color: 'text-green-400' },
          { label: 'PENDIENTES',      value: String(stats.pendientes),      color: 'text-yellow-400' },
          { label: 'TOTAL REGISTROS', value: String(ventas.length),         color: 'text-white' },
        ].map(s => (
          <div key={s.label} className="border border-white/5 bg-[#0A0A0A] p-4">
            <div className="font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase">{s.label}</div>
            <div className={`font-display text-2xl mt-1 ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Distribución por plan */}
      {Object.keys(stats.planes).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.planes).map(([plan, count]) => (
            <div key={plan} className={`flex items-center gap-1.5 px-3 py-1.5 border text-[10px] font-heading tracking-wider uppercase ${PLAN_BADGE[plan] ?? 'border-white/10 text-white'}`}>
              <span>{plan}</span>
              <span className="opacity-50">·</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        {/* Búsqueda */}
        <div className="flex items-center gap-2 border border-white/10 bg-[#0A0A0A] px-3 py-2 flex-1 min-w-48">
          <Search size={12} className="text-[#444] shrink-0" />
          <input
            type="text"
            placeholder="Buscar por nombre, RUT o email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent font-body text-xs text-white placeholder:text-[#333] outline-none w-full"
          />
        </div>

        {/* Plan */}
        <div className="flex items-center gap-2 border border-white/10 bg-[#0A0A0A] px-3 py-2">
          <Filter size={11} className="text-[#444]" />
          <select
            value={filterPlan}
            onChange={e => setFilterPlan(e.target.value)}
            className="bg-transparent font-heading text-[10px] tracking-wider text-white outline-none uppercase"
          >
            <option value="todos">TODOS LOS PLANES</option>
            {['mensual','trimestral','semestral','anual'].map(p => (
              <option key={p} value={p}>{p.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div className="flex items-center gap-2 border border-white/10 bg-[#0A0A0A] px-3 py-2">
          <select
            value={filterEstado}
            onChange={e => setFilterEstado(e.target.value)}
            className="bg-transparent font-heading text-[10px] tracking-wider text-white outline-none uppercase"
          >
            <option value="todos">TODOS LOS ESTADOS</option>
            <option value="aprobado">APROBADO</option>
            <option value="pendiente">PENDIENTE</option>
          </select>
        </div>

        {/* Preventa */}
        <div className="flex items-center gap-2 border border-white/10 bg-[#0A0A0A] px-3 py-2">
          <select
            value={filterPrev}
            onChange={e => setFilterPrev(e.target.value)}
            className="bg-transparent font-heading text-[10px] tracking-wider text-white outline-none uppercase"
          >
            <option value="todos">TODAS LAS PREVENTAS</option>
            <option value="p1">PREVENTA 1</option>
            <option value="p2">PREVENTA 2</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="border border-white/5 bg-[#0A0A0A] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <div className="font-heading text-[11px] text-[#444] tracking-widest uppercase">
              {ventas.length === 0 ? 'AÚN NO HAY VENTAS REGISTRADAS' : 'SIN RESULTADOS PARA LOS FILTROS APLICADOS'}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {([
                    { key: 'nombre', label: 'CLIENTE' },
                    { key: 'plan',   label: 'PLAN' },
                    { key: 'monto',  label: 'MONTO' },
                    { key: null,     label: 'ESTADO' },
                    { key: 'fecha_pago', label: 'FECHA' },
                    { key: null,     label: 'PREVENTA' },
                  ] as { key: SortKey | null; label: string }[]).map(h => (
                    <th
                      key={h.label}
                      onClick={h.key ? () => toggleSort(h.key!) : undefined}
                      className={`text-left px-5 py-3 font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase select-none ${h.key ? 'cursor-pointer hover:text-white transition-colors' : ''}`}
                    >
                      <span className="flex items-center gap-1.5">
                        {h.label}
                        {h.key && <SortIcon k={h.key} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => {
                  const fp = v.fecha_pago ? new Date(v.fecha_pago) : null;
                  const prev = fp ? (fp <= CORTE_P1 ? 'P1' : 'P2') : null;
                  const aprobado = v.estado_pago === 'aprobado';
                  return (
                    <tr key={v.id || i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      {/* Cliente */}
                      <td className="px-5 py-3">
                        <div className="font-heading text-xs text-white">{v.nombre || '—'}</div>
                        {v.rut && <div className="font-body text-[10px] text-[#555] mt-0.5">{v.rut}</div>}
                      </td>
                      {/* Plan */}
                      <td className="px-5 py-3">
                        {v.plan ? (
                          <span className={`inline-block px-2 py-0.5 border font-heading text-[9px] tracking-widest uppercase ${PLAN_BADGE[v.plan?.toLowerCase()] ?? 'border-white/10 text-white'}`}>
                            {v.plan}
                          </span>
                        ) : <span className="text-[#444]">—</span>}
                      </td>
                      {/* Monto */}
                      <td className="px-5 py-3 font-heading text-xs text-white tabular-nums">{fmt(v.monto ?? 0)}</td>
                      {/* Estado */}
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 border font-heading text-[9px] tracking-widest uppercase ${
                          aprobado
                            ? 'border-green-500/20 bg-green-500/5 text-green-400'
                            : 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400'
                        }`}>
                          {aprobado ? <CheckCircle2 size={9} /> : <Clock size={9} />}
                          {v.estado_pago}
                        </span>
                      </td>
                      {/* Fecha */}
                      <td className="px-5 py-3 font-body text-[11px] text-[#555]">
                        {fp ? fp.toLocaleDateString('es-CL') : '—'}
                      </td>
                      {/* Preventa */}
                      <td className="px-5 py-3">
                        {prev ? (
                          <span className={`font-heading text-[9px] tracking-widest ${prev === 'P1' ? 'text-accent' : 'text-blue-400'}`}>
                            {prev}
                          </span>
                        ) : <span className="text-[#333]">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
