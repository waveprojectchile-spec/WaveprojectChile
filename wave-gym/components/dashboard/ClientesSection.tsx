'use client';
import { useState, useMemo } from 'react';
import { X, RefreshCw } from 'lucide-react';

interface Props {
  clientes: any[];
  titulo?: string;
  badge?: string;
}

const CORTE_P1 = new Date('2026-07-12T23:59:59-04:00');

function getMaxRenov(fechaPago: string | null) {
  if (!fechaPago) return 2;
  return new Date(fechaPago) <= CORTE_P1 ? 4 : 2;
}

const PLANES = ['TODOS', 'mensual', 'trimestral', 'semestral', 'anual'];

export default function ClientesSection({ clientes, titulo = 'CLIENTES', badge }: Props) {
  const [selected, setSelected] = useState<any>(null);
  const [filtro, setFiltro] = useState('TODOS');
  const [renovando, setRenovando] = useState<string | null>(null);
  // track renovaciones_usadas localmente para reflejar cambios sin reload
  const [renovMap, setRenovMap] = useState<Record<string, number>>({});

  const clientesFiltrados = useMemo(() => {
    if (filtro === 'TODOS') return clientes;
    return clientes.filter(c => c.plan?.toLowerCase() === filtro);
  }, [clientes, filtro]);

  const getRenov = (c: any) => renovMap[c.id] ?? c.renovaciones_usadas ?? 0;

  const registrarRenovacion = async (e: React.MouseEvent, cliente: any) => {
    e.stopPropagation();
    setRenovando(cliente.id);
    try {
      const res = await fetch('/api/admin/registrar-renovacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId: cliente.id }),
      });
      const data = await res.json();
      if (data.error) { alert(data.error); return; }
      setRenovMap(prev => ({ ...prev, [cliente.id]: data.renovaciones_usadas }));
      // Actualiza también el modal si está abierto
      if (selected?.id === cliente.id) setSelected({ ...selected, renovaciones_usadas: data.renovaciones_usadas });
    } catch {
      alert('Error al registrar renovación');
    } finally {
      setRenovando(null);
    }
  };

  if (clientes.length === 0) {
    return (
      <div className="border border-white/5 bg-[#0A0A0A] p-10 text-center">
        <div className="font-heading text-[11px] text-[#444] tracking-widest uppercase">
          No hay clientes en esta preventa
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border border-white/5 bg-[#0A0A0A] overflow-hidden">
        <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="font-heading font-bold text-xs tracking-[0.15em] text-white uppercase flex items-center gap-3">
            {badge && (
              <span className="px-2 py-0.5 text-[9px] font-heading tracking-widest border border-accent/40 text-accent bg-accent/10">
                {badge}
              </span>
            )}
            {titulo} ({clientesFiltrados.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {PLANES.map(p => (
              <button
                key={p}
                onClick={() => setFiltro(p)}
                className={`px-3 py-1.5 font-heading text-[9px] tracking-widest uppercase transition-colors border ${
                  filtro === p
                    ? 'bg-accent/10 border-accent/50 text-accent'
                    : 'bg-transparent border-white/10 text-[#666] hover:text-white hover:border-white/30'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {clientesFiltrados.length === 0 ? (
          <div className="p-10 text-center">
            <div className="font-heading text-[11px] text-[#444] tracking-widest uppercase">
              No hay clientes en el plan {filtro}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['NOMBRE', 'PLAN', 'MONTO', 'FECHA PAGO', 'RENOVACIONES', 'ACCIÓN'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((c, i) => {
                  const usadas = getRenov(c);
                  const max = getMaxRenov(c.fecha_pago);
                  const restantes = max - usadas;
                  const agotadas = restantes <= 0;

                  return (
                    <tr
                      key={c.id || i}
                      onClick={() => setSelected({ ...c, renovaciones_usadas: usadas })}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3">
                        <div className="font-heading text-xs text-white tracking-wider">{c.nombre || '—'}</div>
                        <div className="font-body text-[10px] text-[#555] mt-0.5">{c.email || ''}</div>
                      </td>
                      <td className="px-5 py-3 font-heading text-[10px] text-white tracking-wider uppercase">{c.plan || '—'}</td>
                      <td className="px-5 py-3 font-body text-[11px] text-[#666]">${c.monto?.toLocaleString('es-CL') || 0}</td>
                      <td className="px-5 py-3 font-body text-[11px] text-[#555]">
                        {c.fecha_pago ? new Date(c.fecha_pago).toLocaleDateString('es-CL') : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {/* Puntos visuales */}
                          <div className="flex gap-1">
                            {Array.from({ length: max }).map((_, idx) => (
                              <div
                                key={idx}
                                className={`w-2 h-2 rounded-full ${idx < usadas ? 'bg-white/30' : 'bg-accent'}`}
                              />
                            ))}
                          </div>
                          <span className={`font-heading text-[10px] tracking-wider ${agotadas ? 'text-red-400' : 'text-chalk-muted'}`}>
                            {agotadas ? 'AGOTADAS' : `${restantes} REST.`}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                        <button
                          disabled={agotadas || renovando === c.id}
                          onClick={e => registrarRenovacion(e, c)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 font-heading text-[9px] tracking-widest uppercase border transition-all ${
                            agotadas
                              ? 'border-white/5 text-[#333] cursor-not-allowed'
                              : renovando === c.id
                              ? 'border-white/10 text-chalk-faint cursor-wait'
                              : 'border-white/15 text-chalk-muted hover:border-accent/50 hover:text-accent'
                          }`}
                        >
                          <RefreshCw size={10} className={renovando === c.id ? 'animate-spin' : ''} />
                          {renovando === c.id ? '...' : 'RENOVAR'}
                        </button>
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
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-[#0E0E0E] border border-white/10 w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors">
              <X size={16} />
            </button>
            <div className="font-display text-2xl text-white mb-1">{selected.nombre || 'Sin nombre'}</div>
            <div className="font-body text-[11px] text-[#555] mb-5">{selected.email}</div>

            {/* Renovaciones en modal */}
            <div className="mb-5 p-4 border border-white/5 bg-[#0A0A0A]">
              <div className="font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase mb-3">Renovaciones</div>
              {(() => {
                const usadas = selected.renovaciones_usadas ?? 0;
                const max = getMaxRenov(selected.fecha_pago);
                return (
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      {Array.from({ length: max }).map((_, idx) => (
                        <div key={idx} className={`w-3 h-3 rounded-full border ${idx < usadas ? 'bg-white/20 border-white/10' : 'bg-accent border-accent/50'}`} />
                      ))}
                    </div>
                    <span className="font-heading text-white text-sm">{max - usadas} de {max} disponibles</span>
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                ['RUT', selected.rut],
                ['Teléfono', selected.telefono],
                ['Plan', selected.plan],
                ['Monto Pagado', selected.monto ? `$${selected.monto.toLocaleString('es-CL')}` : '—'],
                ['Fecha Pago', selected.fecha_pago ? new Date(selected.fecha_pago).toLocaleDateString('es-CL') : '—'],
                ['Payment ID', selected.payment_id],
              ].map(([label, val]) => (
                <div key={label as string}>
                  <div className="font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase mb-1">{label}</div>
                  <div className="font-body text-sm text-white">{(val as string) || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
