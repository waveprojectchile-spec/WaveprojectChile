import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export interface LegalBlock {
  h: string;
  p: string[];
}

export default function LegalPage({
  chip,
  title,
  updated,
  intro,
  blocks,
}: {
  chip: string;
  title: string;
  updated: string;
  intro: string;
  blocks: LegalBlock[];
}) {
  return (
    <div className="bg-ink-950 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-40 pb-24 px-6 md:px-12 lg:px-20 relative">
        <div className="accent-line absolute top-[110px] inset-x-0 opacity-40" />
        <div className="max-w-3xl mx-auto">
          <div className="chip mb-5 w-fit">{chip}</div>
          <h1 className="section-title mb-3">{title}</h1>
          <p className="font-body text-chalk-faint text-xs tracking-wider uppercase mb-10">
            Última actualización: {updated}
          </p>

          <p className="font-body text-chalk-muted text-base leading-relaxed mb-12">
            {intro}
          </p>

          <div className="flex flex-col gap-10">
            {blocks.map((b, i) => (
              <section key={b.h}>
                <h2 className="font-heading font-black text-white text-lg tracking-[0.08em] uppercase mb-4 flex items-center gap-3">
                  <span className="font-display text-accent text-sm">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {b.h}
                </h2>
                <div className="flex flex-col gap-3 pl-9">
                  {b.p.map((para, j) => (
                    <p key={j} className="font-body text-chalk-muted text-sm leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-hair">
            <p className="font-body text-chalk-faint text-xs leading-relaxed">
              Ante cualquier duda sobre este documento, escríbenos a{' '}
              <a href="mailto:waveprojectchile@gmail.com" className="text-accent hover:underline">
                waveprojectchile@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
