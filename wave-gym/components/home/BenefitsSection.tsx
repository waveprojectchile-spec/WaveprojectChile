'use client';
import { motion } from 'framer-motion';
import { Tag, Lock, Gift, Waves } from 'lucide-react';
import { useLang } from '@/lib/i18n/LangContext';

const ICONS = [Tag, Lock, Gift, Waves];

export default function BenefitsSection() {
  const { d } = useLang();

  return (
    <section id="beneficios" className="relative py-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-ink-950">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/beneficios-bg.jpg)' }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#050505]/68" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" aria-hidden />
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="chip mb-4 w-fit">{d.benefits.chip}</div>
          <h2 className="section-title max-w-2xl">
            {d.benefits.title1}<br />
            <span className="text-shimmer">{d.benefits.title2}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0.5">
          {d.benefits.items.map((b, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={i}
                id={`beneficio-0${i + 1}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                className="group relative bg-ink-900/80 backdrop-blur border border-hair hover:border-[rgb(var(--accent)/0.25)] transition-all duration-500 p-8"
              >
                <div className="font-display text-7xl text-white/[0.04] leading-none absolute top-4 right-4 select-none">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="w-11 h-11 flex items-center justify-center border border-accent-line rounded-sm mb-5 group-hover:border-accent transition-colors duration-300">
                  <Icon size={20} className="text-accent" strokeWidth={1.75} />
                </div>
                <div className="w-8 h-px bg-accent mb-4 group-hover:w-16 transition-all duration-500" />
                <h3 className="font-heading font-black text-white text-sm tracking-[0.15em] uppercase mb-3">
                  {b.t}
                </h3>
                <p className="font-body text-chalk-muted text-sm leading-relaxed">{b.d}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
