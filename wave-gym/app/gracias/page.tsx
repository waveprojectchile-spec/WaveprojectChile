import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, MapPin, Calendar, Phone } from 'lucide-react'

export default function GraciasPage() {
  return (
    <div className="bg-[#050505] min-h-screen flex flex-col selection:bg-[#FFD600] selection:text-black">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-24 relative overflow-hidden">

        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(255,214,0,0.06),transparent)] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD600]/20 to-transparent" />

        <div className="relative z-10 flex flex-col items-center max-w-2xl w-full text-center">

          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/wave-logo.png"
              alt="Wave Project Chile"
              width={180}
              height={80}
              className="object-contain mx-auto"
              priority
            />
          </div>

          {/* Ícono de éxito */}
          <div className="w-20 h-20 bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center mb-8 mx-auto">
            <CheckCircle size={40} className="text-[#FFD600]" />
          </div>

          {/* Bienvenida */}
          <p className="text-[#FFD600] text-xs font-black tracking-[0.3em] uppercase mb-3">
            ¡BIENVENIDO/A A
          </p>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white mb-2">
            WAVE PROJECT
          </h1>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-8" style={{ color: '#FFD600' }}>
            CHILE
          </h2>

          <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-md">
            ¡Gracias por ser parte de Wave Project Gym! Tu lugar en la preventa está asegurado.
            <br /><br />
            Nuestro equipo se pondrá en contacto contigo a la brevedad para coordinar los detalles. ¡Nos vemos pronto!
          </p>

          {/* Cards de info */}
          <div className="grid sm:grid-cols-2 gap-4 w-full mb-10">

            {/* Fecha apertura */}
            <div className="bg-[#0A0A0A] border border-[#FFD600]/20 p-6 flex flex-col items-center gap-3">
              <Calendar size={24} className="text-[#FFD600]" />
              <p className="text-[10px] font-black tracking-[0.25em] text-white/30 uppercase">Fecha de Apertura</p>
              <p className="text-2xl font-black text-white uppercase tracking-wider">11 de Julio</p>
              <p className="text-[#FFD600] text-xs font-bold tracking-widest">2025</p>
            </div>

            {/* Ubicación */}
            <div className="bg-[#0A0A0A] border border-[#FFD600]/20 p-6 flex flex-col items-center gap-3">
              <MapPin size={24} className="text-[#FFD600]" />
              <p className="text-[10px] font-black tracking-[0.25em] text-white/30 uppercase">Encuéntranos en</p>
              <p className="text-lg font-black text-white uppercase tracking-wider leading-tight">Calle 6 235</p>
              <p className="text-[#FFD600] text-xs font-bold tracking-widest">Concón, Valparaíso</p>
            </div>
          </div>

          {/* Mensaje contacto */}
          <div className="bg-[#0A0A0A] border border-white/5 p-6 w-full mb-10 flex items-center gap-4">
            <Phone size={20} className="text-[#FFD600] shrink-0" />
            <p className="text-white/40 text-sm text-left leading-relaxed">
              Revisa tu correo — recibirás el comprobante de pago de MercadoPago. Si tienes alguna consulta, nuestro equipo está disponible para ayudarte.
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 font-black text-xs tracking-[0.2em] uppercase text-black transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(120deg, #C9A84C 0%, #FFD600 50%, #C9A84C 100%)' }}
            >
              VOLVER AL INICIO
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
