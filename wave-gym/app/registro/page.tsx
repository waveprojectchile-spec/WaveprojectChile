import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">Registro</h1>
          <p className="text-neutral-400">Formulario de registro en construcción.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
