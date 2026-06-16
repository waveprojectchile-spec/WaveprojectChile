'use client'
import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { registerAction } from '@/lib/actions/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

const REGIONES = ['Arica y Parinacota','Tarapacá','Antofagasta','Atacama','Coquimbo','Valparaíso','Metropolitana','O\'Higgins','Maule','Ñuble','Biobío','La Araucanía','Los Ríos','Los Lagos','Aysén','Magallanes']

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

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}
      className="w-full py-4 bg-[#FFD600] text-black font-black text-sm tracking-[0.2em] uppercase hover:bg-[#FFD600]/90 transition-colors disabled:opacity-50">
      {pending ? 'CREANDO CUENTA...' : 'CREAR CUENTA →'}
    </button>
  )
}

export default function RegistroPage() {
  const [error, setError] = useState<string | null>(null)
  const [rutError, setRutError] = useState<string | null>(null)
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [edad, setEdad] = useState<number | ''>('')
  const [showPassword, setShowPassword] = useState(false)
  const [medicos, setMedicos] = useState({ enfermedades: false, operaciones: false, medicamentos: false, lesiones: false })

  useEffect(() => {
    if (!fechaNacimiento) { setEdad(''); return }
    const birth = new Date(fechaNacimiento)
    const hoy = new Date()
    let age = hoy.getFullYear() - birth.getFullYear()
    if (hoy.getMonth() < birth.getMonth() || (hoy.getMonth() === birth.getMonth() && hoy.getDate() < birth.getDate())) age--
    setEdad(age >= 0 ? age : '')
  }, [fechaNacimiento])

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    const rut = formData.get('rut') as string
    if (!validarRut(rut)) { setRutError('RUT inválido. Verifica el dígito verificador.'); return }
    setRutError(null)
    const result = await registerAction(formData)
    if (result?.error) setError(result.error)
  }

  const inputClass = "w-full bg-black border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#FFD600]/50 transition-colors"
  const labelClass = "block text-[10px] font-black tracking-[0.2em] text-white/30 uppercase mb-1.5"

  return (
    <div className="bg-[#050505] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black uppercase tracking-widest text-white mb-3">REGISTRO</h1>
            <p className="text-white/30 text-xs tracking-widest uppercase">Únete a Wave Project Gym</p>
          </div>

          <form action={handleSubmit} className="space-y-10">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 text-xs font-bold tracking-widest uppercase text-center">{error}</div>}

            {/* DATOS PERSONALES */}
            <div className="bg-black border border-white/5 p-8">
              <h2 className="text-sm font-black tracking-[0.2em] text-white uppercase border-b border-white/10 pb-4 mb-6">DATOS PERSONALES</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className={labelClass}>NOMBRE COMPLETO</label><input name="nombre" type="text" placeholder="JUAN PÉREZ" required className={inputClass} /></div>
                <div>
                  <label className={labelClass}>RUT</label>
                  <input name="rut" type="text" placeholder="12.345.678-9" required className={`${inputClass} ${rutError ? 'border-red-500/50' : ''}`} />
                  {rutError && <p className="text-red-400 text-[10px] mt-1 tracking-wider">{rutError}</p>}
                </div>
                <div><label className={labelClass}>EMAIL</label><input name="email" type="email" placeholder="correo@ejemplo.com" required className={inputClass} /></div>
                <div>
                  <label className={labelClass}>CONTRASEÑA</label>
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder="MÍNIMO 8 CARACTERES" required minLength={8} className={inputClass} />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div><label className={labelClass}>TELÉFONO</label><input name="telefono" type="tel" placeholder="+56 9 1234 5678" required className={inputClass} /></div>
                <div>
                  <label className={labelClass}>FECHA DE NACIMIENTO {edad !== '' && <span className="text-[#FFD600] ml-2">{edad} años</span>}</label>
                  <input name="fecha_nacimiento" type="date" required value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)} className={inputClass} />
                  {edad !== '' && <input type="hidden" name="edad" value={edad} />}
                </div>
                <div>
                  <label className={labelClass}>PLAN DE INTERÉS</label>
                  <select name="plan" required className={inputClass}>
                    <option value="">Seleccionar...</option>
                    {['MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
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
                <div><label className={labelClass}>CÓDIGO POSTAL</label><input name="codigo_postal" type="text" placeholder="2510000" className={inputClass} /></div>
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
                      <div className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 transition-all ${medicos[key] ? 'bg-[#FFD600] border-[#FFD600]' : 'bg-black border-white/20 hover:border-[#FFD600]/50'}`}
                        onClick={() => setMedicos(m => ({ ...m, [key]: !m[key] }))}>
                        {medicos[key] && <span className="text-black text-xs font-black">✓</span>}
                      </div>
                      <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{label}</span>
                    </label>
                    <AnimatePresence>
                      {medicos[key] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <textarea name={key} placeholder={placeholder} rows={3}
                            className="w-full mt-3 ml-8 bg-black border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#FFD600]/50 resize-none" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            <SubmitButton />

            <div className="text-center">
              <span className="text-white/30 text-xs">¿Ya tienes cuenta? </span>
              <a href="/login" className="text-[#FFD600] text-xs font-bold hover:underline">INICIA SESIÓN</a>
            </div>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
