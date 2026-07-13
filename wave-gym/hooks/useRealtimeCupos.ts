'use client';
import { useEffect, useRef, useState } from 'react';

interface CuposData {
  cuposVendidos: number;
  totalCupos: number;
  cuposDisponibles: number;
  porcentaje: number;
}

const CHANNEL_NAME   = 'wave-cupos-update';
const POLL_NORMAL_MS = 5_000;
const POLL_BURST_MS  = 1_000;
const BURST_DURATION = 8_000;

export function useRealtimeCupos(): CuposData {
  const [cuposVendidos, setCuposVendidos] = useState(0);
  const [totalCupos, setTotalCupos]       = useState(50);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef  = useRef(true);

  const fetchCupos = async () => {
    try {
      const res = await fetch(`/api/cupos?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) {
        console.warn('[cupos] fetch failed:', res.status);
        return;
      }
      const data = await res.json();
      console.log('[cupos]', data);
      if (mountedRef.current) {
        setCuposVendidos(data.cupos_vendidos ?? 0);
        setTotalCupos(data.total_cupos     ?? 50);
      }
    } catch (e) {
      console.error('[cupos] error:', e);
    }
  };

  const startPolling = (ms: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchCupos, ms);
  };

  const activateBurst = () => {
    fetchCupos();
    startPolling(POLL_BURST_MS);
    setTimeout(() => {
      if (mountedRef.current) startPolling(POLL_NORMAL_MS);
    }, BURST_DURATION);
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchCupos();
    startPolling(POLL_NORMAL_MS);

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

export function notifyCuposUpdated() {
  if (typeof BroadcastChannel !== 'undefined') {
    const ch = new BroadcastChannel(CHANNEL_NAME);
    ch.postMessage({ type: 'updated', ts: Date.now() });
    ch.close();
  }
}
