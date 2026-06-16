'use client';
import { motion } from 'framer-motion';
import { Dumbbell, Star, BarChart3, Users } from 'lucide-react';

const features = [
  { icon: Dumbbell,  label: 'Equipamiento premium' },
  { icon: Star,      label: 'Ambiente motivador' },
  { icon: BarChart3, label: 'Entrenamiento funcional' },
  { icon: Users,     label: 'Comunidad activa' },
];

export default function GymSection() {
  return (
    <section id="gym" className="relative py-28 px-6 md:px-12 lg:px-20 bg-[#080808] overflow-hidden">
      <div className="gold-line absolute top-0 inset-x-0" />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Imagen */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative group"
        >
          {/* Marco decorativo */}
          <div className="absolute -inset-3 border border-[rgba(201,168,76,0.1)] pointer-events-none" />
          <div className="absolute -inset-1 border border-[rgba(201,168,76,0.05)] pointer-events-none" />

          <div className="relative overflow-hidden aspect-[4/3]">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('/assets/gym-interior.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/70 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/50 to-transparent" />

            {/* Overlay text */}
            <div className="absolute bottom-6 left-6">
              <div className="font-display text-2xl text-white tracking-widest">WAVE PROJECT GYM</div>
              <div className="font-body text-[#666] text-xs tracking-widest mt-0.5">Concepción · Chile</div>
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
            <div className="chip mb-5 w-fit">NUESTRO GYM</div>
            <h2 className="section-title mb-6">
              DISEÑADO PARA<br />TU{' '}
              <span className="shimmer-gold">MEJOR VERSIÓN</span>
            </h2>
            <p className="font-body text-[#555] text-base leading-relaxed mb-4">
              Wave Project Gym nació con un propósito claro: crear un espacio donde cada persona pueda transformarse. Equipamiento de primera, un ambiente diseñado para motivarte y una comunidad que te impulsa.
            </p>
            <p className="font-body text-[#444] text-sm leading-relaxed">
              Ubicado en Concepción, nuestro gimnasio está pensado para quien toma en serio su entrenamiento y su bienestar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-0.5">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-[#0E0E0E] border border-white/5 p-4 hover:border-[rgba(201,168,76,0.2)] transition-all duration-300 group/f"
              >
                <div className="w-7 h-7 border border-white/10 flex items-center justify-center group-hover/f:border-[#C9A84C]/40 transition-colors duration-300">
                  <Icon size={13} className="text-[#C9A84C]" />
                </div>
                <span className="font-heading text-[#666] text-xs font-semibold group-hover/f:text-white transition-colors duration-300">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <a href="#planes" className="btn-gold w-fit text-sm">
            ASEGURAR MI CUPO →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
