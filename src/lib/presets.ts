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

// Guia estratégico por nicho (aba 5). Conteúdo qualitativo de consultoria:
// o passo a passo do lead à venda, problemas comuns e rotina do dono.
// Nada aqui é estatística — são práticas comuns do nicho, em linguagem simples.
export type EtapaFunil = {
  emoji: string;
  titulo: string;
  oQueE: string;
  numeroPraMedir: string;
  acoes: string[];
};
export type ProblemaComum = {
  problema: string;
  realidade: string; // o "choque de realidade" — o que o dono controla de verdade
  caminho: string[];
};
export type Estrategia = {
  intro: string;
  principio: string; // a frase-mãe da aba
  cliente: { quemE: string; ondeEsta: string; oQueEleQuer: string };
  funil: EtapaFunil[];
  problemas: ProblemaComum[];
  rotina: { frequencia: string; duracao: string; acoes: string[] }[];
};

export type Preset = {
  id: string;
  nome: string;
  emoji: string;
  // Matiz (hue) OKLCH que dá a cor de marca deste nicho (0-360).
  // A paleta inteira do app gira em torno deste valor — ver --hue-rot em styles.css.
  corHue: number;
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
  // Guia estratégico (aba 5) — começamos pela açaiteria; os demais nichos
  // ganham o seu conforme o formato for validado.
  estrategia?: Estrategia;
  // Insights do nicho pra capacidade ociosa (aba 2). Presença deste campo
  // liga o card "Potencial da sua capacidade" — açaiteria primeiro.
  insightsCapacidade?: string[];
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
    corHue: 295, // roxo/violeta — a cor do próprio açaí
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
    insightsCapacidade: [
      "No açaí, capacidade parada quase nunca é problema de produção — é demanda: pouca gente vendo você (alcance), atrito na hora de pedir (conversão) ou cliente que não volta (recompra).",
      "O pico (noite e fim de semana) costuma encher sozinho. O espaço real está nos horários e dias mortos: promoção de meio de semana e da tarde vende pra capacidade que hoje você joga fora.",
      "Capacidade não estoca: o copo que não saiu hoje não volta amanhã — cada dia ocioso é margem perdida pra sempre.",
      "Antes de aumentar a loja, encha a que existe: alcance → conversão → recompra, nessa ordem. O mapa completo está na aba 🧭 Estratégia.",
    ],
    estrategia: {
      intro:
        "Açaí não se vende sozinho o ano inteiro. Quem vive de açaí vive de quatro coisas: ser lembrado na hora da vontade, facilitar o pedido, aumentar o copo e fazer o cliente voltar. Esta página é o mapa — as outras abas são o painel de números desse mapa.",
      principio:
        "Você não controla o clima, o iFood nem o concorrente. Você controla a sua esteira de produtos, as suas ofertas e os seus números. Energia vai no que você controla.",
      cliente: {
        quemE:
          "Jovens e famílias num raio de ~2 km, pedindo no fim da tarde e à noite, com pico no calor e no fim de semana. Açaí é compra por desejo, não por necessidade — o cliente precisa LEMBRAR de você na hora da vontade.",
        ondeEsta:
          "Instagram (onde o desejo nasce, com foto e vídeo), iFood/delivery (conveniência), Google Maps (quem busca 'açaí perto de mim') e WhatsApp (onde mora a recompra). Sua loja precisa existir bem nos quatro.",
        oQueEleQuer:
          "Foto que dá vontade, preço fácil de entender (combo pronto), pedido sem atrito, entrega rápida e o copo do jeito dele — os adicionais são metade da experiência.",
      },
      funil: [
        {
          emoji: "📣",
          titulo: "Atrair — ser visto por quem tem vontade",
          oQueE: "Fazer quem mora perto lembrar que você existe, principalmente nos horários de desejo (tarde/noite, calor, fim de semana).",
          numeroPraMedir:
            "Alcance por semana e clientes novos por mês — o painel lá embaixo mostra quantas pessoas você precisa alcançar pra sua meta.",
          acoes: [
            "Poste o produto, não o logo: vídeo curto montando o copo vende mais que arte bonita de feed.",
            "Google Maps completo (fotos reais, horário certo, responder avaliações) — é onde o 'açaí perto de mim' te encontra de graça.",
            "Impulsione anúncio nos dias quentes e fins de semana — anúncio amplifica desejo que já existe, não cria desejo no frio.",
          ],
        },
        {
          emoji: "🛒",
          titulo: "Converter — transformar vontade em pedido",
          oQueE: "Tirar todo o atrito: quem viu e quis precisa conseguir pedir em segundos, sem pensar.",
          numeroPraMedir:
            "Conversão: a cada 100 pessoas que veem, quantas pedem (ajuste o seu número real na aba Ajustes).",
          acoes: [
            "Cardápio simples: 3 combos prontos com preço fechado + a opção 'monte o seu'. Quem precisa escolher demais, desiste.",
            "Oferta de primeira compra (ex.: 1 adicional grátis no primeiro pedido) pra destravar quem nunca provou o seu açaí.",
            "Link de pedido fixado na bio do Instagram e WhatsApp que responde rápido — cada hora sem resposta é pedido no concorrente.",
          ],
        },
        {
          emoji: "🍧",
          titulo: "Aumentar o copo — ticket médio",
          oQueE: "O lucro do açaí mora nos adicionais e no tamanho. Vender mais pra quem já está comprando é a venda mais barata que existe.",
          numeroPraMedir:
            "Ticket médio — compare com a faixa de mercado na aba Meta e use a ancoragem de preço (final 9,90).",
          acoes: [
            "Sugira UM adicional na finalização de todo pedido ('quer Nutella por + R$ 4?'). Quem sugere, vende; quem não sugere, não vende.",
            "Combo casal/família: mais volume num pedido só, com um custo de entrega único.",
            "Monte a vitrine de preços com ancoragem: o tamanho do meio deve parecer o melhor negócio óbvio.",
          ],
        },
        {
          emoji: "🔁",
          titulo: "Fazer voltar — recompra",
          oQueE: "Cliente que volta é venda sem custo de anúncio — é onde a margem do açaí realmente mora.",
          numeroPraMedir:
            "De cada 10 pedidos do mês, quantos são de quem já comprou antes? Anote toda semana — é o número mais importante da loja.",
          acoes: [
            "Cartão fidelidade simples (físico ou pelo WhatsApp): o 10º copo é grátis. Custa um copo, segura um cliente.",
            "Lista VIP no WhatsApp com promoção exclusiva nos dias fracos (terça, quarta) — promoção pra quem já é fã, não pra estranho.",
            "Peça avaliação no Google/iFood logo depois do pedido bom — avaliação de hoje é cliente novo de amanhã.",
          ],
        },
      ],
      problemas: [
        {
          problema: "Chegou o inverno e a venda caiu",
          realidade:
            "Você não controla o clima — controla a sua esteira de produtos e a sua base de clientes. Reclamar do frio não paga boleto; cardápio de estação paga.",
          caminho: [
            "Crie a linha de inverno: itens de conforto (brownie com sorvete, bolo, chocolate, cremes) pra base fiel continuar comprando de você.",
            "Aperte a recompra: no frio, promoção exclusiva pra lista VIP rende mais que anúncio pra estranho.",
            "Use a baixa pra arrumar a casa — fornecedor, fotos, cardápio, treino de atendimento — e chegue no verão pronto pra colher.",
          ],
        },
        {
          problema: "Só vendo pelo iFood e a taxa come tudo",
          realidade:
            "Dentro do app, o cliente é da plataforma, não seu. A taxa é o aluguel dessa vitrine — cara demais pra ser sua única porta.",
          caminho: [
            "Use o app pra ser DESCOBERTO e migre o recorrente pro seu canal: bilhete no pedido com seu WhatsApp e um cupom pra pedir direto.",
            "Retirada no balcão com vantagem (adicional grátis): sem taxa, sem entregador, cliente na sua loja.",
            "Preço do app pode refletir a taxa (prática comum do mercado) — o desconto de pedir direto vira seu argumento.",
          ],
        },
        {
          problema: "Abriu um concorrente mais barato do lado",
          realidade:
            "Guerra de preço no açaí é corrida pro buraco: com CMV de ~40%, quem corta preço corta a própria margem. Você não controla o preço dele — controla o valor do seu copo.",
          caminho: [
            "Não iguale o preço: diferencie o copo — adicionais que ele não tem, padrão de qualidade, atendimento com nome e sorriso.",
            "Deixe a ancoragem trabalhar: combos com final 9,90 e um tamanho 'premium' na vitrine que valoriza os do meio.",
            "Sua lista VIP é sua muralha: quem se sente cliente da casa não troca você por R$ 2.",
          ],
        },
        {
          problema: "Não sei se estou ganhando dinheiro de verdade",
          realidade:
            "No açaí, a margem nasce ou morre no topping. Copo 'monte você mesmo' sem porção medida pode jogar seu CMV muito acima dos 40% sem você perceber.",
          caminho: [
            "Padronize e pese as porções de adicional — é a diferença entre lucro e prejuízo no mesmo copo.",
            "Anote vendas e ticket toda semana (10 minutos) e confira o CMV real todo mês (insumos ÷ faturamento).",
            "Jogue os números reais aqui na calculadora e compare com o plano — o desvio é o seu alarme antecipado.",
          ],
        },
        {
          problema: "Fim de mês do cliente = loja vazia",
          realidade:
            "A renda do seu bairro tem ciclo (5º dia útil, fim de mês apertado). Você não muda o salário de ninguém — muda a sua agenda de ofertas pra acompanhar o ciclo.",
          caminho: [
            "Crie um dia fixo de promoção na semana fraca (ex.: 'terça em dobro') — hábito enche loja vazia.",
            "Combo de entrada mais barato no fim do mês; premium e lançamentos na primeira quinzena.",
            "Programe impulsionamento pros dias que já são bons: anúncio amplifica movimento, não ressuscita dia morto.",
          ],
        },
      ],
      rotina: [
        {
          frequencia: "Toda semana",
          duracao: "10 minutos",
          acoes: [
            "Anote: quantos pedidos, ticket médio, quantos clientes novos vs. que voltaram.",
            "Compare com o plano do mês aqui na calculadora — está no ritmo?",
            "Escolha UMA ação da esteira acima pra semana seguinte (uma bem feita > cinco pela metade).",
          ],
        },
        {
          frequencia: "Todo mês",
          duracao: "30 minutos",
          acoes: [
            "Calcule o CMV real: tudo que gastou com insumos ÷ tudo que faturou.",
            "Revise preços e combos — a ancoragem (final 9,90) continua em dia?",
            "Teste UMA oferta nova e meça: repetiu resultado, vira rotina; não repetiu, descarta sem dó.",
          ],
        },
      ],
    },
  },
  {
    id: "auto-center",
    nome: "Auto Center",
    emoji: "🔧",
    corHue: 232, // azul — precisão técnica, multi-serviço
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
    corHue: 48, // âmbar/dourado — ferramentas, calor industrial
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
    corHue: 332, // rosa/magenta — elegância, universo da beleza
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
    corHue: 15, // coral — compra por impulso, mais vibrante que o salão
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
    corHue: 195, // verde-azulado (teal) — limpeza e confiança, cor clássica de saúde
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
    corHue: 125, // verde — natural, artesanal, caseiro
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

// ---------------------------------------------------------------------------
// Custo de contratação CLT — dados de fonte legal (não são estimativa).
//
// Salário mínimo nacional 2026: R$ 1.621,00 (Decreto nº 12.797/2025).
// É só o piso nacional — o salário real da vaga varia por função e região,
// por isso o campo é editável e o default é o mínimo.
export const SALARIO_MINIMO_2026 = 1621;

// Encargos sobre o salário para empresa do SIMPLES NACIONAL (o regime de
// praticamente todo pequeno negócio destes nichos):
//   FGTS ................................ 8,00%
//   Provisão de 13º salário (1/12) ...... 8,33%
//   Provisão de férias + 1/3 ........... 11,11%
//   Provisão de multa rescisória FGTS ... 4,00%
//   Total ............................. ~31,44%
// No Simples NÃO existe INSS patronal à parte (os 20% já estão embutidos na
// guia DAS). Empresa fora do Simples (Lucro Presumido/Real) paga
// +~28,8 p.p. de INSS patronal + RAT/terceiros — o card avisa isso.
export const ENCARGOS_SIMPLES_PCT = 31.44;
export const ENCARGOS_BREAKDOWN = [
  { nome: "FGTS", pct: 8 },
  { nome: "Provisão de 13º salário (1/12)", pct: 8.33 },
  { nome: "Provisão de férias + 1/3", pct: 11.11 },
  { nome: "Provisão de multa rescisória do FGTS", pct: 4 },
];
