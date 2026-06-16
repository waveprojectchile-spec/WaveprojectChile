'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Props {
  productos: any[];
  fmt: (n: number) => string;
}

export default function TiendaSection({ productos, fmt }: Props) {
  const [filtro, setFiltro] = useState('todos');
  const [modalNuevo, setModalNuevo] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '', categoria: 'suplemento', es_preventa: false, imagen_url: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const noPreventas = productos.filter((p) => !p.es_preventa);
  const filtrados = noPreventas.filter((p) => filtro === 'todos' || p.categoria === filtro);

  const handleGuardar = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/nuevo-producto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, precio: Number(form.precio), stock: Number(form.stock) }),
      });
      const data = await res.json();
      if (data.error) {
        setMsg(`Error: ${data.error}`);
      } else {
        setModalNuevo(false);
        window.location.reload();
      }
    } catch {
      setMsg('Error de conexión al guardar el producto');
    }
    setLoading(false);
  };

  const handleToggleActivo = async (id: string, activo: boolean) => {
    try {
      const res = await fetch('/api/admin/actualizar-producto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, activo: !activo }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Error al actualizar estado del producto');
    }
  };

  return (
    <>
      <div className="border border-white/5 bg-[#0A0A0A] overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="font-heading font-bold text-xs tracking-[0.15em] text-white uppercase">Tienda ({noPreventas.length})</div>
          <button
            onClick={() => setModalNuevo(true)}
            className="flex items-center gap-2 px-3 py-2 bg-[#C9A84C] text-black font-heading text-[9px] tracking-widest font-bold hover:bg-[#F5C842] transition-colors"
          >
            <Plus size={12} /> NUEVO PRODUCTO
          </button>
        </div>

        <div className="p-5 border-b border-white/5 flex gap-2 overflow-x-auto">
          {['todos', 'suplemento', 'ropa', 'accesorio'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`px-3 py-1.5 font-heading text-[9px] tracking-[0.2em] uppercase transition-colors whitespace-nowrap ${
                filtro === cat
                  ? 'bg-white/10 text-white'
                  : 'text-[#555] hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="p-5">
          {filtrados.length === 0 ? (
            <div className="text-center py-10">
              <div className="font-heading text-[11px] text-[#444] tracking-widest">NO HAY PRODUCTOS EN ESTA CATEGORÍA</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtrados.map((p) => (
                <div key={p.id} className="border border-white/5 bg-[#111] p-5 flex flex-col relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`inline-block px-2 py-0.5 font-heading text-[8px] tracking-widest uppercase ${
                      p.activo ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {p.activo ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                    <span className="font-heading text-[9px] text-[#555] tracking-widest uppercase">{p.categoria}</span>
                  </div>
                  
                  <div className="font-heading font-bold text-sm text-white tracking-wider uppercase mt-2 mb-1">{p.nombre}</div>
                  <div className="font-display text-xl text-[#C9A84C] mb-4">{fmt(p.precio || 0)}</div>
                  
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="font-body text-[11px] text-[#666]">Stock: <span className="text-white">{p.stock || 0}</span></div>
                    
                    <button
                      onClick={() => handleToggleActivo(p.id, p.activo)}
                      className={`font-heading text-[9px] tracking-widest uppercase transition-colors ${
                        p.activo ? 'text-[#555] hover:text-red-400' : 'text-[#555] hover:text-green-400'
                      }`}
                    >
                      {p.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Nuevo Producto */}
      {modalNuevo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setModalNuevo(false)}>
          <div className="bg-[#0E0E0E] border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalNuevo(false)} className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors">
              <X size={16} />
            </button>
            
            <div className="p-6 border-b border-white/10">
              <div className="font-display text-xl text-white">NUEVO PRODUCTO</div>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              {[
                { label: 'NOMBRE', key: 'nombre', type: 'text' },
                { label: 'DESCRIPCIÓN', key: 'descripcion', type: 'text' },
                { label: 'PRECIO (CLP)', key: 'precio', type: 'number' },
                { label: 'STOCK', key: 'stock', type: 'number' },
                { label: 'URL IMAGEN (OPCIONAL)', key: 'imagen_url', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block font-heading text-[9px] tracking-[0.2em] text-[#555] uppercase mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-[#111] border border-white/10 px-4 py-2.5 font-body text-sm text-white outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
              ))}
              
              <div>
                <label className="block font-heading text-[9px] tracking-[0.2em] text-[#555] uppercase mb-1.5">CATEGORÍA</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                  className="w-full bg-[#111] border border-white/10 px-4 py-2.5 font-body text-sm text-white outline-none focus:border-[#C9A84C] transition-colors appearance-none"
                >
                  <option value="suplemento">SUPLEMENTO</option>
                  <option value="ropa">ROPA</option>
                  <option value="accesorio">ACCESORIO</option>
                </select>
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={form.es_preventa}
                  onChange={(e) => setForm((f) => ({ ...f, es_preventa: e.target.checked }))}
                  className="w-4 h-4 border border-white/20 bg-black checked:bg-[#C9A84C] accent-[#C9A84C]"
                />
                <span className="font-heading text-[10px] tracking-widest text-[#888] uppercase">ES PREVENTA</span>
              </label>
              
              {msg && (
                <div className={`text-xs p-3 font-body mt-2 ${msg.startsWith('Error') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                  {msg}
                </div>
              )}
              
              <button
                onClick={handleGuardar}
                disabled={loading}
                className="w-full mt-4 py-3 bg-[#C9A84C] text-black font-heading text-[10px] tracking-[0.2em] font-bold hover:bg-[#F5C842] transition-colors disabled:opacity-50"
              >
                {loading ? 'GUARDANDO...' : 'GUARDAR PRODUCTO'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
