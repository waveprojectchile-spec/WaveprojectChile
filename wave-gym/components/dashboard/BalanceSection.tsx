'use client';
import { useMemo } from 'react';
import {
  TrendingUp, DollarSign, Users, RefreshCw,
  Award, BarChart2, Calendar, ArrowUpRight,
} from 'lucide-react';

interface Props {
  clientes: any[];
  fmt: (n: number) => string;
}

const CORTE_P1  = new Date('2026-07-12T23:59:59-04:00');
const PLAN_DIAS: Record<string, number> = { mensual: 30, trimestral: 90, semestral: 180, anual: 365 };

const PLAN_COLORS: Record<string, string> = {
  mensual:     'bg-accent',
  trimestral:  'bg-blue-400',
  semestral:   'bg-purple-400',
  anual:       'bg-yellow-400',
};
const PLAN_TEXT: Record<string, string> = {
  mensual:    'text-accent',
  trimestral: 'text-blue-400',
  semestral:  'text-purple-400',
  anual:      'text-yellow-400',
};

export default function BalanceSection({ clientes, fmt }: Props) {
  const stats = useMemo(() => {
    const aprobados = clientes.filter(c => c.estado_pago === 'aprobado');

    // — KPIs principales —
    const ingresoTotal  = aprobados.reduce((s, c) => s + (c.monto ?? 0), 0);
    const totalClientes = aprobados.length;
    const ticketPromedio = totalClientes > 0 ? ingresoTotal / totalClientes : 0;
    const totalRenovaciones = aprobados.reduce((s, c) => s + (c.renovaciones_usadas ?? 0), 0);
    const ingresoRenovaciones = aprobados
      .filter(c => (c.renovaciones_usadas ?? 0) > 0)
      .reduce((s, c) => s + (c.monto ?? 0) * (c.renovaciones_usadas ?? 0), 0);

    // — Segmentación P1 / P2 —
    const p1 = aprobados.filter(c => c.fecha_pago && new Date(c.fecha_pago) <= CORTE_P1);
    const p2 = aprobados.filter(c => c.fecha_pago && new Date(c.fecha_pago) > CORTE_P1);
    const ingresoP1 = p1.reduce((s, c) => s + (c.monto ?? 0), 0);
    const ingresoP2 = p2.reduce((s, c) => s + (c.monto ?? 0), 0);

    // — Distribución por plan —
    const planes = ['mensual', 'trimestral', 'semestral', 'anual'];
    const porPlan = planes.map(plan => {
      const grupo = aprobados.filter(c => c.plan?.toLowerCase() === plan);
      const ingreso = grupo.reduce((s, c) => s + (c.monto ?? 0), 0);
      return { plan, cantidad: grupo.length, ingreso, pct: totalClientes > 0 ? grupo.length / totalClientes : 0 };
    });
    const planTop = [...porPlan].sort((a, b) => b.ingreso - a.ingreso)[0];

    // — Proyección mensual (LTV) —
    const ltvPromedio = porPlan.reduce((s, p) => {
      const dias = PLAN_DIAS[p.plan] ?? 30;
      const mesesEquiv = dias / 30;
      const ticket = p.cantidad > 0 ? p.ingreso / p.cantidad : 0;
      return s + (ticket / mesesEquiv) * p.cantidad;
    }, 0) / (totalClientes || 1);

    // — Línea de tiempo: ventas por semana —
    const conFecha = aprobados
      .filter(c => c.fecha_pago)
      .sort((a, b) => new Date(a.fecha_pago).getTime() - new Date(b.fecha_pago).getTime());

    // Agrupar por día (últimos 30 días o todos si hay pocos)
    const hoy = new Date();
    const diasAtras = 30;
    const desde = new Date(hoy.getTime() - diasAtras * 86_400_000);
    const recientes = conFecha.filter(c => new Date(c.fecha_pago) >= desde);

    // Acumulado por día
    type DayEntry = { fecha: string; monto: number; acum: number; count: number };
    const porDia: Record<string, { monto: number; count: number }> = {};
    for (const c of recientes) {
      const d = new Date(c.fecha_pago).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
      if (!porDia[d]) porDia[d] = { monto: 0, count: 0 };
      porDia[d].monto += c.monto ?? 0;
      porDia[d].count += 1;
    }
    let acum = 0;
    const timeline: DayEntry[] = Object.entries(porDia).map(([fecha, v]) => {
      acum += v.monto;
      return { fecha, monto: v.monto, acum, count: v.count };
    });

    // Tasa de retención: clientes con al menos 1 renovación
    const conRenovacion = aprobados.filter(c => (c.renovaciones_usadas ?? 0) > 0).length;
    const tasaRetencion = totalClientes > 0 ? (conRenovacion / totalClientes) * 100 : 0;

    return {
      ingresoTotal, totalClientes, ticketPromedio, totalRenovaciones,
      ingresoRenovaciones, ingresoP1, ingresoP2, p1count: p1.length, p2count: p2.length,
      porPlan, planTop, ltvPromedio, timeline, tasaRetencion, conRenovacion,
    };
  }, [clientes]);

  const maxTimeline = Math.max(...stats.timeline.map(d => d.acum), 1);
  const maxBarPlan  = Math.max(...stats.porPlan.map(p => p.ingreso), 1);
  const totalP = stats.ingresoP1 + stats.ingresoP2 || 1;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-heading font-bold text-xs tracking-[0.15em] text-white uppercase">
            BALANCE GENERAL
          </div>
          <div className="font-body text-[11px] text-[#555] mt-0.5">
            Análisis financiero · {stats.totalClientes} clientes activos
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 border border-accent/20 bg-accent/5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-heading text-[9px] tracking-[0.2em] text-accent uppercase">EN VIVO</span>
        </div>
      </div>

      {/* KPIs — fila 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: DollarSign, label: 'INGRESOS TOTALES',
            value: fmt(stats.ingresoTotal), sub: 'Ventas aprobadas',
            color: 'text-accent', border: 'border-accent/20',
          },
          {
            icon: Users, label: 'CLIENTES ACTIVOS',
            value: String(stats.totalClientes), sub: `P1: ${stats.p1count} · P2: ${stats.p2count}`,
            color: 'text-blue-400', border: 'border-blue-400/20',
          },
          {
            icon: Award, label: 'TICKET PROMEDIO',
            value: fmt(stats.ticketPromedio), sub: 'Por cliente',
            color: 'text-purple-400', border: 'border-purple-400/20',
          },
          {
            icon: RefreshCw, label: 'INGRESOS RENOV.',
            value: fmt(stats.ingresoRenovaciones),
            sub: `${stats.totalRenovaciones} renovaciones`,
            color: 'text-yellow-400', border: 'border-yellow-400/20',
          },
        ].map(({ icon: Icon, label, value, sub, color, border }) => (
          <div key={label} className={`border ${border} bg-[#0A0A0A] p-4`}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase">{label}</div>
              <Icon size={13} className={color} />
            </div>
            <div className={`font-display text-2xl ${color}`}>{value}</div>
            <div className="font-body text-[10px] text-[#555] mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* KPIs — fila 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="border border-white/5 bg-[#0A0A0A] p-4">
          <div className="font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase mb-3">TASA RETENCIÓN</div>
          <div className="font-display text-3xl text-white">{stats.tasaRetencion.toFixed(1)}%</div>
          <div className="font-body text-[10px] text-[#555] mt-1">{stats.conRenovacion} clientes renovaron</div>
          <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full" style={{ width: `${stats.tasaRetencion}%` }} />
          </div>
        </div>
        <div className="border border-white/5 bg-[#0A0A0A] p-4">
          <div className="font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase mb-3">INGRESO / MES EST.</div>
          <div className="font-display text-3xl text-white">{fmt(stats.ltvPromedio)}</div>
          <div className="font-body text-[10px] text-[#555] mt-1">Promedio mensual por cliente</div>
        </div>
        <div className="border border-white/5 bg-[#0A0A0A] p-4">
          <div className="font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase mb-3">PLAN LÍDER</div>
          <div className={`font-display text-2xl uppercase ${stats.planTop ? PLAN_TEXT[stats.planTop.plan] : 'text-white'}`}>
            {stats.planTop?.plan ?? '—'}
          </div>
          <div className="font-body text-[10px] text-[#555] mt-1">
            {stats.planTop ? `${fmt(stats.planTop.ingreso)} · ${stats.planTop.cantidad} clientes` : '—'}
          </div>
        </div>
      </div>

      {/* Distribución P1 vs P2 */}
      <div className="border border-white/5 bg-[#0A0A0A] p-5">
        <div className="font-heading text-[10px] tracking-[0.2em] text-white uppercase mb-4 flex items-center gap-2">
          <Calendar size={12} className="text-accent" /> PREVENTA 1 vs PREVENTA 2
        </div>
        <div className="flex gap-3 mb-4">
          {[
            { label: 'PREVENTA 1', ingreso: stats.ingresoP1, count: stats.p1count, color: 'bg-accent', text: 'text-accent' },
            { label: 'PREVENTA 2', ingreso: stats.ingresoP2, count: stats.p2count, color: 'bg-blue-400', text: 'text-blue-400' },
          ].map(p => (
            <div key={p.label} className="flex-1 border border-white/5 p-3">
              <div className="font-heading text-[9px] tracking-widest text-[#444] uppercase mb-1">{p.label}</div>
              <div className={`font-display text-xl ${p.text}`}>{fmt(p.ingreso)}</div>
              <div className="font-body text-[10px] text-[#555]">{p.count} clientes</div>
            </div>
          ))}
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-accent transition-all duration-700"
            style={{ width: `${(stats.ingresoP1 / totalP) * 100}%` }}
          />
          <div
            className="h-full bg-blue-400 transition-all duration-700"
            style={{ width: `${(stats.ingresoP2 / totalP) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="font-heading text-[9px] text-accent">{((stats.ingresoP1 / totalP) * 100).toFixed(1)}% P1</span>
          <span className="font-heading text-[9px] text-blue-400">{((stats.ingresoP2 / totalP) * 100).toFixed(1)}% P2</span>
        </div>
      </div>

      {/* Distribución por plan */}
      <div className="border border-white/5 bg-[#0A0A0A] p-5">
        <div className="font-heading text-[10px] tracking-[0.2em] text-white uppercase mb-5 flex items-center gap-2">
          <BarChart2 size={12} className="text-accent" /> INGRESOS POR PLAN
        </div>
        <div className="space-y-4">
          {stats.porPlan.map(({ plan, cantidad, ingreso, pct }) => (
            <div key={plan}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${PLAN_COLORS[plan] ?? 'bg-white/20'}`} />
                  <span className="font-heading text-[10px] tracking-widest uppercase text-white">{plan}</span>
                  <span className="font-body text-[10px] text-[#555]">{cantidad} cliente{cantidad !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-heading text-[10px] font-bold ${PLAN_TEXT[plan] ?? 'text-white'}`}>
                    {fmt(ingreso)}
                  </span>
                  <span className="font-body text-[10px] text-[#444] w-10 text-right">
                    {(pct * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${PLAN_COLORS[plan] ?? 'bg-white/20'}`}
                  style={{ width: `${(ingreso / maxBarPlan) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline — ventas acumuladas */}
      <div className="border border-white/5 bg-[#0A0A0A] p-5">
        <div className="font-heading text-[10px] tracking-[0.2em] text-white uppercase mb-1 flex items-center gap-2">
          <TrendingUp size={12} className="text-accent" /> INGRESOS ACUMULADOS — ÚLTIMOS 30 DÍAS
        </div>
        <div className="font-body text-[10px] text-[#555] mb-5">
          {stats.timeline.length} días con ventas registradas
        </div>

        {stats.timeline.length === 0 ? (
          <div className="h-24 flex items-center justify-center">
            <span className="font-heading text-[11px] text-[#444] tracking-widest uppercase">Sin datos en este período</span>
          </div>
        ) : (
          <>
            {/* Gráfico de barras SVG puro */}
            <div className="relative h-32 flex items-end gap-1">
              {stats.timeline.map((d, i) => {
                const h = Math.max(4, (d.acum / maxTimeline) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div
                      className="w-full bg-accent/30 hover:bg-accent/60 transition-colors rounded-t-sm"
                      style={{ height: `${h}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                      <div className="bg-[#111] border border-white/10 px-2 py-1 whitespace-nowrap">
                        <div className="font-heading text-[8px] text-white">{d.fecha}</div>
                        <div className="font-heading text-[8px] text-accent">{fmt(d.acum)}</div>
                        <div className="font-body text-[8px] text-[#555]">{d.count} venta{d.count !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Etiquetas eje X — primero y último */}
            <div className="flex justify-between mt-2">
              <span className="font-body text-[9px] text-[#444]">{stats.timeline[0]?.fecha}</span>
              <span className="font-body text-[9px] text-[#444]">{stats.timeline[stats.timeline.length - 1]?.fecha}</span>
            </div>
            {/* Resumen del período */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpRight size={13} className="text-accent" />
                <span className="font-heading text-[10px] text-white tracking-wider">
                  {fmt(stats.timeline[stats.timeline.length - 1]?.acum ?? 0)}
                </span>
                <span className="font-body text-[10px] text-[#555]">acumulado en el período</span>
              </div>
              <span className="font-heading text-[9px] text-[#444]">
                {stats.timeline.reduce((s, d) => s + d.count, 0)} transacciones
              </span>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
