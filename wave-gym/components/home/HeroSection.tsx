'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingCart, ArrowRight, Lock, Zap } from 'lucide-react';
import ParticleCanvas from '@/components/ui/ParticleCanvas';
import { useRealtimeCupos } from '@/hooks/useRealtimeCupos';

/* ── Logo SVG inline (ola en círculo) ── */
function WaveLogo({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="47" stroke="white" strokeWidth="3"/>
      {/* Ola principal */}
      <path
        d="M15 58 C22 42 30 36 40 44 C50 52 58 46 68 30"
        stroke="white" strokeWidth="4" strokeLinecap="round" fill="none"
      />
      {/* Ola secundaria / base */}
      <path
        d="M15 68 C25 54 34 50 44 56 C54 62 62 58 72 44 C78 36 82 32 88 28"
        stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55"
      />
      {/* Punto de origen */}
      <path
        d="M14 72 C18 65 22 63 26 65"
        stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4"
      />
    </svg>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const { cuposDisponibles, totalCupos } = useRealtimeCupos();

  /* Parallax layers */
  const bgY    = useTransform(scrollY, [0, 700], [0, -160]);
  const textY  = useTransform(scrollY, [0, 700], [0,  60]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section
      id="inicio"
      ref={containerRef}
      className="relative min-h-screen overflow-hidden flex items-center scanlines"
    >
      {/* ══════════════════════════════════
          FONDO: imagen atardecer dramático
      ══════════════════════════════════ */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 h-[120%] -top-[10%]">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/hero-exterior.jpg')" }}
        />
        {/* Capas de overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/70 to-[#050505]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40" />
        {/* Vignette lateral derecha */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#050505]/60 to-transparent" />
      </motion.div>

      {/* Partículas */}
      <ParticleCanvas />

      {/* Línea vertical izquierda decorativa */}
      <div className="absolute left-8 top-0 bottom-0 hidden lg:flex flex-col items-center justify-center z-20">
        <div className="w-px flex-1 bg-gradient-to-b from-transparent via-[#C9A84C]/30 to-transparent" />
        <div className="w-1 h-1 rounded-full bg-[#C9A84C] my-2" />
        <div className="w-px flex-1 bg-gradient-to-b from-transparent via-[#C9A84C]/20 to-transparent" />
      </div>

      {/* ══════════════════════════════════
          CONTENIDO
      ══════════════════════════════════ */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-0 items-center"
      >
        {/* ── COLUMNA IZQUIERDA (texto) ── */}
        <div className="lg:col-span-7 flex flex-col gap-7">

          {/* Chip "PREVENTA OFICIAL" */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="chip w-fit animate-border-glow">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842] animate-pulse" />
              1ª PREVENTA OFICIAL — CONCEPCIÓN
            </div>
          </motion.div>

          {/* TÍTULO MEGA */}
          <div className="flex flex-col gap-1 overflow-hidden">
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-display leading-[0.88] text-white"
                  style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}>
                WAVE
              </h1>
            </motion.div>

            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-display leading-[0.88] shimmer-gold"
                  style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}>
                PROJECT
              </h1>
            </motion.div>

            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-display leading-[0.88] text-stroke-gold"
                  style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}>
                GYM
              </h1>
            </motion.div>
          </div>

          {/* Slogan */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-px bg-[#C9A84C]" />
            <span className="font-heading text-[#707070] text-xs tracking-[0.3em] uppercase">
              MOVIMIENTO · DISCIPLINA · PROPÓSITO
            </span>
          </motion.div>

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="font-body text-[#888] text-base md:text-lg leading-relaxed max-w-lg"
          >
            Accede al gimnasio que transforma tu cuerpo, tu mente y tu propósito.
            <span className="text-white font-medium"> Solo 50 cupos disponibles.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a href="#planes" id="hero-comprar" className="btn-gold text-sm">
              <ShoppingCart size={15} />
              ASEGURAR MI CUPO
            </a>
            <a href="#planes" id="hero-planes" className="btn-outline text-sm">
              VER PLANES
              <ArrowRight size={14} />
            </a>
          </motion.div>

          {/* Stats horizontales */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex flex-wrap gap-6 pt-4 border-t border-white/5"
          >
            {[
              { val: '50', label: 'Cupos totales' },
              { val: '4x', label: 'Renovaciones' },
              { val: '100%', label: 'Online' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-display text-2xl text-[#C9A84C]">{s.val}</div>
                <div className="font-body text-[10px] text-[#555] uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── COLUMNA DERECHA (cupos card) ── */}
        <div className="lg:col-span-5 flex flex-col items-end gap-6">
          {/* Logo grande */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 0.12, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
            className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none"
          >
            <WaveLogo size={420} />
          </motion.div>

          {/* Card cupos */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8, type: 'spring', stiffness: 80 }}
            className="relative w-full max-w-xs glass-card p-8 border border-[rgba(201,168,76,0.2)] animate-border-glow"
          >
            {/* Esquinas decorativas */}
            {['top-0 left-0', 'top-0 right-0 rotate-90', 'bottom-0 right-0 rotate-180', 'bottom-0 left-0 -rotate-90'].map(cls => (
              <div key={cls} className={`absolute ${cls} w-4 h-4 pointer-events-none`}>
                <div className="w-full h-px bg-[#C9A84C]" />
                <div className="w-px h-full bg-[#C9A84C]" />
              </div>
            ))}

            {/* Ping indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-[#F5C842]" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#F5C842] animate-pulse-ring" />
              </div>
              <span className="label-gold text-[10px]">EN VIVO · CUPOS RESTANTES</span>
            </div>

            {/* Número */}
            <div className="text-center mb-4">
              <motion.div
                key={cuposDisponibles}
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-fire leading-none"
                style={{ fontSize: 'clamp(5rem, 15vw, 8rem)' }}
              >
                {cuposDisponibles}
              </motion.div>
              <div className="font-heading font-black text-white text-xs tracking-[0.3em] uppercase mt-1">
                CUPOS DISPONIBLES
              </div>
              <div className="font-body text-[#555] text-[10px] mt-0.5">
                de {totalCupos} cupos de lanzamiento
              </div>
            </div>

            {/* Barra progreso */}
            <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #C9A84C, #F5C842)' }}
                initial={{ width: '0%' }}
                animate={{ width: `${((totalCupos - cuposDisponibles) / totalCupos) * 100}%` }}
                transition={{ duration: 1.5, delay: 0.8 }}
              />
            </div>

            {/* Lock */}
            <div className="flex items-center gap-2 justify-center">
              <Lock size={11} className="text-[#C9A84C]" />
              <span className="font-heading text-[#555] text-[10px] tracking-wider uppercase">
                Cupos limitados — no se venderán más de 50
              </span>
            </div>
          </motion.div>

          {/* Feature chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap gap-2 justify-end"
          >
            {['📅 Acceso flexible', '🔄 Renovable x4', '👥 Comunidad', '⚡ Alto nivel'].map(f => (
              <span key={f} className="chip text-[#888] border-white/10">
                {f}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Flecha scroll bottom */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="font-heading text-[#555] text-[9px] tracking-widest uppercase">scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#C9A84C]/60 to-transparent" />
      </motion.div>

      {/* Barra inferior con ticker */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/5 bg-[#050505]/80 backdrop-blur-sm px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-[#C9A84C]" />
          <span className="font-heading text-[#555] text-[10px] tracking-widest uppercase">Wave Project Gym · Concón, Chile</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-heading text-[#C9A84C] text-[10px] tracking-widest">@waveprojectgym</span>
          <div className="w-px h-3 bg-[#2A2A2A]" />
          <span className="font-heading text-[#555] text-[10px] tracking-widest uppercase">Preventa 2025</span>
        </div>
      </div>
    </section>
  );
}
