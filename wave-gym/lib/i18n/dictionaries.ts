export type Lang = 'ES' | 'EN' | 'PT';

export interface Dict {
  nav: { pretitle: string; cta: string; home: string; plans: string; benefits: string; faq: string; contact: string; renew: string; langLabel: string };
  hero: {
    badge: string; tagline: string; desc1: string; desc2: string;
    ctaBuy: string; ctaPlans: string;
    stats: { cupos: string; renov: string; nivel: string };
    chips: { flex: string; renov: string; community: string; level: string };
    cuposLive: string; cuposLabel: string; cuposOf: string; cuposLimit: string;
    scroll: string;
  };
  timer: { title: string; days: string; hours: string; min: string; sec: string; finishedBadge: string; finishedTitle: string; finishedDesc: string };
  plans: {
    chip: string; title1: string; title2: string; subtitle1: string; subtitle2: string;
    preventa: string; pesos: string; best: string;
    choose: string; soldOut: string; processing: string;
    limited: string; limitedDesc: string; sold: string; remain: string; total: string;
    names: { mensual: string; trimestral: string; semestral: string; anual: string };
    feat: { m1: string; m3: string; m6: string; m12: string; access: string; community: string; renew: string };
  };
  benefits: {
    chip: string; title1: string; title2: string;
    items: { t: string; d: string }[];
  };
  gym: {
    chip: string; title1: string; title2: string; p1: string; p2: string;
    feat: { equip: string; ambiente: string; funcional: string; comunidad: string };
    cta: string; addr: string;
  };
  how: { chip: string; title1: string; title2: string; steps: { t: string; d: string }[] };
  faq: { chip: string; title1: string; title2: string; intro: string; contact: string; items: { q: string; a: string }[] };
  footer: {
    ctaBig: string; ctaTitle1: string; ctaTitle2: string; ctaBtn: string; securePay: string;
    contact: string; site: string; rights: string; terms: string; privacy: string;
    words: { mov: string; disc: string; prop: string };
  };
}

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'ES', label: 'Español',   flag: '🇨🇱' },
  { code: 'EN', label: 'English',   flag: '🇺🇸' },
  { code: 'PT', label: 'Português', flag: '🇧🇷' },
];
