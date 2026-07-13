import type { Metadata } from 'next';
import './globals.css';
import { LangProvider } from '@/lib/i18n/LangContext';

export const metadata: Metadata = {
  title: 'Wave Project Gym — 2ª Preventa Oficial | Concón, Chile',
  description:
    'Asegura tu cupo en la 2ª preventa oficial de Wave Project Gym. Solo 50 cupos disponibles. Planes desde $32.990 CLP. Calle 6 235, Concón. Movimiento · Disciplina · Propósito.',
  keywords: ['gimnasio', 'Concón', 'preventa', 'gym', 'Wave Project', 'membresía', 'Valparaíso'],
  openGraph: {
    title: 'Wave Project Gym — 2ª Preventa Oficial',
    description: 'Solo 50 cupos. Precio especial de lanzamiento. Asegura el tuyo.',
    url: 'https://waveproject.cl',
    siteName: 'Wave Project Gym',
    images: [{ url: '/wave-logo.png', width: 1254, height: 1254, alt: 'Wave Project Gym' }],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wave Project Gym — 2ª Preventa Oficial',
    description: 'Solo 50 cupos. Precio especial de lanzamiento. Asegura el tuyo.',
    images: ['/wave-logo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-ink-950 text-white antialiased">
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
