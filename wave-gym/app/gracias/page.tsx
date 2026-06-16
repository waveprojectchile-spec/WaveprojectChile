import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { CheckCircle, Phone } from 'lucide-react'

export default function GraciasPage() {
  return (
    <div className="bg-[#050505] min-h-screen flex flex-col selection:bg-[#FFD600] selection:text-black">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,214,0,0.05),transparent)] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center max-w-xl">

          {/* Ícono */}
          <div className="w-24 h-24 bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center mb-8">
            <CheckCircle size={48} className="text-[#FFD600]" />
          </div>

          {/* Título */}
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-widest text-white mb-6">
            ¡GRACIAS POR<br /><span style={{ color: '#FFD600' }}>TU COMPRA</span>!
          </h1>

          {/* Mensaje principal */}
          <div className="bg-[#0A0A0A] border border-white/10 p-8 mb-8 max-w-md w-full">
            <div className="flex items-center gap-3 justify-center mb-4">
              <Phone size={18} className="text-[#FFD600]" />
              <p className="text-[#FFD600] font-black text-xs tracking-[0.2em] uppercase">Próximo Paso</p>
            </div>
            <p className="text-white text-base leading-relaxed font-medium">
              Nuestro equipo se comunicará contigo a la brevedad para coordinar el inicio de tu membresía.
            </p>
            <p className="text-white/30 text-xs mt-4 leading-relaxed">
              Si tienes alguna consulta urgente, no dudes en contactarnos directamente.
            </p>
          </div>

          {/* Info adicional */}
          <p className="text-white/20 text-xs mb-10 tracking-wide">
            Revisa tu correo — recibirás el comprobante de pago de MercadoPago.
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/mi-cuenta"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 font-black text-xs tracking-[0.2em] uppercase text-black"
              style={{ background: 'linear-gradient(120deg, #C9A84C 0%, #FFD600 50%, #C9A84C 100%)' }}
            >
              VER MI CUENTA
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 font-black text-xs tracking-[0.2em] uppercase text-white/50 border border-white/10 hover:border-[#FFD600]/30 hover:text-white transition-all"
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
