'use client';
import { useEffect, useRef, useState } from 'react';

interface CuposData {
  cuposVendidos: number;
  totalCupos: number;
  cuposDisponibles: number;
  porcentaje: number;
}

// Canal compartido entre tabs del mismo origen (dashboard → home en la misma sesión)
const CHANNEL_NAME = 'wave-cupos-update';

// Intervalo normal y el agresivo que se activa justo después de una escritura
const POLL_NORMAL_MS  = 5_000;
const POLL_BURST_MS   = 1_000;  // 1s durante la ráfaga post-guardado
const BURST_DURATION  = 8_000;  // 8s de ráfaga, luego vuelve al ritmo normal

export function useRealtimeCupos(): CuposData {
  const [cuposVendidos, setCuposVendidos] = useState(0);
  const [totalCupos, setTotalCupos]       = useState(50);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef  = useRef(true);

  const fetchCupos = async () => {
    try {
      const res = await fetch('/api/cupos', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (mountedRef.current) {
        setCuposVendidos(data.cupos_vendidos ?? 0);
        setTotalCupos(data.total_cupos    ?? 50);
      }
    } catch {
      // mantener valores actuales — no crashear
    }
  };

  const startPolling = (intervalMs: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchCupos, intervalMs);
  };

  const activateBurst = () => {
    // fetch inmediato + polling cada 1s por 8 segundos, luego vuelve a 5s
    fetchCupos();
    startPolling(POLL_BURST_MS);
    setTimeout(() => {
      if (mountedRef.current) startPolling(POLL_NORMAL_MS);
    }, BURST_DURATION);
  };

  useEffect(() => {
    mountedRef.current = true;

    // Carga inicial inmediata
    fetchCupos();

    // Polling normal de base
    startPolling(POLL_NORMAL_MS);

    // Escucha al dashboard: cuando guarda, activa ráfaga de polling
    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = () => activateBurst();
    }

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      channel?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    cuposVendidos,
    totalCupos,
    cuposDisponibles: totalCupos - cuposVendidos,
    porcentaje: totalCupos > 0 ? (cuposVendidos / totalCupos) * 100 : 0,
  };
}

/**
 * Llama esto desde ContadorSection después de un guardado exitoso.
 * Notifica a todos los tabs abiertos (incluyendo el home) para que
 * actualicen el contador de inmediato.
 */
export function notifyCuposUpdated() {
  if (typeof BroadcastChannel !== 'undefined') {
    const ch = new BroadcastChannel(CHANNEL_NAME);
    ch.postMessage({ type: 'updated', ts: Date.now() });
    ch.close();
  }
}
