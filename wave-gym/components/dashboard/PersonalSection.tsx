'use client';
import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface Props {
  colaboradores: any[];
}

export default function PersonalSection({ colaboradores }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', password: '', role: 'colaborador' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!form.nombre || !form.email || !form.password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/crear-colaborador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setShowModal(false);
        window.location.reload();
      }
    } catch {
      setError('Error de conexión');
    }
    setSaving(false);
  };

  return (
    <>
      <div className="border border-white/5 bg-[#0A0A0A] overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="font-heading font-bold text-xs tracking-[0.15em] text-white uppercase">Personal ({colaboradores.length})</div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-[#C9A84C] text-black font-heading text-[9px] tracking-widest font-bold hover:bg-[#F5C842] transition-colors"
          >
            <Plus size={12} /> AGREGAR
          </button>
        </div>
        {colaboradores.length === 0 ? (
          <div className="p-10 text-center">
            <div className="font-heading text-[11px] text-[#444] tracking-widest">NO HAY PERSONAL REGISTRADO</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['NOMBRE', 'EMAIL', 'ROL', 'FECHA INGRESO'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {colaboradores.map((c, i) => (
                  <tr key={c.id || i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-heading text-xs text-white tracking-wider">{c.nombre || '—'}</td>
                    <td className="px-5 py-3 font-body text-[11px] text-[#666]">{c.email || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2 py-0.5 font-heading text-[9px] tracking-widest uppercase ${
                        c.role === 'admin'
                          ? 'bg-[rgba(201,168,76,0.1)] text-[#C9A84C] border border-[rgba(201,168,76,0.2)]'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {c.role}
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
        )}
      </div>

      {/* Modal agregar colaborador */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-[#0E0E0E] border border-white/10 w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors">
              <X size={16} />
            </button>
            <div className="font-display text-xl text-white mb-5">AGREGAR COLABORADOR</div>
            <div className="flex flex-col gap-3">
              <input
                placeholder="Nombre completo"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="bg-[#111] border border-white/10 px-4 py-3 font-body text-sm text-white outline-none focus:border-[#C9A84C] transition-colors"
              />
              <input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-[#111] border border-white/10 px-4 py-3 font-body text-sm text-white outline-none focus:border-[#C9A84C] transition-colors"
              />
              <input
                placeholder="Contraseña temporal"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-[#111] border border-white/10 px-4 py-3 font-body text-sm text-white outline-none focus:border-[#C9A84C] transition-colors"
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="bg-[#111] border border-white/10 px-4 py-3 font-body text-sm text-white outline-none focus:border-[#C9A84C] transition-colors"
              >
                <option value="colaborador">Colaborador</option>
                <option value="admin">Admin</option>
              </select>
              {error && <div className="font-body text-xs text-red-400">{error}</div>}
              <button
                onClick={handleCreate}
                disabled={saving}
                className="w-full py-3 bg-[#C9A84C] text-black font-heading text-[10px] tracking-[0.2em] font-bold hover:bg-[#F5C842] transition-colors disabled:opacity-50 mt-2"
              >
                {saving ? 'CREANDO...' : 'CREAR COLABORADOR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
