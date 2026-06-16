'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { registerAction } from '@/lib/actions/auth';
import { motion } from 'framer-motion';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-8" disabled={pending}>
      {pending ? 'REGISTRANDO...' : 'COMPLETAR REGISTRO'}
    </Button>
  );
}

export default function RegistroPage() {
  const [error, setError] = useState<string | null>(null);
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [edad, setEdad] = useState<number | ''>('');

  useEffect(() => {
    if (fechaNacimiento) {
      const birthDate = new Date(fechaNacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setEdad(age >= 0 ? age : '');
    } else {
      setEdad('');
    }
  }, [fechaNacimiento]);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const result = await registerAction(formData);
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
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-white mb-4">
              REGISTRO DE CLIENTE
            </h1>
            <p className="text-neutral-400 text-sm uppercase tracking-wider font-bold">
              ÚNETE A WAVE PROJECT GYM
            </p>
          </div>

          <form action={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-950/50 border border-red-900 text-red-200 p-4 text-sm font-bold tracking-wider uppercase text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información Personal */}
              <div className="space-y-6">
                <h2 className="text-white text-lg font-bold uppercase tracking-widest border-b border-neutral-800 pb-2">Datos Personales</h2>
                
                <div className="space-y-3">
                  <Label htmlFor="nombre">NOMBRE COMPLETO</Label>
                  <Input id="nombre" name="nombre" type="text" placeholder="EJ: JUAN PÉREZ" required />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="rut">RUT</Label>
                  <Input id="rut" name="rut" type="text" placeholder="12.345.678-9" required />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="fecha_nacimiento">FECHA DE NACIMIENTO</Label>
                  <Input 
                    id="fecha_nacimiento" 
                    name="fecha_nacimiento" 
                    type="date" 
                    required 
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="edad">EDAD</Label>
                  <Input id="edad" name="edad" type="number" readOnly value={edad} className="bg-neutral-900 text-neutral-400 border-neutral-800" />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="telefono">TELÉFONO</Label>
                  <Input id="telefono" name="telefono" type="tel" placeholder="+56 9 1234 5678" required />
                </div>
              </div>

              {/* Cuenta y Dirección */}
              <div className="space-y-6">
                <h2 className="text-white text-lg font-bold uppercase tracking-widest border-b border-neutral-800 pb-2">Cuenta y Ubicación</h2>
                
                <div className="space-y-3">
                  <Label htmlFor="email">CORREO ELECTRÓNICO</Label>
                  <Input id="email" name="email" type="email" placeholder="CORREO@EJEMPLO.COM" required />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password">CONTRASEÑA</Label>
                  <Input id="password" name="password" type="password" placeholder="MÍNIMO 6 CARACTERES" required minLength={6} />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="direccion">DIRECCIÓN</Label>
                  <Input id="direccion" name="direccion" type="text" placeholder="CALLE Y NÚMERO" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="ciudad">CIUDAD</Label>
                    <Input id="ciudad" name="ciudad" type="text" placeholder="CONCÓN" required />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="region">REGIÓN</Label>
                    <Input id="region" name="region" type="text" placeholder="VALPARAÍSO" required />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="codigo_postal">CÓDIGO POSTAL</Label>
                  <Input id="codigo_postal" name="codigo_postal" type="text" placeholder="2510000" required />
                </div>
              </div>
            </div>

            {/* Plan de Interés */}
            <div className="space-y-4 pt-4">
              <h2 className="text-white text-lg font-bold uppercase tracking-widest border-b border-neutral-800 pb-2">Plan de Interés</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'].map((plan) => (
                  <label key={plan} className="flex items-center space-x-3 cursor-pointer group">
                    <input type="radio" name="plan" value={plan} required className="appearance-none w-4 h-4 border border-neutral-700 bg-black checked:bg-white checked:border-white transition-colors" />
                    <span className="text-sm font-bold tracking-widest text-neutral-400 group-hover:text-white transition-colors">{plan}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Información Médica */}
            <div className="space-y-4 pt-4">
              <h2 className="text-white text-lg font-bold uppercase tracking-widest border-b border-neutral-800 pb-2">Información Médica (Opcional)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'enfermedades_cronicas', label: 'ENFERMEDADES CRÓNICAS' },
                  { id: 'operaciones', label: 'OPERACIONES / CIRUGÍAS' },
                  { id: 'medicamentos', label: 'MEDICAMENTOS ACTUALES' },
                  { id: 'lesiones', label: 'LESIONES' }
                ].map((item) => (
                  <label key={item.id} className="flex items-center space-x-3 cursor-pointer group bg-neutral-950 p-4 border border-neutral-900 hover:border-neutral-700 transition-colors">
                    <input type="checkbox" name={item.id} id={item.id} className="appearance-none w-5 h-5 border border-neutral-700 bg-black checked:bg-white checked:border-white transition-colors relative before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjIwIDYgOSAxNyA0IDEyIj48L3BvbHlsaW5lPjwvc3ZnPg==')] before:opacity-0 checked:before:opacity-100 before:bg-no-repeat before:bg-center before:bg-[length:14px_14px]" />
                    <span className="text-sm font-bold tracking-widest text-neutral-400 group-hover:text-white transition-colors">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <SubmitButton />
            
            <div className="text-center pt-6">
              <p className="text-neutral-400 text-sm uppercase tracking-wider font-bold">
                ¿YA TIENES CUENTA?
              </p>
              <a href="/login" className="text-white text-sm uppercase tracking-wider font-bold hover:underline mt-2 inline-block">
                INICIA SESIÓN
              </a>
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
