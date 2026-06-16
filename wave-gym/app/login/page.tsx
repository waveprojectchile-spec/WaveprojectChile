'use client';

import { useState, Suspense } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { loginAction } from '@/lib/actions/auth';
import { motion, AnimatePresence } from 'framer-motion';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-6" disabled={pending}>
      {pending ? 'ACCEDIENDO...' : 'ACCEDER'}
    </Button>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'admin' ? 'admin' : 'cliente';
  
  const [tab, setTab] = useState<'cliente' | 'admin'>(initialTab);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-white text-center mb-10">
            ACCESO
          </h1>

          {/* Tabs */}
          <div className="flex mb-8 bg-neutral-950 p-1 border border-neutral-800">
            <button
              type="button"
              onClick={() => setTab('cliente')}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all ${
                tab === 'cliente' 
                  ? 'bg-neutral-800 text-white' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              CLIENTE
            </button>
            <button
              type="button"
              onClick={() => setTab('admin')}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all ${
                tab === 'admin' 
                  ? 'bg-neutral-800 text-white' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              ADMIN
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form 
              key={tab}
              initial={{ opacity: 0, x: tab === 'cliente' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tab === 'cliente' ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              action={handleSubmit}
              className="space-y-6"
            >
              {error && (
                <div className="bg-red-950/50 border border-red-900 text-red-200 p-4 text-sm font-bold tracking-wider uppercase text-center">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="email">CORREO ELECTRÓNICO</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="TU CORREO" 
                  required 
                  defaultValue={tab === 'admin' ? 'admin@waveprojectgym.cl' : ''}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password">CONTRASEÑA</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="TU CONTRASEÑA" 
                  required 
                  defaultValue={tab === 'admin' ? 'WaveAdmin2024' : ''}
                />
              </div>

              <SubmitButton />

              {tab === 'cliente' && (
                <div className="text-center pt-6 border-t border-neutral-900">
                  <p className="text-neutral-400 text-sm uppercase tracking-wider font-bold">
                    ¿NO TIENES CUENTA?
                  </p>
                  <a href="/registro" className="text-white text-sm uppercase tracking-wider font-bold hover:underline mt-2 inline-block">
                    REGÍSTRATE AQUÍ
                  </a>
                </div>
              )}

              {tab === 'admin' && (
                <div className="text-center pt-6 border-t border-neutral-900">
                  <p className="text-neutral-500 text-xs uppercase tracking-wider">
                    CREDENCIALES DE PRUEBA ADMIN:
                    <br />
                    <span className="text-neutral-400">admin@waveprojectgym.cl / WaveAdmin2024</span>
                  </p>
                </div>
              )}
            </motion.form>
          </AnimatePresence>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-black min-h-screen flex items-center justify-center text-white">Cargando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
