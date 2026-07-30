'use client';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

export default function PreventaTimer({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col gap-3 ${className}`}
    >
      <div className="flex items-center gap-2">
        <XCircle size={13} className="text-accent" />
        <span className="label-accent text-[10px] tracking-[0.2em]">PREVENTAS CERRADAS</span>
      </div>
      <div className="border border-white/10 bg-ink-800 px-5 py-4 flex flex-col gap-1">
        <div className="font-display text-2xl text-white tracking-wider">SOLD OUT</div>
        <div className="font-heading text-[10px] tracking-[0.2em] text-chalk-muted uppercase">
          Preventa 1 &amp; Preventa 2 agotadas
        </div>
      </div>
      <p className="font-body text-chalk-faint text-[11px] leading-relaxed">
        Seguinos en Instagram para enterarte de la próxima etapa.
      </p>
    </motion.div>
  );
}

