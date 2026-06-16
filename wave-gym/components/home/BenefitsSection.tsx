'use client';
import { motion } from 'framer-motion';

const beneficios = [
  { n: '01', icon: '🏷️', titulo: 'PRECIO ESPECIAL', desc: 'Asegura el precio de lanzamiento antes de la apertura oficial. Solo por preventa.' },
  { n: '02', icon: '🔒', titulo: 'CUPO ASEGURADO', desc: 'Garantiza tu ingreso al gimnasio antes de que se agoten los 50 cupos disponibles.' },
  { n: '03', icon: '🎁', titulo: 'BENEFICIOS EXCLUSIVOS', desc: 'Accede a ventajas y descuentos exclusivos disponibles solo para miembros de preventa.' },
  { n: '04', icon: '🌊', titulo: 'ENTRENA CON PROPÓSITO', desc: 'Únete a una comunidad enfocada en disciplina, movimiento y propósito desde el día 1.' },
];

export default function BenefitsSection() {
  return (
    <section id="beneficios" className="relative py-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#060606]">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(201,168,76,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_0%_100%,rgba(201,168,76,0.03),transparent)]" />

      {/* Líneas decorativas */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A84C]/20 to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="chip mb-4 w-fit">BENEFICIOS</div>
          <h2 className="section-title max-w-2xl">
            SÉ PARTE<br />
            <span className="shimmer-gold">DESDE EL INICIO</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0.5">
          {beneficios.map((b, i) => (
            <motion.div
              key={b.n}
              id={`beneficio-${b.n}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              className="group relative bg-[#0A0A0A]/80 backdrop-blur border border-white/5 hover:border-[rgba(201,168,76,0.25)] transition-all duration-500 p-8"
            >
              {/* Número grande de fondo */}
              <div className="font-display text-7xl text-white/3 leading-none absolute top-4 right-4 select-none">
                {b.n}
              </div>

              {/* Ícono */}
              <div className="text-3xl mb-5">{b.icon}</div>

              {/* Línea dorada */}
              <div className="w-8 h-px bg-[#C9A84C] mb-4 group-hover:w-16 transition-all duration-500" />

              <h3 className="font-heading font-black text-white text-sm tracking-[0.15em] uppercase mb-3">
                {b.titulo}
              </h3>
              <p className="font-body text-[#555] text-sm leading-relaxed">
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
