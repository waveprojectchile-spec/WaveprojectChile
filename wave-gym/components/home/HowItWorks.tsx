'use client';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n/LangContext';

export default function HowItWorks() {
  const { d } = useLang();

  return (
    <section className="relative py-28 px-6 md:px-12 lg:px-20 bg-[#050505] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/proceso-bg.jpg)' }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#050505]/70" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" aria-hidden />
      <div className="accent-line absolute top-0 inset-x-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="chip mb-4 w-fit">{d.how.chip}</div>
          <h2 className="section-title">
            {d.how.title1}<br />
            <span className="text-shimmer">{d.how.title2}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
          {d.how.steps.map((p, i) => (
            <motion.div
              key={i}
              id={`paso-0${i + 1}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="relative flex flex-col border-l border-hair pl-8 py-8 md:pr-8 hover:border-accent/30 transition-all duration-500 group"
            >
              <div className="absolute left-0 top-8 w-2 h-2 -translate-x-1 bg-accent group-hover:shadow-[0_0_12px_rgb(var(--accent)/0.8)] transition-all duration-300" />
              <div className="font-display text-6xl text-accent/10 leading-none mb-4">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="font-heading font-black text-white text-sm tracking-[0.15em] uppercase mb-3">
                {p.t}
              </h3>
              <p className="font-body text-chalk-muted text-sm leading-relaxed">{p.d}</p>
              {i < d.how.steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-12 text-accent/30 font-display text-lg z-10">→</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
