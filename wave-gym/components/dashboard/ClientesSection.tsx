'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  clientes: any[];
}

export default function ClientesSection({ clientes }: Props) {
  const [selected, setSelected] = useState<any>(null);

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
        <div className="p-5 border-b border-white/5">
          <div className="font-heading font-bold text-xs tracking-[0.15em] text-white uppercase">Clientes ({clientes.length})</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['NOMBRE', 'RUT', 'EMAIL', 'PLAN', 'ESTADO', 'FECHA'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientes.map((c, i) => (
                <tr
                  key={c.id || i}
                  onClick={() => setSelected(c)}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3 font-heading text-xs text-white tracking-wider">{c.nombre || '—'}</td>
                  <td className="px-5 py-3 font-body text-[11px] text-[#666]">{c.rut || '—'}</td>
                  <td className="px-5 py-3 font-body text-[11px] text-[#666]">{c.email || '—'}</td>
                  <td className="px-5 py-3 font-heading text-[10px] text-white tracking-wider uppercase">{c.plan || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2 py-0.5 font-heading text-[9px] tracking-widest uppercase ${
                      c.estado_pago === 'activo'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {c.estado_pago || 'inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-body text-[11px] text-[#555]">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString('es-CL') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                ['Estado', selected.estado_pago],
                ['Peso', selected.peso ? `${selected.peso} kg` : null],
                ['Altura', selected.altura ? `${selected.altura} cm` : null],
                ['Objetivo', selected.objetivo],
                ['Lesiones', selected.lesiones],
                ['Condiciones médicas', selected.condiciones_medicas],
                ['Contacto emergencia', selected.contacto_emergencia],
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
