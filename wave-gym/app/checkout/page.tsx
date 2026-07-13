'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion, AnimatePresence } from 'framer-motion'

const REGIONES = ['Arica y Parinacota','Tarapacá','Antofagasta','Atacama','Coquimbo','Valparaíso','Metropolitana','O\'Higgins','Maule','Ñuble','Biobío','La Araucanía','Los Ríos','Los Lagos','Aysén','Magallanes']

const PLANES = [
  { id: 'mensual', nombre: 'MENSUAL', precio: 35990 },
  { id: 'trimestral', nombre: 'TRIMESTRAL', precio: 107970 },
  { id: 'semestral', nombre: 'SEMESTRAL', precio: 215940 },
  { id: 'anual', nombre: 'ANUAL', precio: 431880 }
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
  
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [edad, setEdad] = useState<number | ''>('')
  const [medicos, setMedicos] = useState({ enfermedades: false, operaciones: false, medicamentos: false, lesiones: false })

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const plan = searchParams.get('plan');
    if (plan && PLANES.find(p => p.id === plan)) {
      setPlanSeleccionado(plan);
    }
  }, []);

  useEffect(() => {
    if (!fechaNacimiento) { setEdad(''); return }
    const birth = new Date(fechaNacimiento)
    const hoy = new Date()
    let age = hoy.getFullYear() - birth.getFullYear()
    if (hoy.getMonth() < birth.getMonth() || (hoy.getMonth() === birth.getMonth() && hoy.getDate() < birth.getDate())) age--
    setEdad(age >= 0 ? age : '')
  }, [fechaNacimiento])

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
        plan: planId,
        monto: planInfo.precio,
        titulo: planInfo.nombre,
        nombre: formData.get('nombre'),
        rut,
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        fecha_nacimiento: formData.get('fecha_nacimiento'),
        direccion: formData.get('direccion'),
        ciudad: formData.get('ciudad'),
        region: formData.get('region'),
        contacto_emergencia_nombre: formData.get('contacto_emergencia_nombre'),
        contacto_emergencia_telefono: formData.get('contacto_emergencia_telefono'),
        contacto_emergencia_relacion: formData.get('contacto_emergencia_relacion'),
        enfermedades: medicos.enfermedades ? formData.get('enfermedades') : '',
        operaciones: medicos.operaciones ? formData.get('operaciones') : '',
        medicamentos: medicos.medicamentos ? formData.get('medicamentos') : '',
        lesiones: medicos.lesiones ? formData.get('lesiones') : '',
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

  const inputClass = "w-full bg-black border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-accent/50 transition-colors"
  const labelClass = "block text-[10px] font-black tracking-[0.2em] text-white/30 uppercase mb-1.5"

  return (
    <div className="bg-[#050505] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black uppercase tracking-widest text-white mb-3">CHECKOUT</h1>
            <p className="text-white/30 text-xs tracking-widest uppercase">Completa tus datos para proceder al pago</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-10">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 text-xs font-bold tracking-widest uppercase text-center">{error}</div>}

            {/* DATOS PERSONALES */}
            <div className="bg-black border border-white/5 p-8">
              <h2 className="text-sm font-black tracking-[0.2em] text-white uppercase border-b border-white/10 pb-4 mb-6">TUS DATOS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
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
                
                <div>
                  <label className={labelClass}>FECHA DE NACIMIENTO {edad !== '' && <span className="text-accent ml-2">{edad} años</span>}</label>
                  <input name="fecha_nacimiento" type="date" required value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)} className={inputClass} />
                </div>
                <div><label className={labelClass}>DIRECCIÓN</label><input name="direccion" type="text" placeholder="Calle y número" required className={inputClass} /></div>
                <div><label className={labelClass}>CIUDAD</label><input name="ciudad" type="text" placeholder="Concón" required className={inputClass} /></div>
                <div>
                  <label className={labelClass}>REGIÓN</label>
                  <select name="region" required className={inputClass}>
                    <option value="">Seleccionar...</option>
                    {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* CONTACTO DE EMERGENCIA */}
            <div className="bg-black border border-white/5 p-8">
              <h2 className="text-sm font-black tracking-[0.2em] text-white uppercase border-b border-white/10 pb-4 mb-6">CONTACTO DE EMERGENCIA</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2"><label className={labelClass}>NOMBRE DEL CONTACTO</label><input name="contacto_emergencia_nombre" type="text" placeholder="Ej: María López" required className={inputClass} /></div>
                <div><label className={labelClass}>TELÉFONO DEL CONTACTO</label><input name="contacto_emergencia_telefono" type="tel" placeholder="+56 9 8765 4321" required className={inputClass} /></div>
                <div><label className={labelClass}>RELACIÓN / PARENTESCO</label><input name="contacto_emergencia_relacion" type="text" placeholder="Ej: Madre, Pareja, etc." required className={inputClass} /></div>
              </div>
            </div>

            {/* DATOS MÉDICOS */}
            <div className="bg-black border border-white/5 p-8">
              <div className="border-b border-white/10 pb-4 mb-6">
                <h2 className="text-sm font-black tracking-[0.2em] text-white uppercase">ANTECEDENTES MÉDICOS</h2>
                <p className="text-white/20 text-[10px] tracking-wider mt-1">OPCIONAL — Información confidencial solo para el equipo Wave Project</p>
              </div>
              <div className="space-y-4">
                {([
                  { key: 'enfermedades', label: 'Tengo enfermedades crónicas', placeholder: 'Describe tus enfermedades...' },
                  { key: 'operaciones', label: 'He tenido operaciones o cirugías', placeholder: 'Describe tus operaciones...' },
                  { key: 'medicamentos', label: 'Tomo medicamentos actualmente', placeholder: '¿Cuáles medicamentos?' },
                  { key: 'lesiones', label: 'Tengo lesiones activas', placeholder: 'Describe tus lesiones...' },
                ] as const).map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 transition-all ${medicos[key] ? 'bg-accent border-accent' : 'bg-black border-white/20 hover:border-accent/50'}`}
                        onClick={() => setMedicos(m => ({ ...m, [key]: !m[key] }))}>
                        {medicos[key] && <span className="text-black text-xs font-black">✓</span>}
                      </div>
                      <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{label}</span>
                    </label>
                    <AnimatePresence>
                      {medicos[key] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <textarea name={key} placeholder={placeholder} rows={3}
                            className="w-full mt-3 ml-8 bg-black border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-accent/50 resize-none" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isPending}
              className="w-full py-4 bg-accent text-black font-black text-sm tracking-[0.2em] uppercase hover:bg-accent/90 transition-colors disabled:opacity-50">
              {isPending ? 'PROCESANDO...' : 'IR A PAGAR →'}
            </button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
