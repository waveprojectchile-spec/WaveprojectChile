'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Filter, Edit2, Trash2, X, Save, AlertTriangle,
  Package, CheckCircle2, AlertCircle, XCircle, ChevronDown,
} from 'lucide-react';

interface Categoria {
  id: string;
  nombre: string;
}

interface Item {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria_id?: string;
  centro_costo: string;
  stock: number;
  stock_minimo: number;
  estado: 'bueno' | 'regular' | 'malo' | 'baja';
  created_at?: string;
}

const ESTADO_META = {
  bueno:   { label: 'Bueno',   icon: CheckCircle2, cls: 'border-green-500/20 bg-green-500/5 text-green-400' },
  regular: { label: 'Regular', icon: AlertCircle,  cls: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400' },
  malo:    { label: 'Malo',    icon: XCircle,      cls: 'border-red-500/20 bg-red-500/5 text-red-400' },
  baja:    { label: 'Baja',    icon: XCircle,      cls: 'border-[#444]/40 bg-white/[0.02] text-[#555]' },
};

const CENTROS_DEFAULT = ['Gimnasio', 'Oficina', 'Recepción', 'Almacén', 'Exterior'];

const EMPTY_FORM = {
  nombre: '',
  descripcion: '',
  categoria_id: '',
  nueva_categoria: '',
  centro_costo: '',
  nuevo_centro: '',
  stock: 1,
  stock_minimo: 0,
  estado: 'bueno' as Item['estado'],
};

export default function InventarioSection() {
  const [items, setItems]         = useState<Item[]>([]);
  const [cats, setCats]           = useState<Categoria[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  // filters
  const [search, setSearch]       = useState('');
  const [filterCat, setFilterCat] = useState('todos');
  const [filterCC, setFilterCC]   = useState('todos');
  const [filterEst, setFilterEst] = useState('todos');

  // modal
  const [modal, setModal]         = useState<'add' | 'edit' | 'delete' | null>(null);
  const [editing, setEditing]     = useState<Item | null>(null);
  const [form, setForm]           = useState({ ...EMPTY_FORM });
  const [saving, setSaving]       = useState(false);
  const [formErr, setFormErr]     = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/inventario');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setItems(data.items ?? []);
      setCats(data.categorias ?? []);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const centros = useMemo(() => {
    const from = items.map(i => i.centro_costo).filter(Boolean);
    return Array.from(new Set([...CENTROS_DEFAULT, ...from])).sort();
  }, [items]);

  const catName = (id?: string) => cats.find(c => c.id === id)?.nombre ?? '—';

  const filtered = useMemo(() => {
    let list = [...items];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.nombre.toLowerCase().includes(q) ||
        i.descripcion?.toLowerCase().includes(q) ||
        catName(i.categoria_id).toLowerCase().includes(q)
      );
    }
    if (filterCat !== 'todos') list = list.filter(i => i.categoria_id === filterCat);
    if (filterCC  !== 'todos') list = list.filter(i => i.centro_costo === filterCC);
    if (filterEst !== 'todos') list = list.filter(i => i.estado === filterEst);
    return list;
  }, [items, cats, search, filterCat, filterCC, filterEst]);

  const stockBajoCount = items.filter(i => i.stock <= i.stock_minimo && i.estado !== 'baja').length;

  // ── Abrir modales ──────────────────────────────────────────────
  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setFormErr(null);
    setEditing(null);
    setModal('add');
  };

  const openEdit = (item: Item) => {
    setForm({
      nombre:           item.nombre,
      descripcion:      item.descripcion ?? '',
      categoria_id:     item.categoria_id ?? '',
      nueva_categoria:  '',
      centro_costo:     item.centro_costo,
      nuevo_centro:     '',
      stock:            item.stock,
      stock_minimo:     item.stock_minimo,
      estado:           item.estado,
    });
    setFormErr(null);
    setEditing(item);
    setModal('edit');
  };

  const openDelete = (item: Item) => {
    setEditing(item);
    setModal('delete');
  };

  // ── Guardar ────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.nombre.trim()) { setFormErr('El nombre es obligatorio.'); return; }
    const cc = form.nuevo_centro.trim() || form.centro_costo;
    if (!cc) { setFormErr('Seleccioná o escribí un centro de costo.'); return; }

    setSaving(true);
    setFormErr(null);
    try {
      const payload: any = {
        nombre:        form.nombre.trim(),
        descripcion:   form.descripcion.trim() || null,
        categoria_id:  form.nueva_categoria.trim() ? undefined : (form.categoria_id || null),
        nueva_categoria: form.nueva_categoria.trim() || undefined,
        centro_costo:  cc,
        stock:         Number(form.stock),
        stock_minimo:  Number(form.stock_minimo),
        estado:        form.estado,
      };

      const url = modal === 'edit' && editing
        ? `/api/admin/inventario/${editing.id}`
        : '/api/admin/inventario';
      const method = modal === 'edit' ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      await load();
      setModal(null);
    } catch (e: any) {
      setFormErr(e.message);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/inventario/${editing.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await load();
      setModal(null);
    } catch (e: any) {
      setFormErr(e.message);
    }
    setSaving(false);
  };

  const field = (k: keyof typeof form, val: any) => setForm(f => ({ ...f, [k]: val }));

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-heading font-bold text-xs tracking-[0.15em] text-white uppercase">INVENTARIO</div>
          <div className="font-body text-[11px] text-[#555] mt-0.5">
            {items.length} ítem{items.length !== 1 ? 's' : ''} registrado{items.length !== 1 ? 's' : ''}
            {stockBajoCount > 0 && (
              <span className="ml-2 text-yellow-400">· {stockBajoCount} con stock bajo</span>
            )}
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black font-heading text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-chalk-muted transition-colors"
        >
          <Plus size={12} /> Agregar ítem
        </button>
      </div>

      {/* Alerta stock bajo */}
      {stockBajoCount > 0 && (
        <div className="flex items-center gap-3 border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
          <AlertTriangle size={13} className="text-yellow-400 shrink-0" />
          <span className="font-body text-xs text-yellow-300">
            {stockBajoCount} ítem{stockBajoCount !== 1 ? 's' : ''} con stock igual o por debajo del mínimo.
          </span>
        </div>
      )}

      {/* Stats */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['bueno', 'regular', 'malo', 'baja'] as Item['estado'][]).map(e => {
            const count = items.filter(i => i.estado === e).length;
            const meta = ESTADO_META[e];
            return (
              <div key={e} className={`border ${meta.cls} p-4`}>
                <div className="font-heading text-[9px] tracking-[0.2em] uppercase opacity-60">{meta.label}</div>
                <div className="font-display text-3xl mt-1">{count}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 border border-white/10 bg-[#0A0A0A] px-3 py-2 flex-1 min-w-48">
          <Search size={12} className="text-[#444] shrink-0" />
          <input
            type="text"
            placeholder="Buscar ítem…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent font-body text-xs text-white placeholder:text-[#333] outline-none w-full"
          />
        </div>
        <Sel value={filterCat} onChange={setFilterCat}>
          <option value="todos">TODAS LAS CATEGORÍAS</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.nombre.toUpperCase()}</option>)}
        </Sel>
        <Sel value={filterCC} onChange={setFilterCC}>
          <option value="todos">TODOS LOS CENTROS</option>
          {centros.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
        </Sel>
        <Sel value={filterEst} onChange={setFilterEst}>
          <option value="todos">TODOS LOS ESTADOS</option>
          {Object.entries(ESTADO_META).map(([k, v]) => (
            <option key={k} value={k}>{v.label.toUpperCase()}</option>
          ))}
        </Sel>
      </div>

      {/* Tabla / estados */}
      {loading ? (
        <div className="border border-white/5 bg-[#0A0A0A] p-10 text-center">
          <div className="font-heading text-[11px] text-[#444] tracking-widest uppercase animate-pulse">Cargando…</div>
        </div>
      ) : error ? (
        <div className="border border-red-500/20 bg-red-500/5 p-6 text-center">
          <div className="font-heading text-[11px] text-red-400 tracking-widest">{error}</div>
          <button onClick={load} className="mt-3 font-heading text-[10px] text-white/50 hover:text-white tracking-widest uppercase">Reintentar</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-white/5 bg-[#0A0A0A] p-10 text-center">
          <Package size={24} className="text-[#333] mx-auto mb-3" />
          <div className="font-heading text-[11px] text-[#444] tracking-widest uppercase">
            {items.length === 0 ? 'Aún no hay ítems en el inventario' : 'Sin resultados para los filtros aplicados'}
          </div>
        </div>
      ) : (
        <div className="border border-white/5 bg-[#0A0A0A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['ÍTEM', 'CATEGORÍA', 'CENTRO', 'STOCK', 'ESTADO', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => {
                  const meta = ESTADO_META[item.estado];
                  const Icon = meta.icon;
                  const stockBajo = item.stock <= item.stock_minimo && item.estado !== 'baja';
                  return (
                    <tr key={item.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-heading text-xs text-white">{item.nombre}</div>
                        {item.descripcion && <div className="font-body text-[10px] text-[#555] mt-0.5 max-w-xs truncate">{item.descripcion}</div>}
                      </td>
                      <td className="px-5 py-3 font-body text-[11px] text-[#666]">{catName(item.categoria_id)}</td>
                      <td className="px-5 py-3 font-heading text-[10px] tracking-wider text-[#666] uppercase">{item.centro_costo || '—'}</td>
                      <td className="px-5 py-3">
                        <div className={`font-display text-xl ${stockBajo ? 'text-yellow-400' : 'text-white'}`}>{item.stock}</div>
                        {item.stock_minimo > 0 && (
                          <div className="font-body text-[10px] text-[#444]">mín. {item.stock_minimo}</div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 border font-heading text-[9px] tracking-widest uppercase ${meta.cls}`}>
                          <Icon size={9} />{meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => openEdit(item)} className="p-1.5 text-[#444] hover:text-white transition-colors" aria-label="Editar">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => openDelete(item)} className="p-1.5 text-[#444] hover:text-red-400 transition-colors" aria-label="Eliminar">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Agregar / Editar */}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'AGREGAR ÍTEM' : 'EDITAR ÍTEM'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="NOMBRE *">
              <input
                type="text"
                value={form.nombre}
                onChange={e => field('nombre', e.target.value)}
                placeholder="Ej. Mancuerna 10kg"
                className="w-full bg-[#111] border border-white/10 px-3 py-2 font-body text-xs text-white placeholder:text-[#333] outline-none focus:border-white transition-colors"
              />
            </Field>

            <Field label="DESCRIPCIÓN">
              <textarea
                value={form.descripcion}
                onChange={e => field('descripcion', e.target.value)}
                placeholder="Descripción opcional…"
                rows={2}
                className="w-full bg-[#111] border border-white/10 px-3 py-2 font-body text-xs text-white placeholder:text-[#333] outline-none focus:border-white transition-colors resize-none"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="CATEGORÍA">
                <select
                  value={form.categoria_id}
                  onChange={e => { field('categoria_id', e.target.value); field('nueva_categoria', ''); }}
                  disabled={!!form.nueva_categoria}
                  className="w-full bg-[#111] border border-white/10 px-3 py-2 font-body text-xs text-white outline-none focus:border-white transition-colors disabled:opacity-40"
                >
                  <option value="">Sin categoría</option>
                  {cats.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
                <input
                  type="text"
                  value={form.nueva_categoria}
                  onChange={e => { field('nueva_categoria', e.target.value); field('categoria_id', ''); }}
                  placeholder="O escribí una nueva…"
                  className="mt-1.5 w-full bg-[#111] border border-white/10 px-3 py-2 font-body text-xs text-white placeholder:text-[#333] outline-none focus:border-accent/50 transition-colors"
                />
              </Field>

              <Field label="CENTRO DE COSTO">
                <select
                  value={form.centro_costo}
                  onChange={e => { field('centro_costo', e.target.value); field('nuevo_centro', ''); }}
                  disabled={!!form.nuevo_centro}
                  className="w-full bg-[#111] border border-white/10 px-3 py-2 font-body text-xs text-white outline-none focus:border-white transition-colors disabled:opacity-40"
                >
                  <option value="">Seleccionar…</option>
                  {centros.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="text"
                  value={form.nuevo_centro}
                  onChange={e => { field('nuevo_centro', e.target.value); field('centro_costo', ''); }}
                  placeholder="O escribí uno nuevo…"
                  className="mt-1.5 w-full bg-[#111] border border-white/10 px-3 py-2 font-body text-xs text-white placeholder:text-[#333] outline-none focus:border-accent/50 transition-colors"
                />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field label="STOCK">
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={e => field('stock', Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[#111] border border-white/10 px-3 py-2 font-body text-xs text-white outline-none focus:border-white transition-colors tabular-nums"
                />
              </Field>
              <Field label="STOCK MÍNIMO">
                <input
                  type="number"
                  min={0}
                  value={form.stock_minimo}
                  onChange={e => field('stock_minimo', Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[#111] border border-white/10 px-3 py-2 font-body text-xs text-white outline-none focus:border-white transition-colors tabular-nums"
                />
              </Field>
              <Field label="ESTADO">
                <select
                  value={form.estado}
                  onChange={e => field('estado', e.target.value)}
                  className="w-full bg-[#111] border border-white/10 px-3 py-2 font-body text-xs text-white outline-none focus:border-white transition-colors"
                >
                  {Object.entries(ESTADO_META).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </Field>
            </div>

            {formErr && (
              <div className="border border-red-500/20 bg-red-500/5 px-3 py-2 font-body text-xs text-red-400">{formErr}</div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-heading text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-chalk-muted transition-colors disabled:opacity-40"
              >
                <Save size={12} />
                {saving ? 'Guardando…' : (modal === 'add' ? 'Agregar' : 'Guardar')}
              </button>
              <button onClick={() => setModal(null)} className="px-4 py-2.5 border border-white/10 font-heading text-[10px] tracking-widest text-[#555] hover:text-white uppercase transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Eliminar */}
      {modal === 'delete' && editing && (
        <Modal title="ELIMINAR ÍTEM" onClose={() => setModal(null)}>
          <p className="font-body text-sm text-[#888] mb-6">
            ¿Eliminar <span className="text-white font-semibold">{editing.nombre}</span>? Esta acción no se puede deshacer.
          </p>
          {formErr && (
            <div className="border border-red-500/20 bg-red-500/5 px-3 py-2 font-body text-xs text-red-400 mb-4">{formErr}</div>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white font-heading text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-red-600 transition-colors disabled:opacity-40"
            >
              <Trash2 size={12} />
              {saving ? 'Eliminando…' : 'Eliminar'}
            </button>
            <button onClick={() => setModal(null)} className="px-4 py-2.5 border border-white/10 font-heading text-[10px] tracking-widest text-[#555] hover:text-white uppercase transition-colors">
              Cancelar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Sub-componentes pequeños ──────────────────────────────────────

function Sel({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border border-white/10 bg-[#0A0A0A] px-3 py-2">
      <Filter size={11} className="text-[#444] shrink-0" />
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-transparent font-heading text-[10px] tracking-wider text-white outline-none uppercase"
      >
        {children}
      </select>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg border border-white/10 bg-[#0D0D0D] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="font-heading text-[11px] tracking-[0.2em] text-white uppercase">{title}</div>
          <button onClick={onClose} className="text-[#444] hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
