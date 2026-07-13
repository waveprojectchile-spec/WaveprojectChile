'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, ChevronDown, Globe, MapPin } from 'lucide-react';
import { useLang } from '@/lib/i18n/LangContext';
import { LANGS } from '@/lib/i18n/dictionaries';

/* hrefs fijos — solo las labels vienen del dict */
const NAV_HREFS = ['#inicio', '#planes', '#beneficios', '#faq', '#contacto'] as const;

/* ─────────────────────────────────────────
   SELECTOR DE IDIOMA
───────────────────────────────────────── */
function LangSelector() {
  const { lang, setLang, d } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find(l => l.code === lang)!;

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
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 px-3 py-2 rounded border border-white/10 bg-white/[0.03] hover:border-accent/60 hover:bg-accent/5 transition-all duration-200 cursor-pointer"
      >
        <Globe size={12} className="text-accent" />
        <span className="text-white text-[11px] font-semibold tracking-widest"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {lang}
        </span>
        <ChevronDown size={10} className={`text-[#777] transition-transform duration-200 ${open ? '-rotate-180' : ''}`} />
      </button>

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
                    active ? 'bg-accent/10 text-accent' : 'text-chalk-muted hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <span className="text-lg leading-none">{l.flag}</span>
                  <span className="flex-1 text-left"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em' }}>
                    {l.label}
                  </span>
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
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
  const { d, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('');

  const navLinks = [
    { label: d.nav.home,     href: '#inicio' },
    { label: d.nav.plans,    href: '#planes' },
    { label: d.nav.benefits, href: '#beneficios' },
    { label: d.nav.faq,      href: '#faq' },
    { label: d.nav.contact,  href: '#contacto' },
  ];

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 40);
      let active = '';
      for (const { href } of navLinks) {
        const el = document.querySelector(href);
        if (el && el.getBoundingClientRect().top <= 100) active = href;
      }
      setActiveHref(active);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [lang]); // re-run when lang changes to rebind

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const BC = "'Barlow Condensed', sans-serif";

  return (
    <>
      {/* TOPBAR */}
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
               className="text-[#3A3A3A] hover:text-accent transition-colors duration-200"
               style={{ fontFamily: BC, fontWeight: 600, fontSize: '10px', letterSpacing: '0.15em' }}>
              @WAVEPROJECTGYM
            </a>
            <div className="w-px h-3 bg-white/[0.06]" />
            <span className="text-accent flex items-center gap-1.5"
                  style={{ fontFamily: BC, fontWeight: 700, fontSize: '10px', letterSpacing: '0.15em' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              50 {d.nav.pretitle.includes('PREVENTA') || d.nav.pretitle.includes('PRE') ? 'CUPOS ·' : 'SPOTS ·'} {d.nav.pretitle}
            </span>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
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
            <a href="#inicio" id="nav-logo" className="flex items-center gap-3 group flex-shrink-0" aria-label="Wave Project Gym — inicio">
              <Image
                src="/wave-icon-white.png"
                alt="Wave Project Gym"
                width={40}
                height={40}
                priority
                className="w-9 h-9 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <div className="flex flex-col leading-none">
                <span className="text-white" style={{ fontFamily: BC, fontWeight: 800, fontSize: '19px', letterSpacing: '0.14em' }}>
                  WAVE PROJECT
                </span>
                <span className="text-chalk-faint" style={{ fontFamily: BC, fontWeight: 600, fontSize: '10px', letterSpacing: '0.5em' }}>
                  GYM
                </span>
              </div>
            </a>

            {/* NAV LINKS desktop */}
            <nav className="hidden lg:flex items-stretch h-full">
              {navLinks.map(link => {
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
                      color: isActive ? 'rgb(var(--accent))' : '#B4B4B4',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.target as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={e => { if (!isActive) (e.target as HTMLElement).style.color = '#B4B4B4'; }}
                  >
                    {link.label}
                    <span
                      className="absolute bottom-0 left-5 right-5 h-[2px] bg-accent transition-all duration-300 origin-left"
                      style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0)', opacity: isActive ? 1 : 0 }}
                    />
                    <span
                      className="absolute bottom-0 left-5 right-5 h-[1px] bg-white/10 transition-all duration-300 origin-left group-hover:scale-x-100"
                      style={{ transform: isActive ? 'scaleX(0)' : undefined }}
                    />
                  </a>
                );
              })}
            </nav>

            {/* DERECHA */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <LangSelector />
              </div>
              <div className="hidden md:block w-px h-5 bg-white/[0.06]" />
              <div className="hidden md:flex items-center gap-4 mr-1">
                <a
                  href="/login?tab=admin"
                  className="text-chalk-faint hover:text-chalk-muted transition-colors"
                  style={{ fontFamily: BC, fontWeight: 700, fontSize: '10px', letterSpacing: '0.18em' }}
                >
                  STAFF
                </a>
              </div>
              <a
                href="#planes"
                id="nav-cta"
                className="hidden md:flex items-center gap-2 relative overflow-hidden group"
                style={{
                  fontFamily: BC, fontWeight: 800, fontSize: '11px', letterSpacing: '0.18em',
                  background: 'rgb(var(--accent))', color: '#050505',
                  padding: '11px 22px', borderRadius: '3px',
                  transition: 'transform 0.25s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-1px)';
                  el.style.boxShadow = '0 0 30px rgb(var(--accent)/0.4)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                <ShoppingCart size={13} strokeWidth={2.5} />
                {d.nav.cta}
              </a>
              <button
                id="nav-hamburger"
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Abrir menú"
                className="lg:hidden flex items-center justify-center w-9 h-9 border border-white/10 text-chalk-muted hover:text-white hover:border-accent/40 transition-all duration-200"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* DRAWER MOBILE */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 bottom-0 z-[80] w-72 bg-[#080808] border-l border-white/[0.06] flex flex-col"
            >
              <div className="flex items-center justify-between h-[70px] px-6 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <Image src="/wave-icon-white.png" alt="Wave Project Gym" width={32} height={32} className="w-8 h-8 object-contain" />
                  <span className="text-white" style={{ fontFamily: BC, fontWeight: 800, fontSize: '20px', letterSpacing: '0.12em' }}>
                    WAVE PROJECT
                  </span>
                </div>
                <button type="button" onClick={() => setDrawerOpen(false)} className="text-chalk-faint hover:text-white transition-colors p-1" aria-label="Cerrar">
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.04] transition-colors duration-150 hover:bg-white/[0.02]"
                  >
                    <span className="text-accent/25" style={{ fontFamily: BC, fontWeight: 700, fontSize: '11px' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-chalk-muted hover:text-white" style={{ fontFamily: BC, fontWeight: 700, fontSize: '16px', letterSpacing: '0.18em' }}>
                      {link.label}
                    </span>
                    <span className="ml-auto text-[#2A2A2A]" style={{ fontFamily: BC }}>→</span>
                  </motion.a>
                ))}
              </nav>

              <div className="p-6 border-t border-white/[0.06] flex flex-col gap-4">
                <div>
                  <p className="text-chalk-faint mb-3" style={{ fontFamily: BC, fontWeight: 600, fontSize: '9px', letterSpacing: '0.3em' }}>
                    {d.nav.langLabel}
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
                          borderColor: lang === l.code ? 'rgb(var(--accent)/0.5)' : 'rgba(255,255,255,0.06)',
                          background: lang === l.code ? 'rgb(var(--accent)/0.06)' : 'transparent',
                        }}
                      >
                        <span className="text-base leading-none">{l.flag}</span>
                        <span className={lang === l.code ? 'text-accent' : 'text-chalk-faint'}
                              style={{ fontFamily: BC, fontWeight: 700, fontSize: '9px', letterSpacing: '0.2em' }}>
                          {l.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <a
                  href="#planes"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-center gap-2 py-4 text-[#050505]"
                  style={{ fontFamily: BC, fontWeight: 800, fontSize: '12px', letterSpacing: '0.18em', background: 'rgb(var(--accent))', borderRadius: '3px' }}
                >
                  <ShoppingCart size={14} strokeWidth={2.5} />
                  {d.nav.cta}
                </a>
                <p className="text-center text-[#2A2A2A]" style={{ fontFamily: BC, fontWeight: 600, fontSize: '9px', letterSpacing: '0.12em' }}>
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
