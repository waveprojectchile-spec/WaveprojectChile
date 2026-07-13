import type { Dict } from './dictionaries';

export const es: Dict = {
  nav: {
    pretitle: '1ª PREVENTA OFICIAL', cta: 'COMPRAR PREVENTA',
    home: 'INICIO', plans: 'PLANES', benefits: 'BENEFICIOS', faq: 'FAQ', contact: 'CONTACTO', renew: 'RENOVAR',
    langLabel: 'IDIOMA / LANGUAGE',
  },
  hero: {
    badge: '1ª PREVENTA OFICIAL — CONCÓN, CHILE',
    tagline: 'MOVIMIENTO · DISCIPLINA · PROPÓSITO',
    desc1: 'Accede al gimnasio que transforma tu cuerpo, tu mente y tu propósito.',
    desc2: ' Solo 50 cupos disponibles.',
    ctaBuy: 'ASEGURAR MI CUPO', ctaPlans: 'VER PLANES',
    stats: { cupos: 'CUPOS', renov: 'RENOVABLE', nivel: 'NIVEL' },
    chips: { flex: 'Acceso flexible', renov: 'Renovable x2', community: 'Comunidad', level: 'Alto nivel' },
    cuposLive: 'EN VIVO · CUPOS RESTANTES', cuposLabel: 'CUPOS DISPONIBLES',
    cuposOf: 'de {total} cupos de lanzamiento', cuposLimit: 'Cupos limitados — no se venderán más de {total}',
    scroll: 'scroll',
  },
  timer: {
    title: 'CIERRA LA PREVENTA 2 EN', days: 'Días', hours: 'Horas', min: 'Min', sec: 'Seg',
    finishedBadge: 'PREVENTA 2 FINALIZADA', finishedTitle: 'La Preventa 3 llega muy pronto',
    finishedDesc: 'Nuevos precios y condiciones disponibles próximamente. Seguinos en Instagram para no perdértela.',
  },
  plans: {
    chip: 'PLANES DE PREVENTA', title1: 'ELIGE TU', title2: 'PLAN',
    subtitle1: 'Precios especiales de lanzamiento.', subtitle2: 'Renovables hasta 2 veces.',
    preventa: 'PREVENTA 2', pesos: 'pesos chilenos', best: 'MEJOR VALOR',
    choose: 'ELEGIR PLAN →', soldOut: 'AGOTADO', processing: 'PROCESANDO...',
    limited: 'CUPOS LIMITADOS', limitedDesc: 'Solo 50 preventas en esta etapa.',
    sold: '{n} vendidos', remain: 'QUEDAN {n} CUPOS', total: '{n} total',
    names: { mensual: 'MENSUAL', trimestral: 'TRIMESTRAL', semestral: 'SEMESTRAL', anual: 'ANUAL' },
    feat: {
      m1: '1 mes de acceso', m3: '3 meses de acceso', m6: '6 meses de acceso', m12: '12 meses de acceso',
      access: 'Acceso al gimnasio', community: 'Comunidad Wave Project', renew: 'Renovable hasta 2 veces',
    },
  },
  benefits: {
    chip: 'BENEFICIOS', title1: 'SÉ PARTE', title2: 'DESDE EL INICIO',
    items: [
      { t: 'PRECIO ESPECIAL', d: 'Asegura el precio de lanzamiento antes de la apertura oficial. Solo por preventa.' },
      { t: 'CUPO ASEGURADO', d: 'Garantiza tu ingreso al gimnasio antes de que se agoten los 50 cupos disponibles.' },
      { t: 'BENEFICIOS EXCLUSIVOS', d: 'Accede a ventajas y descuentos exclusivos disponibles solo para miembros de preventa.' },
      { t: 'ENTRENA CON PROPÓSITO', d: 'Únete a una comunidad enfocada en disciplina, movimiento y propósito desde el día 1.' },
    ],
  },
  gym: {
    chip: 'NUESTRO GYM', title1: 'DISEÑADO PARA', title2: 'TU MEJOR VERSIÓN',
    p1: 'Wave Project Gym nació con un propósito claro: crear un espacio donde cada persona pueda transformarse. Equipamiento de primera, un ambiente diseñado para motivarte y una comunidad que te impulsa.',
    p2: 'Ubicado en Calle 6 235, Concón, nuestro gimnasio está pensado para quien toma en serio su entrenamiento y su bienestar.',
    feat: { equip: 'Equipamiento premium', ambiente: 'Ambiente motivador', funcional: 'Entrenamiento funcional', comunidad: 'Comunidad activa' },
    cta: 'ASEGURAR MI CUPO →', addr: 'Calle 6 235, Concón',
  },
  how: {
    chip: 'PROCESO', title1: '¿CÓMO', title2: 'FUNCIONA?',
    steps: [
      { t: 'ELIGE TU PLAN', d: 'Selecciona el plan que mejor se adapte a tus objetivos y presupuesto.' },
      { t: 'COMPRA ONLINE', d: 'Completa tu compra 100% online de forma segura con MercadoPago.' },
      { t: 'ASEGURA TU CUPO', d: 'Recibe la confirmación y tu número de cupo entre los 50 de lanzamiento.' },
      { t: 'COMIENZA TU CAMBIO', d: 'Prepárate para entrenar en Wave Project Gym desde el primer día.' },
    ],
  },
  faq: {
    chip: 'FAQ', title1: 'PREGUNTAS', title2: 'FRECUENTES',
    intro: '¿Tienes dudas? Aquí encontrarás las respuestas más comunes sobre la preventa.',
    contact: 'CONTACTAR →',
    items: [
      { q: '¿Cuándo inicia mi plan?', a: 'Tu plan comienza a partir de la apertura oficial de Wave Project Gym. Recibirás un correo con la fecha exacta de inicio con anticipación.' },
      { q: '¿La preventa es renovable?', a: 'Sí. Tu precio de preventa se puede renovar hasta 2 veces, asegurando el precio especial de lanzamiento en tus próximas renovaciones.' },
      { q: '¿Puedo cambiar de plan después?', a: 'Una vez completada la compra, el plan es definitivo para esta etapa. Podrás cambiar de modalidad en futuras renovaciones.' },
      { q: '¿Qué pasa si se agotan los 50 cupos?', a: 'Una vez agotados los 50 cupos, no se venderán más preventas en esta etapa. Te recomendamos asegurar el tuyo ahora.' },
      { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos todos los medios disponibles en Chile a través de MercadoPago: tarjeta de débito, crédito, transferencia y más.' },
      { q: '¿Puedo congelar mi plan?', a: 'Las condiciones de congelamiento estarán disponibles una vez que el gimnasio abra. El equipo de Wave Project Gym te informará los detalles.' },
    ],
  },
  footer: {
    ctaBig: '50 CUPOS', ctaTitle1: 'ASEGURA TU LUGAR', ctaTitle2: 'ANTES QUE SE AGOTEN',
    ctaBtn: 'COMPRAR PREVENTA AHORA', securePay: 'Pago 100% seguro vía MercadoPago',
    contact: 'CONTACTO', site: 'SITIO', rights: '© 2025 WAVE PROJECT GYM. TODOS LOS DERECHOS RESERVADOS.',
    terms: 'Términos y condiciones', privacy: 'Políticas de privacidad',
    words: { mov: 'MOVIMIENTO', disc: 'DISCIPLINA', prop: 'PROPÓSITO' },
  },
};
