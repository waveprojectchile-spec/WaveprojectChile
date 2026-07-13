import { describe, it, expect } from 'vitest';
import { calcTimeLeft, clampCupos } from '@/lib/preventa';

const DAY = 86_400_000;
const HOUR = 3_600_000;
const MIN = 60_000;
const SEC = 1_000;

describe('calcTimeLeft', () => {
  it('happy path: descompone 2d 3h 4m 5s exactos', () => {
    const deadline = 2 * DAY + 3 * HOUR + 4 * MIN + 5 * SEC;
    expect(calcTimeLeft(deadline, 0)).toEqual({ d: 2, h: 3, m: 4, s: 5, done: false });
  });

  it('happy path: usa el "ahora" pasado como parámetro (no Date.now global)', () => {
    const now = 1_000_000_000_000;
    const deadline = now + (1 * HOUR + 30 * MIN + 15 * SEC);
    expect(calcTimeLeft(deadline, now)).toEqual({ d: 0, h: 1, m: 30, s: 15, done: false });
  });

  it('deadline exactamente igual a ahora (diff 0) -> done', () => {
    expect(calcTimeLeft(5000, 5000)).toEqual({ d: 0, h: 0, m: 0, s: 0, done: true });
  });

  it('deadline en el pasado (diff negativo) -> done, todo en cero', () => {
    expect(calcTimeLeft(500, 1000)).toEqual({ d: 0, h: 0, m: 0, s: 0, done: true });
  });

  it('deadline muy pasado -> done', () => {
    expect(calcTimeLeft(0, 10 * DAY)).toEqual({ d: 0, h: 0, m: 0, s: 0, done: true });
  });

  it('deadline futuro lejano: 100 días exactos', () => {
    expect(calcTimeLeft(100 * DAY, 0)).toEqual({ d: 100, h: 0, m: 0, s: 0, done: false });
  });

  it('exactamente 1 segundo restante', () => {
    expect(calcTimeLeft(1000, 0)).toEqual({ d: 0, h: 0, m: 0, s: 1, done: false });
  });

  it('sub-segundo restante (500ms): no done pero segundos en 0', () => {
    expect(calcTimeLeft(500, 0)).toEqual({ d: 0, h: 0, m: 0, s: 0, done: false });
  });

  it('roll-over: 23h 59m 59s justo antes de sumar un día', () => {
    const deadline = 23 * HOUR + 59 * MIN + 59 * SEC;
    expect(calcTimeLeft(deadline, 0)).toEqual({ d: 0, h: 23, m: 59, s: 59, done: false });
  });

  it('no arrastra unidades: componentes acotados a su rango (h<24, m<60, s<60)', () => {
    const deadline = 5 * DAY + 23 * HOUR + 59 * MIN + 59 * SEC + 999;
    const r = calcTimeLeft(deadline, 0);
    expect(r.d).toBe(5);
    expect(r.h).toBe(23);
    expect(r.m).toBe(59);
    expect(r.s).toBe(59);
    expect(r.done).toBe(false);
  });
});

describe('clampCupos', () => {
  it('happy path: vendidos dentro del rango se mantiene', () => {
    expect(clampCupos(5, 10)).toBe(5);
  });

  it('límite inferior exacto', () => {
    expect(clampCupos(0, 10)).toBe(0);
  });

  it('límite superior exacto', () => {
    expect(clampCupos(10, 10)).toBe(10);
  });

  it('vendidos > total -> tope en total', () => {
    expect(clampCupos(15, 10)).toBe(10);
  });

  it('vendidos negativo -> 0', () => {
    expect(clampCupos(-3, 10)).toBe(0);
  });

  it('floor de vendidos float', () => {
    expect(clampCupos(5.9, 10)).toBe(5);
  });

  it('floor de vendidos float justo bajo el tope', () => {
    expect(clampCupos(9.99, 10)).toBe(9);
  });

  it('floor de total float', () => {
    expect(clampCupos(11, 10.9)).toBe(10);
  });

  it('total 0 -> siempre 0', () => {
    expect(clampCupos(5, 0)).toBe(0);
  });

  it('ambos 0 -> 0', () => {
    expect(clampCupos(0, 0)).toBe(0);
  });

  it('total negativo se sanea a 0', () => {
    expect(clampCupos(5, -10)).toBe(0);
  });

  it('vendidos NaN -> 0', () => {
    expect(clampCupos(NaN, 10)).toBe(0);
  });

  it('total NaN -> 0 (capacidad desconocida)', () => {
    expect(clampCupos(5, NaN)).toBe(0);
  });

  it('vendidos +Infinity -> tope (total saneado)', () => {
    expect(clampCupos(Infinity, 10)).toBe(10);
  });

  it('vendidos -Infinity -> 0', () => {
    expect(clampCupos(-Infinity, 10)).toBe(0);
  });

  it('total +Infinity se trata como 0', () => {
    expect(clampCupos(5, Infinity)).toBe(0);
  });

  it('total -Infinity se trata como 0', () => {
    expect(clampCupos(5, -Infinity)).toBe(0);
  });

  it('siempre devuelve un entero', () => {
    expect(Number.isInteger(clampCupos(7.3, 100))).toBe(true);
    expect(Number.isInteger(clampCupos(200, 100))).toBe(true);
    expect(Number.isInteger(clampCupos(-5.5, 100))).toBe(true);
  });
});
