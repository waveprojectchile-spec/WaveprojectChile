import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Fondo radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(201,168,76,0.05),transparent)]" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-[rgba(201,168,76,0.1)] rounded-full flex items-center justify-center mb-8 border border-[rgba(201,168,76,0.3)]">
          <CheckCircle size={40} className="text-[#C9A84C]" />
        </div>
        
        <h1 className="font-display text-4xl md:text-5xl text-white mb-4 tracking-wider">
          ¡CUPO <span className="shimmer-gold">ASEGURADO</span>!
        </h1>
        
        <p className="font-body text-[#888] max-w-md mx-auto mb-12 text-lg leading-relaxed">
          Tu pago fue procesado exitosamente. Bienvenido a la comunidad de Wave Project Gym.
        </p>
        
        <Link 
          href="/"
          className="btn-gold px-8 py-4 font-heading font-black text-[11px] tracking-[0.2em] uppercase transition-all duration-300 border border-transparent inline-flex items-center justify-center min-w-[200px]"
        >
          VOLVER AL INICIO
        </Link>
      </div>
    </div>
  );
}
