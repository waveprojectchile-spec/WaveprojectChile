import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,214,0,0.05),transparent)]" />
      <div className="relative z-10 flex flex-col items-center max-w-lg">
        {/* Logo */}
        <div className="text-[#FFD600] font-black text-xl tracking-[0.3em] mb-10 uppercase">WAVE PROJECT GYM</div>

        <div className="w-20 h-20 bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center mb-8">
          <CheckCircle size={40} className="text-[#FFD600]" />
        </div>

        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-widest text-white mb-4">
          ¡CUPO<br /><span style={{ color: '#FFD600' }}>ASEGURADO</span>!
        </h1>

        <p className="text-white/40 text-sm leading-relaxed mb-4">
          Tu pago fue procesado exitosamente.<br />
          Pronto recibirás más información sobre la apertura oficial de Wave Project Gym.
        </p>
        <p className="text-white/20 text-xs mb-12">Revisa tu email para el comprobante de pago.</p>

        <Link href="/"
          className="inline-flex items-center justify-center gap-2 px-10 py-4 font-black text-xs tracking-[0.2em] uppercase text-black"
          style={{ background: 'linear-gradient(120deg, #C9A84C 0%, #FFD600 50%, #C9A84C 100%)' }}
        >
          VOLVER AL INICIO
        </Link>
      </div>
    </div>
  )
}
