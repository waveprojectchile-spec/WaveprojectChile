'use client';
import { motion } from 'framer-motion';
import { Check, Star, Lock, Zap } from 'lucide-react';
import { useRealtimeCupos } from '@/hooks/useRealtimeCupos';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const planes = [
  {
    id: 'mensual',
    nombre: 'MENSUAL',
    precio: 32990,
    meses: 1,
    destacado: false,
    color: 'from-[#1A1A1A] to-[#111111]',
    features: ['1 mes de acceso', 'Acceso al gimnasio', 'Comunidad Wave Project', 'Renovable hasta 4 veces'],
  },
  {
    id: 'trimestral',
    nombre: 'TRIMESTRAL',
    precio: 98970,
    meses: 3,
    destacado: false,
    color: 'from-[#1A1A1A] to-[#111111]',
    features: ['3 meses de acceso', 'Acceso al gimnasio', 'Comunidad Wave Project', 'Renovable hasta 4 veces'],
  },
  {
    id: 'semestral',
    nombre: 'SEMESTRAL',
    precio: 197940,
    meses: 6,
    destacado: true,
    color: 'from-[#1C1700] to-[#0E0B00]',
    features: ['6 meses de acceso', 'Acceso al gimnasio', 'Comunidad Wave Project', 'Renovable hasta 4 veces'],
  },
  {
    id: 'anual',
    nombre: 'ANUAL',
    precio: 395880,
    meses: 12,
    destacado: false,
    color: 'from-[#1A1A1A] to-[#111111]',
    features: ['12 meses de acceso', 'Acceso al gimnasio', 'Comunidad Wave Project', 'Renovable hasta 4 veces'],
  },
];

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

export default function PlansSection() {
  const { cuposDisponibles, totalCupos, cuposVendidos, porcentaje } = useRealtimeCupos();
  const agotado = cuposDisponibles <= 0;
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: any) => {
    try {
      setLoadingPlan(plan.id);

      // Try to get session for user metadata
      let userId: string | null = null;
      let userEmail = '';
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const sb = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { session } } = await sb.auth.getSession();
        userId = session?.user?.id || null;
        userEmail = session?.user?.email || '';
      } catch {}

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan.id,
          monto: plan.precio,
          titulo: plan.nombre,
          user_id: userId,
          email: userEmail,
        })
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Error al procesar el pago');
        setLoadingPlan(null);
      }
    } catch (error) {
      console.error(error);
      alert('Error al procesar el pago');
      setLoadingPlan(null);
    }
  };

  return (
    <section id="planes" className="relative py-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#050505]">
      {/* Fondo radial sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(201,168,76,0.03),transparent)]" />

      {/* Línea decorativa top */}
      <div className="gold-line mb-0 absolute top-0 inset-x-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="chip mb-4 w-fit">PLANES DE PREVENTA</div>
            <h2 className="section-title">
              ELIGE TU<br />
              <span className="shimmer-gold">PLAN</span>
            </h2>
          </div>
          <p className="font-body text-[#555] text-sm max-w-xs leading-relaxed md:text-right">
            Precios especiales de lanzamiento.<br />
            <span className="text-[#707070]">Renovables hasta 4 veces.</span>
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5">
          {planes.map((plan, i) => (
            <motion.div
              key={plan.id}
              id={`plan-${plan.id}`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col group bg-gradient-to-b ${plan.color} border transition-all duration-500 ${
                plan.destacado
                  ? 'border-[#C9A84C] z-10 shadow-[0_0_60px_rgba(201,168,76,0.15)]'
                  : 'border-white/5 hover:border-[rgba(201,168,76,0.2)]'
              } ${plan.destacado ? '-mx-0.5 -my-2' : ''}`}
            >
              {/* Badge MEJOR VALOR */}
              {plan.destacado && (
                <div className="absolute -top-0 inset-x-0 bg-[#C9A84C] text-black font-heading font-black text-[9px] tracking-[0.2em] text-center py-2 flex items-center justify-center gap-1.5">
                  <Star size={9} fill="black" /> MEJOR VALOR
                </div>
              )}

              <div className={`flex flex-col flex-1 p-7 ${plan.destacado ? 'pt-12' : ''}`}>
                {/* Número de meses */}
                <div className="font-display text-6xl text-white/5 leading-none mb-2 select-none">
                  {plan.meses < 10 ? `0${plan.meses}` : plan.meses}
                </div>

                {/* Nombre */}
                <div className="font-heading font-black text-xs tracking-[0.25em] text-[#555] uppercase mb-1">
                  PREVENTA 1
                </div>
                <div className={`font-display text-3xl tracking-wider mb-5 ${plan.destacado ? 'shimmer-gold' : 'text-white'}`}>
                  {plan.nombre}
                </div>

                {/* Precio */}
                <div className="mb-7">
                  <div className={`font-display leading-none ${plan.destacado ? 'text-fire' : 'text-white'}`}
                    style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
                    {fmt(plan.precio)}
                  </div>
                  <div className="font-body text-[#444] text-xs mt-1">pesos chilenos</div>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.destacado ? 'bg-[rgba(201,168,76,0.2)] border border-[#C9A84C]/40' : 'bg-white/5 border border-white/10'
                      }`}>
                        <Check size={9} className={plan.destacado ? 'text-[#C9A84C]' : 'text-[#555]'} />
                      </div>
                      <span className="font-body text-xs text-[#666] leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  id={`btn-${plan.id}`}
                  disabled={agotado || loadingPlan === plan.id}
                  onClick={() => handleCheckout(plan)}
                  className={`w-full font-heading font-black text-[11px] tracking-[0.2em] uppercase py-4 transition-all duration-300 border ${
                    agotado
                      ? 'bg-transparent border-white/5 text-[#333] cursor-not-allowed'
                      : loadingPlan === plan.id
                      ? 'bg-transparent border-white/5 text-[#888] cursor-wait'
                      : plan.destacado
                      ? 'btn-gold border-transparent'
                      : 'bg-transparent border-white/10 text-white hover:border-[#C9A84C] hover:text-[#C9A84C] group-hover:border-[#C9A84C]'
                  }`}
                >
                  {agotado ? 'AGOTADO' : loadingPlan === plan.id ? 'PROCESANDO...' : 'ELEGIR PLAN →'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Barra de cupos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-1 border border-white/5 bg-[#0E0E0E] p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-[rgba(201,168,76,0.3)] flex items-center justify-center">
              <Lock size={16} className="text-[#C9A84C]" />
            </div>
            <div>
              <div className="font-heading font-black text-white text-xs tracking-widest uppercase">CUPOS LIMITADOS</div>
              <div className="font-body text-[#444] text-[11px] mt-0.5">Solo 50 preventas en esta etapa.</div>
            </div>
          </div>

          <div className="flex-1 min-w-0 max-w-lg">
            <div className="flex justify-between mb-2 font-heading text-[10px] tracking-widest uppercase">
              <span className="text-[#444]">0 vendidos</span>
              <span className="text-[#C9A84C]">QUEDAN {cuposDisponibles} CUPOS</span>
              <span className="text-[#444]">{totalCupos} total</span>
            </div>
            <div className="h-1.5 bg-[#1A1A1A] overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8B6914] via-[#C9A84C] to-[#F5C842]"
                initial={{ width: '0%' }}
                whileInView={{ width: `${porcentaje || 2}%` }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
