'use client';
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Menu, X, ShoppingCart, ChevronDown, Globe, MapPin } from 'lucide-react';

/* ─────────────────────────────────────────
   TIPOS DE IDIOMA
───────────────────────────────────────── */
export type Lang = 'ES' | 'EN' | 'PT';

const LANGS = [
  { code: 'ES' as Lang, label: 'Español',   flag: '🇨🇱', short: 'ES' },
  { code: 'EN' as Lang, label: 'English',   flag: '🇺🇸', short: 'EN' },
  { code: 'PT' as Lang, label: 'Português', flag: '🇧🇷', short: 'PT' },
];

const NAV_CONTENT: Record<Lang, { links: { label: string; href: string }[]; cta: string; pretitle: string }> = {
  ES: {
    pretitle: '1ª PREVENTA OFICIAL',
    cta: 'COMPRAR PREVENTA',
    links: [
      { label: 'INICIO',      href: '#inicio' },
      { label: 'PLANES',      href: '#planes' },
      { label: 'BENEFICIOS',  href: '#beneficios' },
      { label: 'FAQ',         href: '#faq' },
      { label: 'CONTACTO',    href: '#contacto' },
    ],
  },
  EN: {
    pretitle: '1st OFFICIAL PRE-SALE',
    cta: 'BUY PRE-SALE',
    links: [
      { label: 'HOME',      href: '#inicio' },
      { label: 'PLANS',     href: '#planes' },
      { label: 'BENEFITS',  href: '#beneficios' },
      { label: 'FAQ',       href: '#faq' },
      { label: 'CONTACT',   href: '#contacto' },
    ],
  },
  PT: {
    pretitle: '1ª PRÉ-VENDA OFICIAL',
    cta: 'COMPRAR PRÉ-VENDA',
    links: [
      { label: 'INÍCIO',    href: '#inicio' },
      { label: 'PLANOS',    href: '#planes' },
      { label: 'BENEFÍCIOS',href: '#beneficios' },
      { label: 'FAQ',       href: '#faq' },
      { label: 'CONTATO',   href: '#contacto' },
    ],
  },
};

/* ─────────────────────────────────────────
   SELECTOR DE IDIOMA
───────────────────────────────────────── */
function LangSelector({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find(l => l.code === lang)!;

  // Cerrar al hacer click afuera
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} className="relative select-none" id="lang-selector">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 px-3 py-2 rounded border border-white/10 bg-white/3 hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/5 transition-all duration-200 cursor-pointer"
      >
        <Globe size={12} className="text-[#C9A84C]" />
        <span className="text-white text-[11px] font-semibold tracking-widest"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {current.short}
        </span>
        <ChevronDown size={10} className={`text-[#777] transition-transform duration-200 ${open ? '-rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="listbox"
            className="absolute right-0 top-[calc(100%+6px)] z-[100] w-44 rounded overflow-hidden border border-white/10 bg-[#0C0C0C] shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          >
            {LANGS.map(l => {
              const active = lang === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  role="option"
                  aria-selected={active}
                  id={`lang-opt-${l.code.toLowerCase()}`}
                  onClick={() => { setLang(l.code); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 ${
                    active
                      ? 'bg-[#C9A84C]/10 text-[#C9A84C]'
                      : 'text-[#888] hover:bg-white/4 hover:text-white'
                  }`}
                >
                  <span className="text-lg leading-none">{l.flag}</span>
                  <span className="flex-1 text-left"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em' }}>
                    {l.label}
                  </span>
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />}
                </button>
              );
            })}
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
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('ES');
  const [activeHref, setActiveHref] = useState('');

  const content = NAV_CONTENT[lang];

  /* Scroll listener */
  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 40);
      // Detectar sección activa
      const sections = content.links.map(l => ({ href: l.href, el: document.querySelector(l.href) }));
      let active = '';
      for (const { href, el } of sections) {
        if (el) {
          const { top } = el.getBoundingClientRect();
          if (top <= 100) active = href;
        }
      }
      setActiveHref(active);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [content.links]);

  /* Bloquear scroll body cuando drawer está abierto */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const BC = "'Barlow Condensed', sans-serif";

  return (
    <>
      {/* ══════════════════════════════════════
          TOPBAR — info contextual (se oculta al scroll)
      ══════════════════════════════════════ */}
      <div
        className="fixed inset-x-0 top-0 z-[60] transition-all duration-500 overflow-hidden"
        style={{ height: scrolled ? 0 : '32px', opacity: scrolled ? 0 : 1 }}
      >
        <div className="h-8 bg-[#030303] border-b border-white/[0.04] flex items-center justify-between px-5 md:px-10">
          <div className="flex items-center gap-1.5 text-[#3A3A3A]">
            <MapPin size={9} />
            <span style={{ fontFamily: BC, fontWeight: 600, fontSize: '10px', letterSpacing: '0.15em' }}>
              CALLE 6 235, CONCÓN, CHILE
            </span>
          </div>
          <div className="hidden md:flex items-center gap-5">
            <a href="https://www.instagram.com/waveprojectgym" target="_blank" rel="noopener noreferrer"
               className="text-[#3A3A3A] hover:text-[#C9A84C] transition-colors duration-200"
               style={{ fontFamily: BC, fontWeight: 600, fontSize: '10px', letterSpacing: '0.15em' }}>
              @WAVEPROJECTGYM
            </a>
            <div className="w-px h-3 bg-white/[0.06]" />
            <span className="text-[#C9A84C] flex items-center gap-1.5"
                  style={{ fontFamily: BC, fontWeight: 700, fontSize: '10px', letterSpacing: '0.15em' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
              50 CUPOS · PREVENTA 2025
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          NAVBAR PRINCIPAL
      ══════════════════════════════════════ */}
      <header
        id="navbar"
        className="fixed inset-x-0 z-50 transition-all duration-500"
        style={{ top: scrolled ? 0 : '32px' }}
      >
        <div className={`transition-all duration-500 border-b ${
          scrolled
            ? 'bg-[#050505]/96 backdrop-blur-xl border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
            : 'bg-transparent border-transparent'
        }`}>
          <div className="max-w-[1440px] mx-auto flex items-center justify-between px-5 md:px-8 lg:px-12 h-[70px]">

            {/* LOGO */}
            <a href="#inicio" id="nav-logo" className="flex items-center group flex-shrink-0">
              <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/LOGO PNG.png"
                  alt="Wave Project Gym"
                  width={65}
                  height={65}
                  className="object-contain relative z-10"
                  priority
                />
              </div>
            </a>

            {/* NAV LINKS — solo desktop */}
            <nav className="hidden lg:flex items-stretch h-full">
              {content.links.map(link => {
                const isActive = activeHref === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="relative flex items-center px-5 h-[70px] transition-colors duration-200 group"
                    style={{
                      fontFamily: BC,
                      fontWeight: 700,
                      fontSize: '12px',
                      letterSpacing: '0.2em',
                      color: isActive ? '#C9A84C' : '#888',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.target as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={e => { if (!isActive) (e.target as HTMLElement).style.color = '#888'; }}
                  >
                    {link.label}
                    {/* Barra activa */}
                    <span
                      className="absolute bottom-0 left-5 right-5 h-[2px] bg-[#C9A84C] transition-all duration-300 origin-left"
                      style={{
                        transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                        opacity: isActive ? 1 : 0,
                      }}
                    />
                    {/* Hover hint */}
                    <span
                      className="absolute bottom-0 left-5 right-5 h-[1px] bg-white/10 transition-all duration-300 origin-left group-hover:scale-x-100"
                      style={{ transform: isActive ? 'scaleX(0)' : undefined }}
                    />
                  </a>
                );
              })}
            </nav>

            {/* DERECHA: idioma + CTA + hamburger */}
            <div className="flex items-center gap-3">

              {/* Selector idioma desktop */}
              <div className="hidden md:block">
                <LangSelector lang={lang} setLang={setLang} />
              </div>

              <div className="hidden md:block w-px h-5 bg-white/[0.06]" />

              {/* CTA Comprar */}
              <a
                href="#planes"
                id="nav-cta"
                className="hidden md:flex items-center gap-2 relative overflow-hidden group"
                style={{
                  fontFamily: BC,
                  fontWeight: 800,
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  background: 'linear-gradient(120deg, #C9A84C 0%, #F5C842 50%, #C9A84C 100%)',
                  backgroundSize: '200% auto',
                  color: '#050505',
                  padding: '11px 22px',
                  transition: 'background-position 0.4s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundPosition = 'right center';
                  el.style.boxShadow = '0 0 30px rgba(201,168,76,0.4)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundPosition = 'left center';
                  el.style.boxShadow = 'none';
                }}
              >
                <ShoppingCart size={13} strokeWidth={2.5} />
                {content.cta}
              </a>

              {/* Hamburger — mobile */}
              <button
                id="nav-hamburger"
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Abrir menú"
                className="lg:hidden flex items-center justify-center w-9 h-9 border border-white/10 text-[#888] hover:text-white hover:border-[#C9A84C]/40 transition-all duration-200"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          DRAWER MOBILE
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 bottom-0 z-[80] w-72 bg-[#080808] border-l border-white/[0.06] flex flex-col"
            >
              {/* Header drawer */}
              <div className="flex items-center justify-between h-[70px] px-6 border-b border-white/[0.06]">
                <div className="flex items-center justify-center mt-2">
                  <Image
                    src="/LOGO PNG.png"
                    alt="Wave Project Gym"
                    width={70}
                    height={70}
                    className="object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="text-[#555] hover:text-white transition-colors p-1"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Links del drawer */}
              <nav className="flex-1 overflow-y-auto py-4">
                {content.links.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.04] transition-colors duration-150 hover:bg-white/[0.02]"
                  >
                    <span className="text-[#C9A84C]/25"
                          style={{ fontFamily: BC, fontWeight: 700, fontSize: '11px' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[#888] hover:text-white"
                          style={{ fontFamily: BC, fontWeight: 700, fontSize: '16px', letterSpacing: '0.18em' }}>
                      {link.label}
                    </span>
                    <span className="ml-auto text-[#2A2A2A]" style={{ fontFamily: BC }}>→</span>
                  </motion.a>
                ))}
              </nav>

              {/* Footer drawer */}
              <div className="p-6 border-t border-white/[0.06] flex flex-col gap-4">
                {/* Idioma mobile */}
                <div>
                  <p className="text-[#444] mb-3"
                     style={{ fontFamily: BC, fontWeight: 600, fontSize: '9px', letterSpacing: '0.3em' }}>
                    IDIOMA / LANGUAGE
                  </p>
                  <div className="flex gap-2">
                    {LANGS.map(l => (
                      <button
                        key={l.code}
                        type="button"
                        id={`mobile-lang-${l.code.toLowerCase()}`}
                        onClick={() => setLang(l.code)}
                        className="flex-1 flex flex-col items-center gap-1.5 py-2.5 border transition-all duration-200"
                        style={{
                          borderColor: lang === l.code ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.06)',
                          background: lang === l.code ? 'rgba(201,168,76,0.06)' : 'transparent',
                        }}
                      >
                        <span className="text-base leading-none">{l.flag}</span>
                        <span className={lang === l.code ? 'text-[#C9A84C]' : 'text-[#444]'}
                              style={{ fontFamily: BC, fontWeight: 700, fontSize: '9px', letterSpacing: '0.2em' }}>
                          {l.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA mobile */}
                <a
                  href="#planes"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-center gap-2 py-4 text-[#050505]"
                  style={{
                    fontFamily: BC,
                    fontWeight: 800,
                    fontSize: '12px',
                    letterSpacing: '0.18em',
                    background: 'linear-gradient(135deg, #C9A84C, #F5C842)',
                  }}
                >
                  <ShoppingCart size={14} strokeWidth={2.5} />
                  {content.cta}
                </a>

                <p className="text-center text-[#2A2A2A]"
                   style={{ fontFamily: BC, fontWeight: 600, fontSize: '9px', letterSpacing: '0.12em' }}>
                  CALLE 6 235, CONCÓN · CHILE
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
