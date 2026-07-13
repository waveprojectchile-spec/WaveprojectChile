'use client';
import Image from 'next/image';
import { Instagram, Facebook, Phone, Mail, MapPin, ShoppingCart } from 'lucide-react';
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
              <a href="https://wa.me/56942379197" id="footer-wa" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-white/10 flex items-center justify-center text-chalk-faint hover:text-accent hover:border-accent/30 transition-all duration-200">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-black text-chalk-faint text-[9px] tracking-[0.3em] uppercase mb-1">{d.footer.contact}</h4>
            {[
              { icon: Phone, text: '+569 942 379 197', href: 'tel:+56942379197' },
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
