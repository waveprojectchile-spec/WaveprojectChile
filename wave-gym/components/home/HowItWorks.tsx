'use client';
import { motion } from 'framer-motion';

const pasos = [
  { n: '01', titulo: 'ELIGE TU PLAN', desc: 'Selecciona el plan que mejor se adapte a tus objetivos y presupuesto.' },
  { n: '02', titulo: 'COMPRA ONLINE', desc: 'Completa tu compra 100% online de forma segura con MercadoPago.' },
  { n: '03', titulo: 'ASEGURA TU CUPO', desc: 'Recibe la confirmación y tu número de cupo entre los 50 de lanzamiento.' },
  { n: '04', titulo: 'COMIENZA TU CAMBIO', desc: 'Prepárate para entrenar en Wave Project Gym desde el primer día.' },
];

export default function HowItWorks() {
  return (
    <section className="relative py-28 px-6 md:px-12 lg:px-20 bg-[#050505] overflow-hidden">
      <div className="gold-line absolute top-0 inset-x-0" />

      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="chip mb-4 w-fit">PROCESO</div>
          <h2 className="section-title">
            ¿CÓMO<br />
            <span className="shimmer-gold">FUNCIONA?</span>
          </h2>
        </motion.div>

        {/* Pasos en línea horizontal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
          {pasos.map((p, i) => (
            <motion.div
              key={p.n}
              id={`paso-${p.n}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="relative flex flex-col border-l border-white/5 pl-8 py-8 md:pr-8 hover:border-[#C9A84C]/30 transition-all duration-500 group"
            >
              {/* Dot en la línea */}
              <div className="absolute left-0 top-8 w-2 h-2 -translate-x-1 bg-[#C9A84C] group-hover:shadow-[0_0_12px_rgba(201,168,76,0.8)] transition-all duration-300" />

              <div className="font-display text-6xl text-[#C9A84C]/10 leading-none mb-4">{p.n}</div>
              <h3 className="font-heading font-black text-white text-sm tracking-[0.15em] uppercase mb-3">
                {p.titulo}
              </h3>
              <p className="font-body text-[#555] text-sm leading-relaxed">{p.desc}</p>

              {/* Flecha al siguiente (no en el último) */}
              {i < pasos.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-12 text-[#C9A84C]/30 font-display text-lg z-10">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
