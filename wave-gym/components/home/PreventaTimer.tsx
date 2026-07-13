'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { calcTimeLeft, type TimeLeft } from '@/lib/preventa';
import { useLang } from '@/lib/i18n/LangContext';

const DEADLINE = new Date('2026-07-31T23:59:59-04:00').getTime();

function calc(): TimeLeft {
  return calcTimeLeft(DEADLINE, Date.now());
}

function Unit({ value, label }: { value: number; label: string }) {
  const v = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-center w-full h-[52px] md:h-[60px] bg-ink-800 border border-accent-line rounded-md">
        <span className="font-display text-3xl md:text-4xl text-white leading-none tabular-nums">
          {v}
        </span>
      </div>
      <span className="font-heading text-chalk-faint text-[9px] md:text-[10px] tracking-[0.2em] uppercase mt-2">
        {label}
      </span>
    </div>
  );
}

export default function PreventaTimer({ className = '' }: { className?: string }) {
  const { d } = useLang();
  const [t, setT] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!t) return <div className={`h-[92px] ${className}`} aria-hidden />;

  if (t.done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col gap-2 ${className}`}
        role="status"
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="label-accent text-[10px]">{d.timer.finishedBadge}</span>
        </div>
        <p className="font-heading text-white text-lg md:text-xl tracking-wide leading-tight">
          {d.timer.finishedTitle}
        </p>
        <p className="font-body text-chalk-muted text-xs leading-relaxed max-w-xs">
          {d.timer.finishedDesc}
        </p>
      </motion.div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Clock size={13} className="text-accent" />
        <span className="label-accent text-[10px]">{d.timer.title}</span>
      </div>
      <div
        className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-start gap-x-1.5 md:gap-x-2"
        role="timer"
        aria-label={`${t.d} ${d.timer.days}, ${t.h} ${d.timer.hours}, ${t.m} ${d.timer.min}, ${t.s} ${d.timer.sec}`}
      >
        <Unit value={t.d} label={d.timer.days} />
        <span className="font-display text-2xl md:text-3xl text-chalk-faint leading-none flex items-center justify-center h-[52px] md:h-[60px]">:</span>
        <Unit value={t.h} label={d.timer.hours} />
        <span className="font-display text-2xl md:text-3xl text-chalk-faint leading-none flex items-center justify-center h-[52px] md:h-[60px]">:</span>
        <Unit value={t.m} label={d.timer.min} />
        <span className="font-display text-2xl md:text-3xl text-chalk-faint leading-none flex items-center justify-center h-[52px] md:h-[60px]">:</span>
        <Unit value={t.s} label={d.timer.sec} />
      </div>
    </div>
  );
}
