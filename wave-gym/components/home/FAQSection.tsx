'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  { id: 'inicio', q: '¿Cuándo inicia mi plan?', a: 'Tu plan comienza a partir de la apertura oficial de Wave Project Gym. Recibirás un correo con la fecha exacta de inicio con anticipación.' },
  { id: 'renovable', q: '¿La preventa es renovable?', a: 'Sí. Tu precio de preventa se puede renovar hasta 4 veces, asegurando el precio especial de lanzamiento en tus próximas renovaciones.' },
  { id: 'cambio', q: '¿Puedo cambiar de plan después?', a: 'Una vez completada la compra, el plan es definitivo para esta etapa. Podrás cambiar de modalidad en futuras renovaciones.' },
  { id: 'agotado', q: '¿Qué pasa si se agotan los 50 cupos?', a: 'Una vez agotados los 50 cupos, no se venderán más preventas en esta etapa. Te recomendamos asegurar el tuyo ahora.' },
  { id: 'pago', q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos todos los medios disponibles en Chile a través de MercadoPago: tarjeta de débito, crédito, transferencia y más.' },
  { id: 'congelar', q: '¿Puedo congelar mi plan?', a: 'Las condiciones de congelamiento estarán disponibles una vez que el gimnasio abra. El equipo de Wave Project Gym te informará los detalles.' },
];

export default function FAQSection() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="relative py-28 px-6 md:px-12 lg:px-20 bg-[#050505] overflow-hidden">
      <div className="gold-line absolute top-0 inset-x-0" />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Título fijo a la izquierda */}
        <div className="lg:col-span-4">
          <div className="sticky top-28">
            <div className="chip mb-4 w-fit">FAQ</div>
            <h2 className="section-title mb-6">
              PREGUNTAS<br />
              <span className="shimmer-gold">FRECUENTES</span>
            </h2>
            <p className="font-body text-[#444] text-sm leading-relaxed mb-8">
              ¿Tienes dudas? Aquí encontrarás las respuestas más comunes sobre la preventa.
            </p>
            <a href="#contacto" className="btn-outline text-xs py-3 px-5">
              CONTACTAR →
            </a>
          </div>
        </div>

        {/* Acordeón */}
        <div className="lg:col-span-8 flex flex-col divide-y divide-white/5">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              id={`faq-${faq.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <button
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                onClick={() => setOpen(open === faq.id ? null : faq.id)}
                aria-expanded={open === faq.id}
              >
                <div className="flex items-center gap-4">
                  <span className="font-display text-sm text-[#333] group-hover:text-[#C9A84C] transition-colors w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-heading font-bold text-[#888] text-sm group-hover:text-white transition-colors duration-200 leading-snug">
                    {faq.q}
                  </span>
                </div>
                <div className={`flex-shrink-0 w-7 h-7 border flex items-center justify-center transition-all duration-300 ${
                  open === faq.id ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-white/10 text-[#444]'
                }`}>
                  {open === faq.id ? <Minus size={13} /> : <Plus size={13} />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {open === faq.id && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="font-body text-[#555] text-sm leading-relaxed pb-6 pl-10 pr-12">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
