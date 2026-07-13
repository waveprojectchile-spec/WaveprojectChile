'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PLAN_NOMBRES: Record<string, string> = {
  mensual: 'MENSUAL', trimestral: 'TRIMESTRAL', semestral: 'SEMESTRAL', anual: 'ANUAL',
};

function validarRut(rut: string) {
  const clean = rut.replace(/\./g, '').replace('-', '');
  if (clean.length < 8) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1).toUpperCase();
  let sum = 0, mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const expected = 11 - (sum % 11);
  const dvCalc = expected === 11 ? '0' : expected === 10 ? 'K' : String(expected);
  return dv === dvCalc;
}

type Estado = 'idle' | 'buscando' | 'encontrado' | 'no_encontrado';

interface Membresia {
  id: string;
  nombre: string;
  email: string;
  plan: string;
  monto: number;
  renovaciones_usadas: number;
  renovaciones_restantes: number;
  max_renovaciones: number;
  puede_renovar: boolean;
}

export default function RenovarPage() {
  const [rut, setRut] = useState('');
  const [rutError, setRutError] = useState('');
  const [estado, setEstado] = useState<Estado>('idle');
  const [pagando, setPagando] = useState(false);
  const [membresia, setMembresia] = useState<Membresia | null>(null);
  const [apiError, setApiError] = useState('');

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validarRut(rut)) { setRutError('RUT inválido'); return; }
    setRutError('');
    setEstado('buscando');
    try {
      const res = await fetch('/api/renovar/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut }),
      });
      const data = await res.json();
      if (!res.ok) { setApiError(data.error); setEstado('no_encontrado'); return; }
      setMembresia(data);
      setEstado('encontrado');
    } catch {
      setApiError('Error de conexión. Intenta de nuevo.');
      setEstado('no_encontrado');
    }
  };

  const pagar = async () => {
    if (!membresia) return;
    setPagando(true);
    try {
      const res = await fetch('/api/renovar/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId: membresia.id }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        setApiError(data.error || 'Error al iniciar el pago');
        setPagando(false);
      }
    } catch {
      setApiError('Error de conexión');
      setPagando(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="chip w-fit mx-auto mb-4">MIEMBROS WAVE PROJECT</div>
            <h1 className="font-display text-4xl md:text-5xl text-white tracking-wider mb-3">
              RENUEVA<br /><span className="text-shimmer">TU PLAN</span>
            </h1>
            <p className="font-body text-chalk-faint text-sm max-w-xs mx-auto">
              Ingresa tu RUT para renovar al mismo precio que pagaste en tu preventa.
            </p>
          </div>

          {/* Formulario búsqueda */}
          <form onSubmit={buscar} className="mb-8">
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={rut}
                  onChange={e => { setRut(e.target.value); setRutError(''); setEstado('idle'); setMembresia(null); }}
                  placeholder="12.345.678-9"
                  className={`w-full bg-black border px-4 py-3.5 text-white text-sm placeholder-white/20 outline-none focus:border-accent/50 transition-colors font-body ${
                    rutError ? 'border-red-500/50' : 'border-white/10'
                  }`}
                />
                {rutError && <p className="text-red-400 text-[10px] mt-1 tracking-wider">{rutError}</p>}
              </div>
              <button
                type="submit"
                disabled={estado === 'buscando'}
                className="btn-accent px-6 text-sm shrink-0"
              >
                {estado === 'buscando'
                  ? <RefreshCw size={16} className="animate-spin" />
                  : <><Search size={15} /> BUSCAR</>
                }
              </button>
            </div>
          </form>

          {/* Resultado */}
          <AnimatePresence mode="wait">
            {estado === 'no_encontrado' && (
              <motion.div
                key="no-encontrado"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="border border-red-500/20 bg-red-500/5 p-6 flex items-start gap-4"
              >
                <XCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-heading text-white text-xs tracking-widest uppercase mb-1">No encontrado</div>
                  <p className="font-body text-chalk-faint text-sm">{apiError || 'No encontramos una membresía activa con ese RUT.'}</p>
                </div>
              </motion.div>
            )}

            {estado === 'encontrado' && membresia && (
              <motion.div
                key="encontrado"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="border border-accent-line bg-ink-900"
              >
                {/* Header */}
                <div className="p-6 border-b border-hair flex items-center gap-4">
                  <CheckCircle size={20} className="text-accent shrink-0" />
                  <div>
                    <div className="font-heading text-white text-sm tracking-widest uppercase">{membresia.nombre}</div>
                    <div className="font-body text-chalk-faint text-xs mt-0.5">{membresia.email}</div>
                  </div>
                </div>

                {/* Detalles */}
                <div className="p-6 grid grid-cols-2 gap-4 border-b border-hair">
                  <div>
                    <div className="font-heading text-[9px] tracking-[0.2em] text-chalk-faint uppercase mb-1">Plan</div>
                    <div className="font-display text-white text-lg">{PLAN_NOMBRES[membresia.plan] || membresia.plan.toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="font-heading text-[9px] tracking-[0.2em] text-chalk-faint uppercase mb-1">Precio a pagar</div>
                    <div className="font-display text-accent text-lg">{fmt(membresia.monto)}</div>
                    <div className="font-body text-chalk-faint text-[10px] mt-0.5">Tu precio de preventa</div>
                  </div>
                  <div className="col-span-2">
                    <div className="font-heading text-[9px] tracking-[0.2em] text-chalk-faint uppercase mb-2">Renovaciones</div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        {Array.from({ length: membresia.max_renovaciones }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-3 h-3 rounded-full ${idx < membresia.renovaciones_usadas ? 'bg-white/15' : 'bg-accent'}`}
                          />
                        ))}
                      </div>
                      <span className="font-heading text-white text-xs">
                        {membresia.renovaciones_restantes} de {membresia.max_renovaciones} disponibles
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="p-6">
                  {apiError && (
                    <p className="text-red-400 text-xs mb-4 font-body">{apiError}</p>
                  )}
                  {membresia.puede_renovar ? (
                    <button
                      onClick={pagar}
                      disabled={pagando}
                      className="btn-accent w-full text-sm justify-center"
                    >
                      {pagando
                        ? <><RefreshCw size={14} className="animate-spin" /> Redirigiendo...</>
                        : <><RefreshCw size={14} /> RENOVAR POR {fmt(membresia.monto)}</>
                      }
                    </button>
                  ) : (
                    <div className="text-center py-3 border border-white/5 text-chalk-faint font-heading text-xs tracking-widest uppercase">
                      Has usado todas tus renovaciones disponibles
                    </div>
                  )}
                  <p className="text-center font-body text-chalk-faint text-[10px] mt-3">
                    Pago 100% seguro vía MercadoPago
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
