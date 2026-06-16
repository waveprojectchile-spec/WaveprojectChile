import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wave Project Gym — 1ª Preventa Oficial | Concón, Chile',
  description:
    'Asegura tu cupo en la 1ª preventa oficial de Wave Project Gym. Solo 50 cupos disponibles. Planes desde $32.990 CLP. Calle 6 235, Concón. Movimiento · Disciplina · Propósito.',
  keywords: ['gimnasio', 'Concón', 'preventa', 'gym', 'Wave Project', 'membresía', 'Valparaíso'],
  openGraph: {
    title: 'Wave Project Gym — 1ª Preventa Oficial',
    description: 'Solo 50 cupos. Precio especial de lanzamiento. Asegura el tuyo.',
    url: 'https://waveprojectgym.cl',
    siteName: 'Wave Project Gym',
    locale: 'es_CL',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#0A0A0A] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
