'use client';
import { useEffect, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface CuposData {
  cuposVendidos: number;
  totalCupos: number;
  cuposDisponibles: number;
  porcentaje: number;
}

export function useRealtimeCupos(): CuposData {
  const [cuposVendidos, setCuposVendidos] = useState(0);
  const [totalCupos, setTotalCupos] = useState(50);

  useEffect(() => {
    // Solo cargamos si las env vars están configuradas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    let channel: RealtimeChannel | null = null;
    let mounted = true;

    const init = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Carga inicial
        const { data, error } = await supabase
          .from('cupos_config')
          .select('*')
          .eq('activo', true)
          .single();

        if (data && !error && mounted) {
          setCuposVendidos(data.cupos_vendidos ?? 0);
          setTotalCupos(data.total_cupos ?? 50);
        }

        // Suscripción realtime (solo si la carga inicial fue exitosa)
        if (!error) {
          channel = supabase
            .channel('cupos-realtime')
            .on(
              'postgres_changes',
              { event: 'UPDATE', schema: 'public', table: 'cupos_config' },
              (payload) => {
                if (mounted) {
                  setCuposVendidos(payload.new.cupos_vendidos ?? 0);
                  setTotalCupos(payload.new.total_cupos ?? 50);
                }
              }
            )
            .subscribe();
        }
      } catch {
        // Silenciar errores de conexión — usar valores por defecto
      }
    };

    init();

    return () => {
      mounted = false;
      if (channel) {
        channel.unsubscribe?.();
      }
    };
  }, []);

  return {
    cuposVendidos,
    totalCupos,
    cuposDisponibles: totalCupos - cuposVendidos,
    porcentaje: totalCupos > 0 ? (cuposVendidos / totalCupos) * 100 : 0,
  };
}
