'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'

const PLANES = [
  { id: 'mensual', nombre: 'MENSUAL', precio: 32990 },
  { id: 'trimestral', nombre: 'TRIMESTRAL', precio: 98970 },
  { id: 'semestral', nombre: 'SEMESTRAL', precio: 197940 },
  { id: 'anual', nombre: 'ANUAL', precio: 395880 }
]

function validarRut(rut: string) {
  const clean = rut.replace(/\./g, '').replace('-', '')
  if (clean.length < 8) return false
  const body = clean.slice(0, -1)
  const dv = clean.slice(-1).toUpperCase()
  let sum = 0, mul = 2
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * mul
    mul = mul === 7 ? 2 : mul + 1
  }
  const expected = 11 - (sum % 11)
  const dvCalc = expected === 11 ? '0' : expected === 10 ? 'K' : String(expected)
  return dv === dvCalc
}

export default function CheckoutPage() {
  const [error, setError] = useState<string | null>(null)
  const [rutError, setRutError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [planSeleccionado, setPlanSeleccionado] = useState<string>('')

  useEffect(() => {
    // Si viene con un plan en la URL (?plan=mensual) lo pre-seleccionamos
    const searchParams = new URLSearchParams(window.location.search);
    const plan = searchParams.get('plan');
    if (plan && PLANES.find(p => p.id === plan)) {
      setPlanSeleccionado(plan);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    setError(null)
    
    const rut = formData.get('rut') as string
    if (!validarRut(rut)) { 
      setRutError('RUT inválido. Verifica el dígito verificador.')
      setIsPending(false)
      return 
    }
    setRutError(null)

    const planId = formData.get('plan') as string
    const planInfo = PLANES.find(p => p.id === planId)
    if (!planInfo) {
      setError('Plan seleccionado inválido.')
      setIsPending(false)
      return
    }

    try {
      const payload = {
        nombre: formData.get('nombre'),
        rut,
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        plan: planId,
        titulo: planInfo.nombre,
        monto: planInfo.precio
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        setError(data.error || 'Error al procesar el pago. Intenta de nuevo.');
        setIsPending(false);
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión. Intenta de nuevo.');
      setIsPending(false);
    }
  }

  const inputClass = "w-full bg-black border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#FFD600]/50 transition-colors"
  const labelClass = "block text-[10px] font-black tracking-[0.2em] text-white/30 uppercase mb-1.5"

  return (
    <div className="bg-[#050505] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black uppercase tracking-widest text-white mb-3">CHECKOUT</h1>
            <p className="text-white/30 text-xs tracking-widest uppercase">Completa tus datos para proceder al pago</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-10">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 text-xs font-bold tracking-widest uppercase text-center">{error}</div>}

            <div className="bg-black border border-white/5 p-8">
              <h2 className="text-sm font-black tracking-[0.2em] text-white uppercase border-b border-white/10 pb-4 mb-6">TUS DATOS</h2>
              <div className="flex flex-col gap-5">
                <div>
                  <label className={labelClass}>PLAN SELECCIONADO</label>
                  <select name="plan" required className={inputClass} value={planSeleccionado} onChange={(e) => setPlanSeleccionado(e.target.value)}>
                    <option value="">Selecciona un plan...</option>
                    {PLANES.map(p => <option key={p.id} value={p.id}>{p.nombre} - ${p.precio.toLocaleString('es-CL')}</option>)}
                  </select>
                </div>
                <div><label className={labelClass}>NOMBRE COMPLETO</label><input name="nombre" type="text" placeholder="JUAN PÉREZ" required className={inputClass} /></div>
                <div>
                  <label className={labelClass}>RUT</label>
                  <input name="rut" type="text" placeholder="12.345.678-9" required className={`${inputClass} ${rutError ? 'border-red-500/50' : ''}`} />
                  {rutError && <p className="text-red-400 text-[10px] mt-1 tracking-wider">{rutError}</p>}
                </div>
                <div><label className={labelClass}>EMAIL</label><input name="email" type="email" placeholder="correo@ejemplo.com" required className={inputClass} /></div>
                <div><label className={labelClass}>TELÉFONO</label><input name="telefono" type="tel" placeholder="+56 9 1234 5678" required className={inputClass} /></div>
              </div>
            </div>

            <button type="submit" disabled={isPending}
              className="w-full py-4 bg-[#FFD600] text-black font-black text-sm tracking-[0.2em] uppercase hover:bg-[#FFD600]/90 transition-colors disabled:opacity-50">
              {isPending ? 'PROCESANDO...' : 'IR A PAGAR →'}
            </button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
