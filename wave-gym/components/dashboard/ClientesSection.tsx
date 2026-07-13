'use client';
import { useState, useMemo } from 'react';
import { X } from 'lucide-react';

interface Props {
  clientes: any[];
  titulo?: string;
  badge?: string;
}

export default function ClientesSection({ clientes, titulo = 'CLIENTES', badge }: Props) {
  const [selected, setSelected] = useState<any>(null);
  const [filtro, setFiltro] = useState<string>('TODOS');

  const PLANES = ['TODOS', 'mensual', 'trimestral', 'semestral', 'anual'];

  const clientesFiltrados = useMemo(() => {
    if (filtro === 'TODOS') return clientes;
    return clientes.filter(c => c.plan?.toLowerCase() === filtro);
  }, [clientes, filtro]);

  if (clientes.length === 0) {
    return (
      <div className="border border-white/5 bg-[#0A0A0A] p-10 text-center">
        <div className="font-heading text-[11px] text-[#444] tracking-widest">AÚN NO HAY CLIENTES REGISTRADOS</div>
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
                  ? 'bg-[#C9A84C]/10 border-[#C9A84C]/50 text-[#C9A84C]' 
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
            <div className="font-heading text-[11px] text-[#444] tracking-widest uppercase">No hay clientes en el plan {filtro}</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['NOMBRE', 'RUT', 'EMAIL', 'PLAN', 'MONTO', 'ESTADO', 'FECHA PAGO'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((c, i) => (
                  <tr
                    key={c.id || i}
                    onClick={() => setSelected(c)}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3 font-heading text-xs text-white tracking-wider">{c.nombre || '—'}</td>
                    <td className="px-5 py-3 font-body text-[11px] text-[#666]">{c.rut || '—'}</td>
                    <td className="px-5 py-3 font-body text-[11px] text-[#666]">{c.email || '—'}</td>
                    <td className="px-5 py-3 font-heading text-[10px] text-white tracking-wider uppercase">{c.plan || '—'}</td>
                    <td className="px-5 py-3 font-body text-[11px] text-[#666]">${c.monto || 0}</td>
                    <td className="px-5 py-3">
                      <span className="inline-block px-2 py-0.5 font-heading text-[9px] tracking-widest uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                        ACTIVO
                      </span>
                    </td>
                    <td className="px-5 py-3 font-body text-[11px] text-[#555]">
                      {c.fecha_pago ? new Date(c.fecha_pago).toLocaleDateString('es-CL') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal detalle cliente */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-[#0E0E0E] border border-white/10 w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors">
              <X size={16} />
            </button>
            <div className="font-display text-2xl text-white mb-1">{selected.nombre || 'Sin nombre'}</div>
            <div className="font-body text-[11px] text-[#555] mb-5">{selected.email}</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['RUT', selected.rut],
                ['Teléfono', selected.telefono],
                ['Plan', selected.plan],
                ['Monto Pagado', selected.monto ? `$${selected.monto}` : '—'],
                ['Payment ID (MercadoPago)', selected.payment_id],
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
