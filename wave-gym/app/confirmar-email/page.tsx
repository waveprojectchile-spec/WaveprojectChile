import Link from 'next/link'

export default function ConfirmarEmailPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,214,0,0.04),transparent)] pointer-events-none" />
      <div className="relative z-10 max-w-md">
        {/* Ícono sobre SVG */}
        <div className="w-20 h-20 mx-auto mb-8 border border-[#FFD600]/30 bg-[#FFD600]/5 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFD600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-widest text-white mb-4">REVISA TU CORREO</h1>
        <p className="text-white/40 text-sm leading-relaxed mb-10">
          Te enviamos un enlace de confirmación a tu email.<br />
          Haz clic en el enlace para activar tu cuenta y luego podrás iniciar sesión.
        </p>
        <Link href="/" className="inline-block bg-[#FFD600] text-black px-8 py-4 font-black text-xs tracking-[0.2em] uppercase hover:bg-[#FFD600]/90 transition-colors">
          VOLVER AL INICIO
        </Link>
      </div>
    </div>
  )
}
