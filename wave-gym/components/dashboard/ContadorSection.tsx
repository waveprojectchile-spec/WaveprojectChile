'use client';
import { useState } from 'react';
import { Minus, Plus, Save, RotateCcw, Zap } from 'lucide-react';
import { clampCupos } from '@/lib/preventa';
import { notifyCuposUpdated } from '@/hooks/useRealtimeCupos';

interface Props {
  cuposVendidos: number;
  totalCupos: number;
}

/**
 * Control MANUAL del contador del inicio.
 * El admin decide cuántos cupos "disponibles" se muestran en el home.
 * Internamente se guarda como cupos_vendidos = total - disponibles
 * (así el home y el webhook siguen funcionando sin cambios).
 */
export default function ContadorSection({ cuposVendidos, totalCupos }: Props) {
  const [total, setTotal] = useState(totalCupos);
  // Lo que el admin realmente maneja: los DISPONIBLES visibles en el inicio
  const [disponibles, setDisponibles] = useState(Math.max(0, totalCupos - cuposVendidos));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const dispInicial = Math.max(0, totalCupos - cuposVendidos);
  const dirty = disponibles !== dispInicial || total !== totalCupos;
  const clampDisp = (v: number) => Math.min(Math.max(0, Math.floor(v || 0)), total);

  const guardar = async () => {
    setSaving(true);
    setMsg(null);
    try {
      // Traducimos "disponibles" al modelo interno (vendidos)
      const vendidos = clampCupos(total - disponibles, total);
      const res = await fetch('/api/admin/actualizar-cupos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cuposVendidos: vendidos, totalCupos: total }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const nuevoDisp = Math.max(0, (data.total_cupos ?? total) - (data.cupos_vendidos ?? vendidos));
      setTotal(data.total_cupos ?? total);
      setDisponibles(nuevoDisp);
      setMsg({ ok: true, text: 'Contador actualizado. Ya se ve en el inicio en tiempo real.' });
      notifyCuposUpdated();
    } catch (err: any) {
      setMsg({ ok: false, text: err.message || 'Error al actualizar el contador' });
    }
    setSaving(false);
  };

  return (
    <div className="max-w-xl">
      <div className="font-heading font-bold text-xs tracking-[0.15em] text-white uppercase mb-1">
        Contador de la Preventa
      </div>
      <p className="font-body text-chalk-faint text-xs mb-8">
        Controlá cuántos cupos disponibles se muestran en el inicio. Cambialo cuando
        quieras — se actualiza al instante en el sitio.
      </p>

      {/* Control principal: DISPONIBLES */}
      <div className="border border-white/10 bg-[#0A0A0A] p-8 mb-5">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <Zap size={13} className="text-accent" />
          <span className="font-heading text-[10px] tracking-[0.25em] text-chalk-muted uppercase">
            Cupos disponibles en el inicio
          </span>
        </div>

        <div className="flex items-center justify-center gap-5">
          <button
            onClick={() => setDisponibles((v) => clampDisp(v - 1))}
            disabled={disponibles <= 0}
            aria-label="Restar un cupo disponible"
            className="w-14 h-14 flex items-center justify-center border border-white/15 text-white hover:border-white hover:bg-white/[0.05] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus size={22} />
          </button>

          <input
            type="number"
            value={disponibles}
            min={0}
            max={total}
            onChange={(e) => setDisponibles(clampDisp(Number(e.target.value)))}
            className="w-32 text-center bg-transparent font-display text-6xl text-white outline-none tabular-nums"
            aria-label="Cupos disponibles"
          />

          <button
            onClick={() => setDisponibles((v) => clampDisp(v + 1))}
            disabled={disponibles >= total}
            aria-label="Sumar un cupo disponible"
            className="w-14 h-14 flex items-center justify-center border border-white/15 text-white hover:border-white hover:bg-white/[0.05] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus size={22} />
          </button>
        </div>

        <p className="text-center font-body text-chalk-faint text-[11px] mt-5">
          Así se verá: <span className="text-white font-semibold">{disponibles}</span> disponibles de {total}
        </p>
      </div>

      {/* Ajuste secundario: total de la etapa */}
      <div className="flex items-center justify-between border border-hair bg-[#0A0A0A] px-5 py-4 mb-6">
        <div>
          <div className="font-heading text-[10px] tracking-[0.2em] text-chalk-muted uppercase">Total de la etapa</div>
          <div className="font-body text-chalk-faint text-[11px]">Máximo de cupos de esta preventa</div>
        </div>
        <input
          type="number"
          value={total}
          min={0}
          onChange={(e) => {
            const t = Math.max(0, Math.floor(Number(e.target.value) || 0));
            setTotal(t);
            setDisponibles((d) => Math.min(d, t));
          }}
          className="w-20 text-center bg-[#111] border border-white/10 py-2 font-display text-2xl text-white outline-none focus:border-white tabular-nums"
          aria-label="Total de cupos"
        />
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-3">
        <button
          onClick={guardar}
          disabled={!dirty || saving}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black font-heading text-[11px] tracking-[0.15em] font-bold uppercase hover:bg-chalk-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save size={14} />
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
        {dirty && !saving && (
          <button
            onClick={() => { setDisponibles(dispInicial); setTotal(totalCupos); setMsg(null); }}
            className="flex items-center gap-2 px-4 py-3 border border-white/10 text-chalk-muted font-heading text-[10px] tracking-widest uppercase hover:text-white transition-colors"
          >
            <RotateCcw size={13} />
            Descartar
          </button>
        )}
      </div>

      {msg && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 px-4 py-3 border font-body text-xs ${
            msg.ok
              ? 'border-white/20 bg-white/[0.04] text-white'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          {msg.text}
        </div>
      )}
    </div>
  );
}
