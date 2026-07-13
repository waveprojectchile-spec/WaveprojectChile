'use client';
import { useMemo, useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  clientes: any[];
}

const CORTE_P1 = new Date('2026-07-12T23:59:59-04:00');

function getMaxRenov(fechaPago: string | null) {
  if (!fechaPago) return 2;
  return new Date(fechaPago) <= CORTE_P1 ? 4 : 2;
}

export default function RenovacionesSection({ clientes }: Props) {
  const [selected, setSelected] = useState<any>(null);

  // Solo clientes que han renovado al menos 1 vez
  const renovados = useMemo(() =>
    clientes
      .filter(c => (c.renovaciones_usadas ?? 0) > 0)
      .sort((a, b) => (b.renovaciones_usadas ?? 0) - (a.renovaciones_usadas ?? 0)),
    [clientes]
  );

  if (renovados.length === 0) {
    return (
      <div className="border border-white/5 bg-[#0A0A0A] p-10 text-center">
        <div className="font-heading text-[11px] text-[#444] tracking-widest uppercase">
          Aún no hay renovaciones registradas
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border border-white/5 bg-[#0A0A0A] overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <div className="font-heading font-bold text-xs tracking-[0.15em] text-white uppercase">
            RENOVACIONES ({renovados.length})
          </div>
          <div className="font-body text-chalk-faint text-[11px] mt-1">
            Clientes que han renovado su plan de preventa
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['NOMBRE', 'RUT', 'PLAN', 'FECHA PAGO', 'RENOVACIONES USADAS', 'RESTANTES'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renovados.map((c, i) => {
                const usadas = c.renovaciones_usadas ?? 0;
                const max = getMaxRenov(c.fecha_pago);
                const restantes = max - usadas;
                const agotadas = restantes <= 0;

                return (
                  <tr
                    key={c.id || i}
                    onClick={() => setSelected(c)}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3">
                      <div className="font-heading text-xs text-white tracking-wider">{c.nombre || '—'}</div>
                      <div className="font-body text-[10px] text-[#555] mt-0.5">{c.email}</div>
                    </td>
                    <td className="px-5 py-3 font-body text-[11px] text-[#666]">{c.rut || '—'}</td>
                    <td className="px-5 py-3 font-heading text-[10px] text-white tracking-wider uppercase">{c.plan || '—'}</td>
                    <td className="px-5 py-3 font-body text-[11px] text-[#555]">
                      {c.fecha_pago ? new Date(c.fecha_pago).toLocaleDateString('es-CL') : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {Array.from({ length: max }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`w-2.5 h-2.5 rounded-full ${idx < usadas ? 'bg-white/40' : 'bg-accent/20 border border-accent/20'}`}
                            />
                          ))}
                        </div>
                        <span className="font-heading text-white text-[11px] font-bold">{usadas} / {max}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`font-heading text-[11px] font-bold tracking-widest ${
                        agotadas ? 'text-red-400' : restantes === 1 ? 'text-yellow-400' : 'text-accent'
                      }`}>
                        {agotadas ? 'AGOTADAS' : `${restantes} QUEDAN`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal detalle */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-[#0E0E0E] border border-white/10 w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors">
              <X size={16} />
            </button>
            <div className="font-display text-2xl text-white mb-0.5">{selected.nombre || 'Sin nombre'}</div>
            <div className="font-body text-[11px] text-[#555] mb-5">{selected.email}</div>

            {/* Renovaciones visual */}
            <div className="mb-5 p-4 border border-white/5 bg-[#0A0A0A]">
              <div className="font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase mb-3">Estado de renovaciones</div>
              {(() => {
                const usadas = selected.renovaciones_usadas ?? 0;
                const max = getMaxRenov(selected.fecha_pago);
                const restantes = max - usadas;
                return (
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      {Array.from({ length: max }).map((_, idx) => (
                        <div key={idx} className={`flex-1 h-2 rounded-full ${idx < usadas ? 'bg-white/30' : 'bg-accent'}`} />
                      ))}
                    </div>
                    <div className="flex justify-between font-heading text-[10px] tracking-widest">
                      <span className="text-chalk-faint">{usadas} usadas</span>
                      <span className={restantes <= 0 ? 'text-red-400' : 'text-accent'}>{restantes} restantes de {max}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                ['RUT', selected.rut],
                ['Teléfono', selected.telefono],
                ['Plan', selected.plan?.toUpperCase()],
                ['Monto original', selected.monto ? `$${selected.monto.toLocaleString('es-CL')}` : '—'],
                ['Fecha de pago', selected.fecha_pago ? new Date(selected.fecha_pago).toLocaleDateString('es-CL') : '—'],
                ['Preventa', selected.fecha_pago && new Date(selected.fecha_pago) <= CORTE_P1 ? 'Preventa 1 (máx 4 renov.)' : 'Preventa 2 (máx 2 renov.)'],
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
