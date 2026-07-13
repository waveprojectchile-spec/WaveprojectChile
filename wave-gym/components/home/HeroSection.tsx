'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingCart, ArrowRight, Lock, Zap, CalendarDays, RefreshCw, Users } from 'lucide-react';
import ParticleCanvas from '@/components/ui/ParticleCanvas';
import PreventaTimer from '@/components/home/PreventaTimer';
import { useRealtimeCupos } from '@/hooks/useRealtimeCupos';
import { useLang } from '@/lib/i18n/LangContext';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const { cuposDisponibles, totalCupos } = useRealtimeCupos();
  const { d } = useLang();

  const bgY    = useTransform(scrollY, [0, 700], [0, -160]);
  const textY  = useTransform(scrollY, [0, 700], [0,  60]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const chipIcons = [CalendarDays, RefreshCw, Users, Zap];
  const chipLabels = [d.hero.chips.flex, d.hero.chips.renov, d.hero.chips.community, d.hero.chips.level];

  return (
    <section id="inicio" ref={containerRef} className="relative min-h-screen overflow-hidden flex items-center scanlines">
      <motion.div style={{ y: bgY }} className="absolute inset-0 h-[120%] -top-[10%]">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover absolute inset-0 grayscale contrast-[1.05]">
          <source src="/FONDO.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 120% 80% at 70% 40%, rgba(255,255,255,0.05) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/70 via-[#050505]/30 to-[#050505]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 via-transparent to-[#050505]/20" />
        <div aria-hidden className="absolute bottom-0 left-0 right-0 h-[32%] pointer-events-none"
          style={{ background: 'linear-gradient(to top, #050505 0%, #050505 35%, rgba(5,5,5,0.85) 55%, rgba(5,5,5,0.4) 78%, transparent 100%)' }} />
      </motion.div>

      <ParticleCanvas />

      <div className="absolute left-8 top-0 bottom-0 hidden lg:flex flex-col items-center justify-center z-20">
        <div className="w-px flex-1 bg-gradient-to-b from-transparent via-white/25 to-transparent" />
        <div className="w-1 h-1 rounded-full bg-accent my-2" />
        <div className="w-px flex-1 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
      </div>

      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-0 items-center"
      >
        {/* Columna izquierda */}
        <div className="lg:col-span-7 flex flex-col gap-7">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="chip w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {d.hero.badge}
            </div>
          </motion.div>

          <div className="flex flex-col gap-1 overflow-hidden">
            {['WAVE', 'PROJECT', 'GYM'].map((word, i) => (
              <motion.div key={word} initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.13, ease: [0.16, 1, 0.3, 1] }}>
                <h1 className={`font-display leading-[0.88] ${i === 0 ? 'text-white' : i === 1 ? 'text-shimmer' : 'text-stroke-accent'}`}
                  style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}>
                  {word}
                </h1>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex items-center gap-3">
            <div className="w-8 h-px bg-accent" />
            <span className="font-heading text-chalk-faint text-xs tracking-[0.3em] uppercase">{d.hero.tagline}</span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="font-body text-chalk-muted text-base md:text-lg leading-relaxed max-w-lg">
            {d.hero.desc1}
            <span className="text-white font-medium">{d.hero.desc2}</span>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}
            className="flex flex-wrap items-center gap-4">
            <a href="#planes" id="hero-comprar" className="btn-accent text-sm">
              <ShoppingCart size={15} /> {d.hero.ctaBuy}
            </a>
            <a href="#planes" id="hero-planes" className="btn-outline text-sm">
              {d.hero.ctaPlans} <ArrowRight size={14} />
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="flex flex-wrap gap-6 pt-4 border-t border-white/5">
            {[
              { val: '50', label: d.hero.stats.cupos },
              { val: '2x', label: d.hero.stats.renov },
              { val: '100%', label: 'Online' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-display text-2xl text-accent">{s.val}</div>
                <div className="font-body text-[10px] text-chalk-faint uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Columna derecha */}
        <div className="lg:col-span-5 flex flex-col items-end gap-6">
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: 'spring', stiffness: 80 }}
            className="relative w-full max-w-xs glass-card p-6 border border-accent-line">
            <PreventaTimer />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8, type: 'spring', stiffness: 80 }}
            className="relative w-full max-w-xs glass-card p-8 border border-accent-line">
            {['top-0 left-0', 'top-0 right-0 rotate-90', 'bottom-0 right-0 rotate-180', 'bottom-0 left-0 -rotate-90'].map(cls => (
              <div key={cls} className={`absolute ${cls} w-4 h-4 pointer-events-none`}>
                <div className="w-full h-px bg-accent" /><div className="w-px h-full bg-accent" />
              </div>
            ))}
            <div className="flex items-center gap-2 mb-6">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-accent animate-pulse-ring" />
              </div>
              <span className="label-accent text-[10px]">{d.hero.cuposLive}</span>
            </div>
            <div className="text-center mb-4">
              <motion.div key={cuposDisponibles} initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="font-display text-white leading-none" style={{ fontSize: 'clamp(5rem, 15vw, 8rem)' }}>
                {cuposDisponibles}
              </motion.div>
              <div className="font-heading font-black text-white text-xs tracking-[0.3em] uppercase mt-1">{d.hero.cuposLabel}</div>
              <div className="font-body text-chalk-faint text-[10px] mt-0.5">
                {d.hero.cuposOf.replace('{total}', String(totalCupos))}
              </div>
            </div>
            <div className="h-1 bg-ink-700 rounded-full overflow-hidden mb-4">
              <motion.div className="h-full rounded-full bg-accent" initial={{ width: '0%' }}
                animate={{ width: `${((totalCupos - cuposDisponibles) / totalCupos) * 100}%` }}
                transition={{ duration: 1.5, delay: 0.8 }} />
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Lock size={11} className="text-accent" />
              <span className="font-heading text-chalk-faint text-[10px] tracking-wider uppercase">
                {d.hero.cuposLimit.replace('{total}', String(totalCupos))}
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="flex flex-wrap gap-2 justify-end">
            {chipIcons.map((Icon, i) => (
              <span key={i} className="chip !text-chalk-muted !border-white/10 !bg-white/[0.03]">
                <Icon size={11} className="text-accent" />
                {chipLabels[i]}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="font-heading text-chalk-faint text-[9px] tracking-widest uppercase">{d.hero.scroll}</span>
        <div className="w-px h-10 bg-gradient-to-b from-accent/60 to-transparent" />
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-hair bg-[#050505]/80 backdrop-blur-sm px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-accent" />
          <span className="font-heading text-chalk-faint text-[10px] tracking-widest uppercase">Wave Project Gym · Concón, Chile</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-heading text-accent text-[10px] tracking-widest">@waveprojectgym</span>
          <div className="w-px h-3 bg-ink-600" />
          <span className="font-heading text-chalk-faint text-[10px] tracking-widest uppercase">{d.nav.pretitle}</span>
        </div>
      </div>
    </section>
  );
}
