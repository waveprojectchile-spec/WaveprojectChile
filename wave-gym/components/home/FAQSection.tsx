'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useLang } from '@/lib/i18n/LangContext';

export default function FAQSection() {
  const { d } = useLang();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-28 px-6 md:px-12 lg:px-20 bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/faq-bg.jpg)' }} aria-hidden />
      <div className="absolute inset-0 bg-[#050505]/72" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" aria-hidden />
      <div className="accent-line absolute top-0 inset-x-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4">
          <div className="sticky top-28">
            <div className="chip mb-4 w-fit">{d.faq.chip}</div>
            <h2 className="section-title mb-6">
              {d.faq.title1}<br />
              <span className="text-shimmer">{d.faq.title2}</span>
            </h2>
            <p className="font-body text-chalk-faint text-sm leading-relaxed mb-8">{d.faq.intro}</p>
            <a href="#contacto" className="btn-outline text-xs py-3 px-5">{d.faq.contact}</a>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col divide-y divide-white/5">
          {d.faq.items.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <button
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <div className="flex items-center gap-4">
                  <span className="font-display text-sm text-chalk-faint group-hover:text-accent transition-colors w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-heading font-bold text-chalk-muted text-sm group-hover:text-white transition-colors duration-200 leading-snug">
                    {faq.q}
                  </span>
                </div>
                <div className={`flex-shrink-0 w-7 h-7 border flex items-center justify-center transition-all duration-300 ${
                  open === i ? 'border-accent text-accent' : 'border-white/10 text-chalk-faint'
                }`}>
                  {open === i ? <Minus size={13} /> : <Plus size={13} />}
                </div>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="font-body text-chalk-muted text-sm leading-relaxed pb-6 pl-10 pr-12">{faq.a}</p>
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
