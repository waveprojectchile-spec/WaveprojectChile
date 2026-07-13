'use client';
import { motion } from 'framer-motion';
import { Check, Star, Lock } from 'lucide-react';
import { useRealtimeCupos } from '@/hooks/useRealtimeCupos';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useLang } from '@/lib/i18n/LangContext';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PLAN_IDS = ['mensual', 'trimestral', 'semestral', 'anual'] as const;
const PLAN_PRICES = [35990, 107970, 215940, 431880];
const PLAN_MESES = [1, 3, 6, 12];

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

export default function PlansSection() {
  const { d } = useLang();
  const { cuposDisponibles, totalCupos, porcentaje } = useRealtimeCupos();
  const agotado = cuposDisponibles <= 0;
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const planNames = [d.plans.names.mensual, d.plans.names.trimestral, d.plans.names.semestral, d.plans.names.anual];
  const planFeats = [
    [d.plans.feat.m1, d.plans.feat.access, d.plans.feat.community, d.plans.feat.renew],
    [d.plans.feat.m3, d.plans.feat.access, d.plans.feat.community, d.plans.feat.renew],
    [d.plans.feat.m6, d.plans.feat.access, d.plans.feat.community, d.plans.feat.renew],
    [d.plans.feat.m12, d.plans.feat.access, d.plans.feat.community, d.plans.feat.renew],
  ];

  return (
    <section id="planes" className="relative py-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/planes-bg.jpg)' }} aria-hidden />
      <div className="absolute inset-0 bg-[#050505]/62" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgb(var(--accent)/0.03),transparent)]" aria-hidden />
      <div className="accent-line mb-0 absolute top-0 inset-x-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="chip mb-4 w-fit">{d.plans.chip}</div>
            <h2 className="section-title">
              {d.plans.title1}<br />
              <span className="text-shimmer">{d.plans.title2}</span>
            </h2>
          </div>
          <p className="font-body text-chalk-muted text-sm max-w-xs leading-relaxed md:text-right">
            {d.plans.subtitle1}<br />
            <span className="text-chalk-muted">{d.plans.subtitle2}</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5">
          {PLAN_IDS.map((id, i) => {
            const destacado = id === 'semestral';
            const color = destacado ? 'from-[#1C1700] to-[#0E0B00]' : 'from-[#1A1A1A] to-[#111111]';
            return (
              <motion.div
                key={id}
                id={`plan-${id}`}
                initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col group bg-gradient-to-b ${color} border transition-all duration-500 ${
                  destacado ? 'border-accent z-10 shadow-[0_0_60px_rgb(var(--accent)/0.15)] -mx-0.5 -my-2' : 'border-hair hover:border-[rgb(var(--accent)/0.2)]'
                }`}
              >
                {destacado && (
                  <div className="absolute -top-0 inset-x-0 bg-accent text-black font-heading font-black text-[9px] tracking-[0.2em] text-center py-2 flex items-center justify-center gap-1.5">
                    <Star size={9} fill="black" /> {d.plans.best}
                  </div>
                )}
                <div className={`flex flex-col flex-1 p-7 ${destacado ? 'pt-12' : ''}`}>
                  <div className="font-display text-6xl text-white/5 leading-none mb-2 select-none">
                    {PLAN_MESES[i] < 10 ? `0${PLAN_MESES[i]}` : PLAN_MESES[i]}
                  </div>
                  <div className="font-heading font-black text-xs tracking-[0.25em] text-chalk-muted uppercase mb-1">{d.plans.preventa}</div>
                  <div className={`font-display text-3xl tracking-wider mb-5 ${destacado ? 'text-shimmer' : 'text-white'}`}>{planNames[i]}</div>
                  <div className="mb-7">
                    <div className={`font-display leading-none ${destacado ? 'text-accent-fill' : 'text-white'}`} style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
                      {fmt(PLAN_PRICES[i])}
                    </div>
                    <div className="font-body text-chalk-faint text-xs mt-1">{d.plans.pesos}</div>
                  </div>
                  <ul className="flex flex-col gap-3 flex-1 mb-8">
                    {planFeats[i].map(f => (
                      <li key={f} className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          destacado ? 'bg-[rgb(var(--accent)/0.2)] border border-accent/40' : 'bg-white/5 border border-white/10'
                        }`}>
                          <Check size={9} className={destacado ? 'text-accent' : 'text-chalk-muted'} />
                        </div>
                        <span className="font-body text-xs text-chalk-muted leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    id={`btn-${id}`}
                    disabled={agotado || loadingPlan === id}
                    onClick={() => { window.location.href = `/checkout?plan=${id}`; }}
                    className={`w-full font-heading font-black text-[11px] tracking-[0.2em] uppercase py-4 transition-all duration-300 border ${
                      agotado ? 'bg-transparent border-hair text-chalk-faint cursor-not-allowed'
                      : loadingPlan === id ? 'bg-transparent border-hair text-chalk-muted cursor-wait'
                      : destacado ? 'btn-accent border-transparent'
                      : 'bg-transparent border-white/10 text-white hover:border-accent hover:text-accent group-hover:border-accent'
                    }`}
                  >
                    {agotado ? d.plans.soldOut : loadingPlan === id ? d.plans.processing : d.plans.choose}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-1 border border-hair bg-ink-800 p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-[rgb(var(--accent)/0.3)] flex items-center justify-center">
              <Lock size={16} className="text-accent" />
            </div>
            <div>
              <div className="font-heading font-black text-white text-xs tracking-widest uppercase">{d.plans.limited}</div>
              <div className="font-body text-chalk-faint text-[11px] mt-0.5">{d.plans.limitedDesc}</div>
            </div>
          </div>
          <div className="flex-1 min-w-0 max-w-lg">
            <div className="flex justify-between mb-2 font-heading text-[10px] tracking-widest uppercase">
              <span className="text-chalk-faint">{d.plans.sold.replace('{n}', '0')}</span>
              <span className="text-accent">{d.plans.remain.replace('{n}', String(cuposDisponibles))}</span>
              <span className="text-chalk-faint">{d.plans.total.replace('{n}', String(totalCupos))}</span>
            </div>
            <div className="h-1.5 bg-ink-700 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent via-accent to-accent"
                initial={{ width: '0%' }}
                whileInView={{ width: `${porcentaje || 2}%` }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
