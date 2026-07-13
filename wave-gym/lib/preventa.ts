/**
 * Lógica pura de la preventa (sin acoplarse a Date.now() global ni a Supabase).
 * Se testea de forma aislada en lib/preventa.test.ts.
 */

export interface TimeLeft {
  d: number;
  h: number;
  m: number;
  s: number;
  done: boolean;
}

/**
 * Calcula el tiempo restante (días/horas/min/seg) entre `deadlineMs` y `nowMs`.
 * Si el deadline ya pasó (diff <= 0) devuelve todo en 0 con `done: true`.
 *
 * Función pura: recibe el "ahora" como parámetro para poder testearla sin
 * depender del reloj del sistema.
 */
export function calcTimeLeft(deadlineMs: number, nowMs: number): TimeLeft {
  const diff = deadlineMs - nowMs;
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff / 3_600_000) % 24),
    m: Math.floor((diff / 60_000) % 60),
    s: Math.floor((diff / 1_000) % 60),
    done: false,
  };
}

/**
 * Restringe la cantidad de cupos vendidos a un entero seguro en [0, total].
 *
 * Reglas:
 * - `floor` sobre vendidos y total (los cupos son enteros).
 * - Resultado siempre 0 <= resultado <= total.
 * - Entradas no válidas devuelven valores seguros:
 *     - vendidos NaN o -Infinity  -> 0
 *     - vendidos +Infinity        -> total saneado
 *     - total NaN o ±Infinity     -> se trata como 0 (capacidad desconocida)
 */
export function clampCupos(vendidos: number, total: number): number {
  const flooredTotal = Math.floor(Number(total));
  const safeTotal = Number.isFinite(flooredTotal) ? Math.max(0, flooredTotal) : 0;

  const v = Math.floor(Number(vendidos));
  if (!Number.isFinite(v)) {
    // NaN o -Infinity -> 0; +Infinity -> tope
    return v > 0 ? safeTotal : 0;
  }

  return Math.min(Math.max(0, v), safeTotal);
}
