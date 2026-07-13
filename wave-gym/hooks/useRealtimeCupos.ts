'use client';
import { useEffect, useState, useCallback } from 'react';
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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    let channel: RealtimeChannel | null = null;
    let mounted = true;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    const fetchCupos = async (supabase: any) => {
      try {
        const { data, error } = await supabase
          .from('cupos_config')
          .select('cupos_vendidos, total_cupos')
          .eq('activo', true)
          .single();

        if (data && !error && mounted) {
          setCuposVendidos(data.cupos_vendidos ?? 0);
          setTotalCupos(data.total_cupos ?? 50);
        }
      } catch {
        // silenciar — usar valores actuales
      }
    };

    const init = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Carga inicial
        await fetchCupos(supabase);

        // Realtime (si está habilitado en Supabase)
        channel = supabase
          .channel('cupos-realtime')
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'cupos_config' },
            (payload: any) => {
              if (mounted) {
                setCuposVendidos(payload.new.cupos_vendidos ?? 0);
                setTotalCupos(payload.new.total_cupos ?? 50);
              }
            }
          )
          .subscribe();

        // Polling de respaldo cada 15 s (cubre el caso en que Realtime no esté habilitado)
        pollInterval = setInterval(() => fetchCupos(supabase), 15_000);
      } catch {
        // silenciar errores de conexión
      }
    };

    init();

    return () => {
      mounted = false;
      if (channel) channel.unsubscribe?.();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  return {
    cuposVendidos,
    totalCupos,
    cuposDisponibles: totalCupos - cuposVendidos,
    porcentaje: totalCupos > 0 ? (cuposVendidos / totalCupos) * 100 : 0,
  };
}
