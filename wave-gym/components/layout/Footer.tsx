'use client';
import Image from 'next/image';
import { Instagram, Facebook, Mail, MapPin, ShoppingCart } from 'lucide-react';
import { useLang } from '@/lib/i18n/LangContext';

export default function Footer() {
  const { d } = useLang();

  return (
    <footer id="contacto" className="relative bg-[#030303] border-t border-hair">
      <div className="accent-line absolute top-0 inset-x-0 opacity-50" />

      <div className="border-b border-white/5 py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="font-display text-white/10 text-[clamp(3rem,8vw,6rem)] leading-none mb-4 select-none">
              {d.footer.ctaBig}
            </div>
            <h3 className="font-display text-white text-3xl md:text-4xl tracking-wider leading-tight">
              {d.footer.ctaTitle1}<br />
              <span className="text-shimmer">{d.footer.ctaTitle2}</span>
            </h3>
          </div>
          <div className="flex flex-col gap-3 items-start md:items-end">
            <a href="#planes" id="footer-cta" className="btn-accent text-sm whitespace-nowrap">
              <ShoppingCart size={15} /> {d.footer.ctaBtn}
            </a>
            <span className="font-body text-chalk-faint text-xs">{d.footer.securePay}</span>
          </div>
        </div>
      </div>

      <div className="py-14 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 flex flex-col gap-5">
            <a href="#inicio" className="flex items-center gap-3 group w-fit" aria-label="Wave Project Gym — inicio">
              <Image src="/wave-icon-white.png" alt="Wave Project Gym" width={56} height={56}
                className="w-14 h-14 object-contain group-hover:scale-105 transition-transform duration-300" />
              <div>
                <div className="font-display text-white text-base tracking-[0.22em] leading-none">WAVE PROJECT</div>
                <div className="font-heading text-chalk-faint text-[9px] tracking-[0.5em] mt-1">GYM</div>
              </div>
            </a>
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-accent/60 text-2xl tracking-widest">{d.footer.words.mov}</span>
              <span className="font-display text-accent/60 text-2xl tracking-widest">{d.footer.words.disc}</span>
              <span className="font-display text-accent/60 text-2xl tracking-widest">{d.footer.words.prop}</span>
            </div>
            <div className="flex gap-2 mt-1">
              {[
                { icon: Instagram, href: 'https://www.instagram.com/waveprojectgym', id: 'footer-ig' },
                { icon: Facebook, href: '#', id: 'footer-fb' },
              ].map(({ icon: Icon, href, id }) => (
                <a key={id} href={href} id={id} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 border border-white/10 flex items-center justify-center text-chalk-faint hover:text-accent hover:border-accent/30 transition-all duration-200">
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-black text-chalk-faint text-[9px] tracking-[0.3em] uppercase mb-1">{d.footer.contact}</h4>
            {[
              { icon: Mail,  text: 'waveprojectchile@gmail.com', href: 'mailto:waveprojectchile@gmail.com' },
              { icon: MapPin, text: 'Calle 6 235, Concón, Chile' },
            ].map(({ icon: Icon, text, href }) => (
              <div key={text} className="flex items-start gap-3">
                <Icon size={14} className="text-accent mt-0.5 flex-shrink-0" strokeWidth={1.75} />
                {href ? (
                  <a href={href} className="font-body text-chalk-muted text-xs hover:text-white transition-colors">{text}</a>
                ) : (
                  <span className="font-body text-chalk-muted text-xs">{text}</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-black text-chalk-faint text-[9px] tracking-[0.3em] uppercase mb-1">{d.footer.site}</h4>
            {['#planes', '#beneficios', '#faq', '#contacto'].map(href => (
              <a key={href} href={href} className="font-heading text-chalk-muted text-xs hover:text-accent transition-colors uppercase tracking-wider">
                {href.replace('#', '')}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-hair mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-chalk-faint text-[10px] tracking-wider">{d.footer.rights}</p>
          <div className="flex gap-6">
            <a href="/terminos" className="font-body text-chalk-faint text-[10px] hover:text-accent transition-colors tracking-wider">
              {d.footer.terms.toUpperCase()}
            </a>
            <a href="/privacidad" className="font-body text-chalk-faint text-[10px] hover:text-accent transition-colors tracking-wider">
              {d.footer.privacy.toUpperCase()}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
