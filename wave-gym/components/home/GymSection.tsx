'use client';
import { motion } from 'framer-motion';
import { Dumbbell, Star, BarChart3, Users } from 'lucide-react';
import { useLang } from '@/lib/i18n/LangContext';

const FEAT_ICONS = [Dumbbell, Star, BarChart3, Users];

export default function GymSection() {
  const { d } = useLang();
  const featLabels = [d.gym.feat.equip, d.gym.feat.ambiente, d.gym.feat.funcional, d.gym.feat.comunidad];

  return (
    <section id="gym" className="relative py-28 px-6 md:px-12 lg:px-20 bg-ink-900 overflow-hidden">
      <div className="accent-line absolute top-0 inset-x-0" />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Video */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative group"
        >
          <div className="absolute -inset-3 border border-[rgb(var(--accent)/0.1)] pointer-events-none" />
          <div className="absolute -inset-1 border border-[rgb(var(--accent)/0.05)] pointer-events-none" />
          <div className="relative overflow-hidden aspect-[4/3]">
            <video
              autoPlay loop muted playsInline
              className="w-full h-full object-cover grayscale contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
            >
              <source src="/FONDO.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/40 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/10 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <div className="font-display text-2xl text-white tracking-widest">WAVE PROJECT GYM</div>
              <div className="font-body text-chalk-muted text-xs tracking-widest mt-0.5">{d.gym.addr}</div>
            </div>
          </div>
        </motion.div>

        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-8"
        >
          <div>
            <div className="chip mb-5 w-fit">{d.gym.chip}</div>
            <h2 className="section-title mb-6">
              {d.gym.title1}<br />{' '}
              <span className="text-shimmer">{d.gym.title2}</span>
            </h2>
            <p className="font-body text-chalk-muted text-base leading-relaxed mb-4">{d.gym.p1}</p>
            <p className="font-body text-chalk-faint text-sm leading-relaxed">{d.gym.p2}</p>
          </div>

          <div className="grid grid-cols-2 gap-0.5">
            {featLabels.map((label, i) => {
              const Icon = FEAT_ICONS[i];
              return (
                <div
                  key={label}
                  className="flex items-center gap-3 bg-ink-800 border border-hair p-4 hover:border-[rgb(var(--accent)/0.2)] transition-all duration-300 group/f"
                >
                  <div className="w-7 h-7 border border-white/10 flex items-center justify-center group-hover/f:border-accent/40 transition-colors duration-300">
                    <Icon size={13} className="text-accent" />
                  </div>
                  <span className="font-heading text-chalk-muted text-xs font-semibold group-hover/f:text-white transition-colors duration-300">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <a href="#planes" className="btn-accent w-fit text-sm">{d.gym.cta}</a>
        </motion.div>
      </div>
    </section>
  );
}
