// Presets multi-nicho para o Planejador de Receita.
// IMPORTANTE: os valores aqui são pontos de partida. Onde a fonte de mercado
// não é confiável, `avisoConfianca` está preenchido e o banner amarelo
// aparece no app. Não invente números — se faltar dado, deixe defaults
// genéricos e reforce no aviso que o usuário precisa validar.

export type MixItem = { nome: string; pctReceita: number; margem: number };
export type Especialidade = { nome: string; ticket: number };
export type ProdutoGuia = {
  nome: string;
  ticket: number;
  custoInsumosPct: number;
  adicionais: string[];
};

export type EstruturaCusto = {
  comissaoPct: number; // % do ticket
  cmvPct: number; // % do ticket (insumos / matéria-prima)
  aluguelPct: number; // % do faturamento
  aluguelFixo: number; // R$ fixo/mês (alternativa)
  taxaCartaoPct: number; // % do ticket
};

export type Capacidade = {
  unidade: string;
  valorReferencia: number;
  periodo: "dia" | "mes";
};

export type Rotulos = {
  unidadeVenda: string; // "pedido", "consulta", "atendimento", "serviço"
  profissional: string; // "atendente", "profissional", "mecânico", "médico"
};

export type Preset = {
  id: string;
  nome: string;
  emoji: string;
  ticketMin: number;
  ticketMax: number;
  ticketInicial: number; // média
  cacMin: number;
  cacMax: number;
  convMin: number;
  convMax: number;
  estruturaCusto: EstruturaCusto;
  capacidade: Capacidade;
  rotulos: Rotulos;
  avisoConfianca: string | null;
  mixReceita?: MixItem[];
  especialidades?: Especialidade[];
  produtoGuia?: ProdutoGuia;
  // metadados extras para exibição informativa
  notasReferencia?: string[];
};

const zeroCusto: EstruturaCusto = {
  comissaoPct: 0,
  cmvPct: 0,
  aluguelPct: 0,
  aluguelFixo: 0,
  taxaCartaoPct: 0,
};

export const PRESETS: Preset[] = [
  {
    id: "acaiteria",
    nome: "Açaiteria",
    emoji: "🍧",
    ticketMin: 45,
    ticketMax: 60,
    ticketInicial: 53,
    cacMin: 8,
    cacMax: 15,
    convMin: 2,
    convMax: 5,
    estruturaCusto: { ...zeroCusto, cmvPct: 40 },
    capacidade: { unidade: "pedidos possíveis por dia", valorReferencia: 60, periodo: "dia" },
    rotulos: { unidadeVenda: "pedido", profissional: "atendente" },
    avisoConfianca: null,
    notasReferencia: [
      "CMV típico: 40% (margem bruta ~60%).",
      "CAC e conversão são estimativas genéricas de delivery/food — ajuste com seus dados reais.",
    ],
  },
  {
    id: "auto-center",
    nome: "Auto Center",
    emoji: "🔧",
    ticketMin: 700,
    ticketMax: 1500,
    ticketInicial: 1100,
    cacMin: 30,
    cacMax: 80,
    convMin: 2,
    convMax: 5,
    estruturaCusto: zeroCusto,
    capacidade: {
      unidade: "horas de elevador disponíveis por dia",
      valorReferencia: 16,
      periodo: "dia",
    },
    rotulos: { unidadeVenda: "serviço", profissional: "mecânico" },
    avisoConfianca:
      "Ticket médio estimado por multiplicador (2-3x oficina simples), não observado diretamente. Ajuste com seus próprios dados assim que possível. Conversão é estimativa genérica.",
    mixReceita: [
      { nome: "Mecânica geral", pctReceita: 40, margem: 40 },
      { nome: "Alinhamento/balanceamento", pctReceita: 22, margem: 67 },
      { nome: "Ar-condicionado", pctReceita: 17, margem: 57 },
      { nome: "Revisão preventiva", pctReceita: 12, margem: 42 },
      { nome: "Diagnóstico", pctReceita: 9, margem: 72 },
    ],
  },
  {
    id: "oficina",
    nome: "Oficina Mecânica",
    emoji: "🛠️",
    ticketMin: 350,
    ticketMax: 800,
    ticketInicial: 575,
    cacMin: 30,
    cacMax: 80,
    convMin: 2,
    convMax: 5,
    estruturaCusto: zeroCusto,
    capacidade: {
      unidade: "dias-elevador disponíveis por mês",
      valorReferencia: 44,
      periodo: "mes",
    },
    rotulos: { unidadeVenda: "serviço", profissional: "mecânico" },
    avisoConfianca: null,
    notasReferencia: [
      "Ticket 350–800 (oficina de bairro). Especializada pode passar de R$ 1.200.",
      "Taxa de retorno de clientes: 55–70%.",
      "Taxa de conversão de orçamento em serviço: 55–75%.",
      "Faturamento por elevador: R$ 10.000–25.000/mês.",
    ],
  },
  {
    id: "salao",
    nome: "Salão de Beleza / Estúdio de Maquiagem",
    emoji: "💇",
    ticketMin: 80,
    ticketMax: 150,
    ticketInicial: 115,
    cacMin: 10,
    cacMax: 25,
    convMin: 2,
    convMax: 5,
    estruturaCusto: {
      comissaoPct: 50,
      cmvPct: 7,
      aluguelPct: 0,
      aluguelFixo: 0,
      taxaCartaoPct: 2.5,
    },
    capacidade: {
      unidade: "horas-cadeira disponíveis por mês",
      valorReferencia: 176,
      periodo: "mes",
    },
    rotulos: { unidadeVenda: "atendimento", profissional: "profissional" },
    avisoConfianca:
      "O ticket médio deste nicho não tem uma fonte de mercado confiável — é uma estimativa de partida. CAC e conversão também são valores genéricos. Verifique os valores reais praticados na sua região antes de usar para decisões importantes.",
    notasReferencia: [
      "Comissão típica: 50% (Lei do Salão Parceiro).",
      "CMV (insumos): 5–10%.",
      "Taxa de cartão: 2–3%.",
    ],
  },
  {
    id: "quiosque",
    nome: "Quiosque de Produtos de Beleza",
    emoji: "💄",
    ticketMin: 40,
    ticketMax: 80,
    ticketInicial: 60,
    cacMin: 5,
    cacMax: 15,
    convMin: 2,
    convMax: 5,
    estruturaCusto: {
      comissaoPct: 0,
      cmvPct: 0,
      aluguelPct: 25,
      aluguelFixo: 0,
      taxaCartaoPct: 2.5,
    },
    capacidade: {
      unidade: "atendimentos possíveis por dia",
      valorReferencia: 40,
      periodo: "dia",
    },
    rotulos: { unidadeVenda: "venda", profissional: "atendente" },
    avisoConfianca:
      "O ticket médio e a taxa de conversão de passantes deste nicho não têm fonte de mercado confiável — são estimativas de partida. CAC também é genérico. Verifique os valores reais do seu shopping/região antes de usar para decisões importantes.",
    notasReferencia: ["Aluguel típico de quiosque: 20–30% do faturamento."],
  },
  {
    id: "clinica",
    nome: "Clínica Médica",
    emoji: "🩺",
    ticketMin: 120,
    ticketMax: 120,
    ticketInicial: 120,
    cacMin: 20,
    cacMax: 60,
    convMin: 2,
    convMax: 5,
    estruturaCusto: { ...zeroCusto, taxaCartaoPct: 2.5 },
    capacidade: {
      unidade: "consultas disponíveis na agenda por mês",
      valorReferencia: 320,
      periodo: "mes",
    },
    rotulos: { unidadeVenda: "consulta", profissional: "médico" },
    avisoConfianca:
      "CAC e taxa de no-show para clínicas médicas não têm fonte de mercado confiável — são estimativas de partida. O ticket inicial (R$ 120) reflete consulta particular popular acessível. Verifique os números reais da sua clínica/região antes de usar para decisões importantes.",
    especialidades: [
      { nome: "Clínica Geral", ticket: 120 },
      { nome: "Ginecologia", ticket: 120 },
      { nome: "Dermatologia", ticket: 120 },
      { nome: "Ortopedia", ticket: 120 },
      { nome: "Pediatria", ticket: 120 },
      { nome: "Cardiologia", ticket: 120 },
    ],
  },
  {
    id: "pequeno-produtor",
    nome: "Pequeno Produtor de Alimentos",
    emoji: "🧁",
    ticketMin: 20,
    ticketMax: 35,
    ticketInicial: 27,
    cacMin: 5,
    cacMax: 12,
    convMin: 3,
    convMax: 8,
    estruturaCusto: { ...zeroCusto, cmvPct: 40 },
    capacidade: {
      unidade: "unidades produzidas por semana",
      valorReferencia: 120,
      periodo: "mes",
    },
    rotulos: { unidadeVenda: "unidade", profissional: "produtor" },
    avisoConfianca:
      "Este nicho abrange desde bolo no pote até doces artesanais em geral. Todos os valores são estimativas de partida — ajuste com seus dados reais. Se você vende apenas em datas específicas (páscoa, natal), considere ajustar a capacidade e diasVenda de acordo.",
    produtoGuia: {
      nome: "Bolo no pote",
      ticket: 20,
      custoInsumosPct: 40,
      adicionais: ["Cookie", "Brownie", "Trufa", "Bolo grande sob encomenda"],
    },
  },
];

export const getPreset = (id: string): Preset =>
  PRESETS.find((p) => p.id === id) ?? PRESETS[0];
