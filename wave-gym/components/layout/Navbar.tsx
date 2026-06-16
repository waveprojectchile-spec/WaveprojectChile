'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Menu, X, ShoppingCart, ChevronDown, Globe } from 'lucide-react';

/* ─────────────────────────────────────────
   LOGO — imagen real LOGO.PNG
   Invertida a blanco con CSS filter
───────────────────────────────────────── */
function WaveProjectLogo({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/LOGO.PNG"
      alt="Wave Project Gym Logo"
      width={size}
      height={size}
      className="object-contain"
      style={{ filter: 'invert(1) brightness(2)' }}
      priority
    />
  );
}

/* ─────────────────────────────────────────
   IDIOMAS
───────────────────────────────────────── */
type Lang = 'ES' | 'EN' | 'PT';

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'ES', label: 'Español',   flag: '🇨🇱' },
  { code: 'EN', label: 'English',   flag: '🇺🇸' },
  { code: 'PT', label: 'Português', flag: '🇧🇷' },
];

const NAV_LABELS: Record<Lang, { links: string[]; cta: string }> = {
  ES: { links: ['INICIO', 'PLANES', 'BENEFICIOS', 'FAQ', 'CONTACTO'], cta: 'COMPRAR PREVENTA' },
  EN: { links: ['HOME',   'PLANS',  'BENEFITS',   'FAQ', 'CONTACT'],  cta: 'BUY PRE-SALE' },
  PT: { links: ['INÍCIO', 'PLANOS', 'BENEFÍCIOS', 'FAQ', 'CONTATO'],  cta: 'COMPRAR PRÉ-VENDA' },
};

const NAV_HREFS = ['#inicio', '#planes', '#beneficios', '#faq', '#contacto'];

/* ─────────────────────────────────────────
   COMPONENTE SELECTOR DE IDIOMA
───────────────────────────────────────── */
function LangSelector({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find(l => l.code === lang)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative" id="lang-selector">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 h-8 px-3 border border-white/10 hover:border-[#C9A84C]/50 transition-all duration-200 group"
        aria-label="Seleccionar idioma"
      >
        <Globe size={11} className="text-[#555] group-hover:text-[#C9A84C] transition-colors" />
        <span className="font-barlow font-700 text-[11px] text-[#777] group-hover:text-white tracking-widest transition-colors">
          {current.code}
        </span>
        <ChevronDown
          size={10}
          className={`text-[#444] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-1 w-40 bg-[#0C0C0C] border border-white/8 z-50 shadow-2xl"
          >
            {LANGS.map(l => (
              <button
                key={l.code}
                id={`lang-${l.code.toLowerCase()}`}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 group ${
                  lang === l.code
                    ? 'bg-[rgba(201,168,76,0.08)] text-[#C9A84C]'
                    : 'text-[#555] hover:bg-white/3 hover:text-white'
                }`}
              >
                <span className="text-base leading-none">{l.flag}</span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-barlow font-bold text-[11px] tracking-widest uppercase leading-none">
                    {l.code}
                  </span>
                  <span className="font-body text-[9px] text-[#444] group-hover:text-[#666] leading-none">
                    {l.label}
                  </span>
                </div>
                {lang === l.code && (
                  <div className="ml-auto w-1 h-1 rounded-full bg-[#C9A84C]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   NAVBAR PRINCIPAL
───────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [lang, setLang]           = useState<Lang>('ES');
  const [activeSection, setActive] = useState('');

  const labels = NAV_LABELS[lang];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      // Detectar sección activa
      const sections = NAV_HREFS.map(h => document.querySelector(h));
      let current = '';
      sections.forEach((s, i) => {
        if (s) {
          const rect = s.getBoundingClientRect();
          if (rect.top <= 120) current = NAV_HREFS[i];
        }
      });
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ════════════════════════════════════
          BARRA SUPERIOR (pre-nav) — sutil
      ════════════════════════════════════ */}
      <div className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'
      }`}>
        <div className="border-b border-white/4 bg-[#030303]/80 backdrop-blur-sm flex items-center justify-between px-6 md:px-12 lg:px-16 h-8">
          <div className="flex items-center gap-4">
            <span className="font-barlow text-[10px] text-[#333] tracking-widest uppercase">
              🏋️ Calle 6 235, Concón, Chile
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/waveprojectgym" target="_blank" rel="noopener noreferrer"
               className="font-barlow text-[10px] text-[#333] hover:text-[#C9A84C] tracking-widest uppercase transition-colors">
              @waveprojectgym
            </a>
            <div className="w-px h-3 bg-[#222]" />
            <span className="font-barlow text-[10px] text-[#C9A84C] tracking-widest animate-pulse uppercase">
              ● 50 CUPOS · PREVENTA 2025
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
          NAVBAR PRINCIPAL
      ════════════════════════════════════ */}
      <nav
        id="navbar"
        className={`fixed inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'top-0' : 'top-8'
        } ${
          scrolled
            ? 'bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.8)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-5 md:px-10 lg:px-14 flex items-center justify-between h-16 md:h-[72px]">

          {/* ── LOGO ── */}
          <a href="#inicio" id="nav-logo" className="group flex items-center gap-3 flex-shrink-0">
            {/* Ícono SVG */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#C9A84C]/10 scale-0 group-hover:scale-150 transition-transform duration-500" />
              <WaveProjectLogo size={38} />
            </div>

            {/* Texto del logo */}
            <div className="flex flex-col leading-none">
              <span
                className="text-white font-barlow font-black tracking-wider group-hover:text-[#C9A84C] transition-colors duration-300"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '15px', letterSpacing: '0.12em' }}
              >
                WAVE PROJECT
              </span>
              <span
                className="text-[#555] tracking-[0.35em] group-hover:text-[#C9A84C]/60 transition-colors duration-300"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '8px', letterSpacing: '0.38em' }}
              >
                ─ GYM ─
              </span>
            </div>
          </a>

          {/* ── LINKS DESKTOP ── */}
          <ul className="hidden lg:flex items-center">
            {labels.links.map((label, i) => {
              const href = NAV_HREFS[i];
              const isActive = activeSection === href;
              return (
                <li key={href} className="relative group">
                  <a
                    href={href}
                    className={`relative flex items-center h-[72px] px-4 xl:px-5 transition-all duration-200 ${
                      isActive ? 'text-[#C9A84C]' : 'text-[#555] hover:text-white'
                    }`}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', letterSpacing: '0.18em' }}
                  >
                    {label}
                    {/* Underline indicator */}
                    <span className={`absolute bottom-0 left-4 xl:left-5 right-4 xl:right-5 h-[2px] bg-[#C9A84C] transition-all duration-300 ${
                      isActive ? 'opacity-100 scaleX-100' : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100'
                    }`} style={{ transformOrigin: 'left' }} />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* ── DERECHA: Lang + CTA ── */}
          <div className="flex items-center gap-3">
            {/* Selector de idioma */}
            <div className="hidden md:block">
              <LangSelector lang={lang} setLang={setLang} />
            </div>

            {/* Separador vertical */}
            <div className="hidden md:block w-px h-6 bg-white/8" />

            {/* CTA comprar */}
            <a
              href="#planes"
              id="nav-cta"
              className="hidden md:flex items-center gap-2 transition-all duration-300 relative overflow-hidden group"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: '11px',
                letterSpacing: '0.15em',
                background: 'linear-gradient(135deg, #C9A84C, #F5C842)',
                color: '#050505',
                padding: '10px 20px',
              }}
            >
              {/* Shine effect */}
              <span className="absolute inset-0 w-0 bg-white/20 group-hover:w-full transition-all duration-500 skew-x-12" />
              <ShoppingCart size={13} />
              <span className="relative">{labels.cta}</span>
            </a>

            {/* Mobile toggle */}
            <button
              id="nav-mobile-toggle"
              className="lg:hidden flex items-center justify-center w-9 h-9 border border-white/10 text-[#777] hover:text-white hover:border-[#C9A84C]/40 transition-all duration-200"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════
          DRAWER MOBILE
      ════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[280px] bg-[#060606] border-l border-white/5 flex flex-col"
            >
              {/* Header drawer */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <WaveProjectLogo size={26} />
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '13px', letterSpacing: '0.15em' }}
                        className="text-white">
                    WAVE PROJECT GYM
                  </span>
                </div>
                <button onClick={() => setMenuOpen(false)} className="text-[#555] hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col divide-y divide-white/4 flex-1 overflow-y-auto">
                {labels.links.map((label, i) => (
                  <motion.a
                    key={NAV_HREFS[i]}
                    href={NAV_HREFS[i]}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-4 px-6 py-5 text-[#666] hover:text-white hover:bg-white/2 transition-all duration-150 group"
                  >
                    <span className="text-[#C9A84C]/30 font-barlow text-xs font-bold"
                          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px', letterSpacing: '0.18em' }}>
                      {label}
                    </span>
                    <span className="ml-auto text-[#333] group-hover:text-[#C9A84C] text-xs">→</span>
                  </motion.a>
                ))}
              </nav>

              {/* Footer drawer: idioma + CTA */}
              <div className="border-t border-white/5 p-6 flex flex-col gap-4">
                {/* Idiomas en drawer */}
                <div>
                  <div className="font-barlow text-[#444] text-[9px] tracking-[0.3em] uppercase mb-3"
                       style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    IDIOMA
                  </div>
                  <div className="flex gap-2">
                    {LANGS.map(l => (
                      <button
                        key={l.code}
                        id={`mobile-lang-${l.code.toLowerCase()}`}
                        onClick={() => setLang(l.code)}
                        className={`flex-1 flex flex-col items-center gap-1 py-2 border transition-all duration-200 ${
                          lang === l.code
                            ? 'border-[#C9A84C]/50 bg-[rgba(201,168,76,0.08)] text-[#C9A84C]'
                            : 'border-white/8 text-[#444] hover:border-white/20'
                        }`}
                      >
                        <span className="text-sm">{l.flag}</span>
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '0.2em' }}>
                          {l.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <a
                  href="#planes"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-4 text-black font-bold"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: '12px',
                    letterSpacing: '0.15em',
                    background: 'linear-gradient(135deg, #C9A84C, #F5C842)',
                  }}
                >
                  <ShoppingCart size={14} />
                  {labels.cta}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
