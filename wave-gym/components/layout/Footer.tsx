import { Instagram, Facebook } from 'lucide-react';

function WaveIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="47" stroke="white" strokeWidth="4"/>
      <path d="M15 58 C22 42 30 36 40 44 C50 52 58 46 68 30" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M15 68 C25 54 34 50 44 56 C54 62 62 58 72 44" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="contacto" className="relative bg-[#030303] border-t border-white/5">
      <div className="gold-line absolute top-0 inset-x-0 opacity-50" />

      {/* CTA grande antes del footer */}
      <div className="border-b border-white/5 py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="font-display text-white/10 text-[clamp(3rem,8vw,6rem)] leading-none mb-4 select-none">
              50 CUPOS
            </div>
            <h3 className="font-display text-white text-3xl md:text-4xl tracking-wider leading-tight">
              ASEGURA TU LUGAR<br />
              <span className="shimmer-gold">ANTES QUE SE AGOTEN</span>
            </h3>
          </div>
          <div className="flex flex-col gap-3 items-start md:items-end">
            <a href="#planes" id="footer-cta" className="btn-gold text-sm whitespace-nowrap">
              🛒 COMPRAR PREVENTA AHORA
            </a>
            <span className="font-body text-[#444] text-xs">Pago 100% seguro vía MercadoPago</span>
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div className="py-14 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo + slogan */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <a href="#inicio" className="flex items-center gap-3 group w-fit">
              <div className="group-hover:opacity-70 transition-opacity"><WaveIcon /></div>
              <div>
                <div className="font-display text-white text-sm tracking-[0.25em]">WAVE PROJECT</div>
                <div className="font-heading text-[#444] text-[8px] tracking-[0.4em]">─── GYM ───</div>
              </div>
            </a>
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-[#C9A84C]/60 text-2xl tracking-widest">MOVIMIENTO</span>
              <span className="font-display text-[#C9A84C]/60 text-2xl tracking-widest">DISCIPLINA</span>
              <span className="font-display text-[#C9A84C]/60 text-2xl tracking-widest">PROPÓSITO</span>
            </div>
            <div className="flex gap-2 mt-1">
              {[
                { icon: Instagram, href: 'https://www.instagram.com/waveprojectgym', id: 'footer-ig' },
                { icon: Facebook, href: '#', id: 'footer-fb' },
              ].map(({ icon: Icon, href, id }) => (
                <a
                  key={id}
                  href={href}
                  id={id}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-white/10 flex items-center justify-center text-[#444] hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all duration-200"
                >
                  <Icon size={13} />
                </a>
              ))}
              {/* WhatsApp */}
              <a
                href="https://wa.me/56912345678"
                id="footer-wa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-white/10 flex items-center justify-center text-[#444] hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-black text-[#444] text-[9px] tracking-[0.3em] uppercase mb-1">CONTACTO</h4>
            {[
              { icon: '📞', text: '+56 9 1234 5678' },
              { icon: '✉', text: 'waveprojectchile@gmail.com', href: 'mailto:waveprojectchile@gmail.com' },
              { icon: '📍', text: 'Calle 6 235, Concón, Chile' },
            ].map(item => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="text-xs mt-0.5">{item.icon}</span>
                {item.href ? (
                  <a href={item.href} className="font-body text-[#555] text-xs hover:text-[#C9A84C] transition-colors">
                    {item.text}
                  </a>
                ) : (
                  <span className="font-body text-[#555] text-xs">{item.text}</span>
                )}
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-black text-[#444] text-[9px] tracking-[0.3em] uppercase mb-1">SITIO</h4>
            {['#planes', '#beneficios', '#faq', '#contacto'].map(href => (
              <a key={href} href={href} className="font-heading text-[#555] text-xs hover:text-[#C9A84C] transition-colors uppercase tracking-wider">
                {href.replace('#', '')}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-[#333] text-[10px] tracking-wider">
            © 2024 WAVE PROJECT GYM. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex gap-6">
            {['Términos y condiciones', 'Políticas de privacidad'].map(t => (
              <a key={t} href="#" className="font-body text-[#333] text-[10px] hover:text-[#C9A84C] transition-colors tracking-wider">
                {t.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
