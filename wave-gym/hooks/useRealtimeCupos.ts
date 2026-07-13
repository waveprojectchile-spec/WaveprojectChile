'use client';
import { useEffect, useState } from 'react';

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
    let mounted = true;
    let interval: ReturnType<typeof setInterval> | null = null;

    const fetchCupos = async () => {
      try {
        const res = await fetch('/api/cupos', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) {
          setCuposVendidos(data.cupos_vendidos ?? 0);
          setTotalCupos(data.total_cupos ?? 50);
        }
      } catch {
        // silenciar — mantener valores actuales
      }
    };

    // Carga inmediata
    fetchCupos();

    // Polling cada 10 s
    interval = setInterval(fetchCupos, 10_000);

    return () => {
      mounted = false;
      if (interval) clearInterval(interval);
    };
  }, []);

  return {
    cuposVendidos,
    totalCupos,
    cuposDisponibles: totalCupos - cuposVendidos,
    porcentaje: totalCupos > 0 ? (cuposVendidos / totalCupos) * 100 : 0,
  };
}
