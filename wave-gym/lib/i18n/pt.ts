import type { Dict } from './dictionaries';

export const pt: Dict = {
  nav: {
    pretitle: '2ª PRÉ-VENDA OFICIAL', cta: 'COMPRAR PRÉ-VENDA',
    home: 'INÍCIO', plans: 'PLANOS', benefits: 'BENEFÍCIOS', faq: 'FAQ', contact: 'CONTATO', renew: 'RENOVAR',
    langLabel: 'IDIOMA / LANGUAGE',
  },
  hero: {
    badge: '2ª PRÉ-VENDA OFICIAL — CONCÓN, CHILE',
    tagline: 'MOVIMENTO · DISCIPLINA · PROPÓSITO',
    desc1: 'Acesse a academia que transforma seu corpo, sua mente e seu propósito.',
    desc2: ' Apenas 50 vagas disponíveis.',
    ctaBuy: 'GARANTIR MINHA VAGA', ctaPlans: 'VER PLANOS',
    stats: { cupos: 'VAGAS', renov: 'RENOVÁVEL', nivel: 'NÍVEL' },
    chips: { flex: 'Acesso flexível', renov: 'Renovável x2', community: 'Comunidade', level: 'Alto nível' },
    cuposLive: 'AO VIVO · VAGAS RESTANTES', cuposLabel: 'VAGAS DISPONÍVEIS',
    cuposOf: 'de {total} vagas de lançamento', cuposLimit: 'Vagas limitadas — não serão vendidas mais de {total}',
    scroll: 'scroll',
  },
  timer: {
    title: 'PRÉ-VENDA 2 ENCERRA EM', days: 'Dias', hours: 'Horas', min: 'Min', sec: 'Seg',
    finishedBadge: 'PRÉ-VENDA 2 ENCERRADA', finishedTitle: 'A Pré-Venda 3 chega em breve',
    finishedDesc: 'Novos preços e condições disponíveis em breve. Siga-nos no Instagram para não perder.',
  },
  plans: {
    chip: 'PLANOS DE PRÉ-VENDA', title1: 'ESCOLHA SEU', title2: 'PLANO',
    subtitle1: 'Preços especiais de lançamento.', subtitle2: 'Renováveis até 2 vezes.',
    preventa: 'PRÉ-VENDA 2', pesos: 'pesos chilenos', best: 'MELHOR VALOR',
    choose: 'ESCOLHER PLANO →', soldOut: 'ESGOTADO', processing: 'PROCESSANDO...',
    limited: 'VAGAS LIMITADAS', limitedDesc: 'Apenas 50 pré-vendas nesta etapa.',
    sold: '{n} vendidos', remain: 'RESTAM {n} VAGAS', total: '{n} total',
    names: { mensual: 'MENSAL', trimestral: 'TRIMESTRAL', semestral: 'SEMESTRAL', anual: 'ANUAL' },
    feat: {
      m1: '1 mês de acesso', m3: '3 meses de acesso', m6: '6 meses de acesso', m12: '12 meses de acesso',
      access: 'Acesso à academia', community: 'Comunidade Wave Project', renew: 'Renovável até 2 vezes',
    },
  },
  benefits: {
    chip: 'BENEFÍCIOS', title1: 'FAÇA PARTE', title2: 'DESDE O INÍCIO',
    items: [
      { t: 'PREÇO ESPECIAL', d: 'Garanta o preço de lançamento antes da abertura oficial. Apenas para pré-venda.' },
      { t: 'VAGA GARANTIDA', d: 'Assegure sua entrada na academia antes que as 50 vagas disponíveis se esgotem.' },
      { t: 'BENEFÍCIOS EXCLUSIVOS', d: 'Acesse vantagens e descontos exclusivos disponíveis apenas para membros da pré-venda.' },
      { t: 'TREINE COM PROPÓSITO', d: 'Junte-se a uma comunidade focada em disciplina, movimento e propósito desde o dia 1.' },
    ],
  },
  gym: {
    chip: 'NOSSA ACADEMIA', title1: 'PROJETADA PARA', title2: 'SUA MELHOR VERSÃO',
    p1: 'Wave Project Gym nasceu com um propósito claro: criar um espaço onde cada pessoa possa se transformar. Equipamentos de primeira, um ambiente projetado para te motivar e uma comunidade que te impulsiona.',
    p2: 'Localizada na Calle 6 235, Concón, nossa academia foi pensada para quem leva a sério seu treino e seu bem-estar.',
    feat: { equip: 'Equipamentos premium', ambiente: 'Ambiente motivador', funcional: 'Treinamento funcional', comunidad: 'Comunidade ativa' },
    cta: 'GARANTIR MINHA VAGA →', addr: 'Calle 6 235, Concón',
  },
  how: {
    chip: 'PROCESSO', title1: 'COMO', title2: 'FUNCIONA?',
    steps: [
      { t: 'ESCOLHA SEU PLANO', d: 'Selecione o plano que melhor se adapta aos seus objetivos e orçamento.' },
      { t: 'COMPRE ONLINE', d: 'Conclua sua compra 100% online com segurança pelo MercadoPago.' },
      { t: 'GARANTA SUA VAGA', d: 'Receba a confirmação e seu número de vaga entre os 50 do lançamento.' },
      { t: 'COMECE SUA MUDANÇA', d: 'Prepare-se para treinar no Wave Project Gym desde o primeiro dia.' },
    ],
  },
  faq: {
    chip: 'FAQ', title1: 'PERGUNTAS', title2: 'FREQUENTES',
    intro: 'Tem dúvidas? Aqui você encontrará as respostas mais comuns sobre a pré-venda.',
    contact: 'CONTATAR →',
    items: [
      { q: 'Quando meu plano começa?', a: 'Seu plano começa a partir da abertura oficial do Wave Project Gym. Você receberá um e-mail com a data exata de início com antecedência.' },
      { q: 'A pré-venda é renovável?', a: 'Sim. Seu preço de pré-venda pode ser renovado até 2 vezes, garantindo o preço especial de lançamento nas suas próximas renovações.' },
      { q: 'Posso trocar de plano depois?', a: 'Uma vez concluída a compra, o plano é definitivo para esta etapa. Você poderá mudar de modalidade em renovações futuras.' },
      { q: 'O que acontece se as 50 vagas se esgotarem?', a: 'Uma vez esgotadas as 50 vagas, não serão vendidas mais pré-vendas nesta etapa. Recomendamos garantir a sua agora.' },
      { q: 'Quais métodos de pagamento vocês aceitam?', a: 'Aceitamos todos os meios disponíveis no Chile pelo MercadoPago: cartão de débito, crédito, transferência e mais.' },
      { q: 'Posso congelar meu plano?', a: 'As condições de congelamento estarão disponíveis quando a academia abrir. A equipe do Wave Project Gym informará os detalhes.' },
    ],
  },
  footer: {
    ctaBig: '50 VAGAS', ctaTitle1: 'GARANTA SEU LUGAR', ctaTitle2: 'ANTES QUE SE ESGOTEM',
    ctaBtn: 'COMPRAR PRÉ-VENDA AGORA', securePay: 'Pagamento 100% seguro via MercadoPago',
    contact: 'CONTATO', site: 'SITE', rights: '© 2025 WAVE PROJECT GYM. TODOS OS DIREITOS RESERVADOS.',
    terms: 'Termos e condições', privacy: 'Políticas de privacidade',
    words: { mov: 'MOVIMENTO', disc: 'DISCIPLINA', prop: 'PROPÓSITO' },
  },
};
