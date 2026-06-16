'use client';
import { useState } from 'react';

interface Props {
  productos: any[];
  fmt: (n: number) => string;
}

export default function PreventasSection({ productos, fmt }: Props) {
  const preventas = productos.filter((p) => p.es_preventa === true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stockVal, setStockVal] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveStock = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/actualizar-producto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stock: Number(stockVal) }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Error al actualizar stock');
    }
    setSaving(false);
  };

  if (preventas.length === 0) {
    return (
      <div className="border border-white/5 bg-[#0A0A0A] p-10 text-center">
        <div className="font-heading text-[11px] text-[#444] tracking-widest">NO HAY PRODUCTOS DE PREVENTA</div>
      </div>
    );
  }

  return (
    <div>
      <div className="font-heading font-bold text-xs tracking-[0.15em] text-white uppercase mb-5">Preventas ({preventas.length})</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {preventas.map((p) => {
          const stockInicial = p.stock_inicial || p.stock || 50;
          const vendidos = stockInicial - (p.stock ?? 0);
          const pct = stockInicial > 0 ? (vendidos / stockInicial) * 100 : 0;
          const agotado = (p.stock ?? 0) <= 0;

          return (
            <div key={p.id} className="border border-white/5 bg-[#0A0A0A] p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="font-heading font-bold text-xs text-white tracking-wider uppercase">{p.nombre}</div>
                {agotado && (
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 font-heading text-[8px] tracking-widest uppercase">AGOTADO</span>
                )}
              </div>
              <div className="font-display text-2xl text-white mb-4">{fmt(p.precio || 0)}</div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="flex justify-between font-heading text-[8px] tracking-widest text-[#444] mb-1">
                  <span>{vendidos} VENDIDOS</span>
                  <span>{p.stock ?? 0} DISPONIBLES</span>
                </div>
                <div className="h-1.5 bg-[#1A1A1A] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#8B6914] via-[#C9A84C] to-[#F5C842] transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>

              {/* Edit stock */}
              {editingId === p.id ? (
                <div className="flex gap-2 mt-3">
                  <input
                    type="number"
                    value={stockVal}
                    onChange={(e) => setStockVal(e.target.value)}
                    className="flex-1 bg-[#111] border border-white/10 px-3 py-2 font-body text-xs text-white outline-none focus:border-[#C9A84C]"
                    placeholder="Nuevo stock"
                  />
                  <button
                    onClick={() => handleSaveStock(p.id)}
                    disabled={saving}
                    className="px-3 py-2 bg-[#C9A84C] text-black font-heading text-[9px] tracking-widest font-bold hover:bg-[#F5C842] transition-colors disabled:opacity-50"
                  >
                    {saving ? '...' : 'OK'}
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-2 border border-white/10 text-[#555] font-heading text-[9px] tracking-widest hover:text-white transition-colors">
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setEditingId(p.id); setStockVal(String(p.stock ?? 0)); }}
                  className="mt-3 w-full py-2 border border-white/10 font-heading text-[9px] tracking-[0.15em] text-[#555] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all uppercase"
                >
                  EDITAR STOCK
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
