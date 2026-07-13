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
    estrategia: {
      intro:
        "Quiosque de beleza vive de fluxo. Você paga um aluguel altíssimo (20–30% do faturamento) pra estar onde a pessoa passa — se ela passa e não para, você paga aluguel pra nada. O jogo é converter passante em cliente, subir o ticket com kit e criar recorrência pra não depender só do fluxo do shopping.",
      principio:
        "Você não controla o movimento do shopping, o clima nem se o cinema tá cheio. Controla a vitrine, a abordagem, a oferta do dia e o WhatsApp que traz o cliente de volta. Cada passante ignorado é aluguel queimado.",
      cliente: {
        quemE:
          "Mulher (majoritariamente) entre 18 e 45, decidindo por impulso, que passou pra fazer outra coisa (comer, cinema, banco). Compra pequena, emocional, testa produto novo — mas só se algo chamar atenção nos primeiros 3 segundos.",
        ondeEsta:
          "Passando na frente do quiosque (canal #1), Instagram local (marca 'em [shopping X]'), TikTok de review de beleza e no WhatsApp (onde a recompra mora — quiosque sem base de WhatsApp é quiosque refém do shopping).",
        oQueEleQuer:
          "Descoberta rápida ('experimenta aqui'), preço claro, kit que parece um presente pra si mesma e sensação de barganha (leva 3 paga 2, brinde surpresa).",
      },
      funil: [
        {
          emoji: "👁️",
          titulo: "Parar o passante — vitrine e primeiros 3 segundos",
          oQueE: "Quem não para, não compra. A vitrine, a iluminação e a cara da atendente decidem se a pessoa desacelera ou passa reto.",
          numeroPraMedir: "Quantas pessoas passaram vs. quantas pararam no quiosque por hora (contagem manual amostral 1x por semana).",
          acoes: [
            "Um produto-âncora bem iluminado na quina, com preço grande e visível — não vitrine cheia de tudo.",
            "Atendente em pé na frente, nunca sentada olhando celular. Sorriso e uma frase-gatilho ('experimenta o novo hidratante?').",
            "Cheiro conta: difusor com fragrância marcante para 3 metros de raio. Olfato para o passante que a vitrine perdeu.",
          ],
        },
        {
          emoji: "🤝",
          titulo: "Abordar e testar — do 'só olhando' pra mão no produto",
          oQueE: "Cliente que pega o produto na mão compra 5x mais que quem só olha. Abordagem certa é convidar pra experimentar, não pra ouvir vendedor.",
          numeroPraMedir: "De 10 que pararam, quantas testam algum produto.",
          acoes: [
            "Sempre ofereça teste (mão, braço, um cheirinho). 'Posso te mostrar como esse funciona?' abre porta sem pressionar.",
            "Fale valor, não preço, primeiro: 'esse hidrata por 24h, cabe na bolsa' — o preço vem depois do encanto.",
            "Se ela recusar, entregue um cartão com QR do Instagram/WhatsApp: 'quando quiser, olha nossas promoções'.",
          ],
        },
        {
          emoji: "🛍️",
          titulo: "Fechar a venda — combo antes de único",
          oQueE: "Ticket de um item só não sustenta o aluguel. A venda tem que nascer combo — 2 unidades, kit, 'leva 3 paga 2'.",
          numeroPraMedir: "Ticket médio do quiosque (na aba Ajustes).",
          acoes: [
            "Nunca ofereça 1 item: sempre 'leva a dupla que sai por X' ou 'com o segundo por metade'.",
            "Kit-presente montado e embalado na hora — vira ideia para 'já que estou aqui, dou pra minha mãe também'.",
            "Preço com âncora: um produto premium caro na vitrine faz o kit médio parecer barato.",
          ],
        },
        {
          emoji: "📲",
          titulo: "Capturar contato — do caixa pro WhatsApp",
          oQueE: "Cliente que sai sem virar contato é cliente do shopping, não seu. Sua base de WhatsApp é o único ativo que sobrevive se o quiosque mudar de ponto.",
          numeroPraMedir: "% de clientes do mês que entraram na lista de WhatsApp.",
          acoes: [
            "No caixa, sempre: 'quer entrar na lista VIP? Toda sexta mando o desconto do fim de semana'.",
            "Incentivo pequeno pra entrar: brinde de amostra ou cupom de 10% na próxima. Custa centavos, vale ouro.",
            "Nota fiscal no e-mail/WhatsApp já captura o contato de brinde — use a lei a favor.",
          ],
        },
        {
          emoji: "🔁",
          titulo: "Fazer voltar — recompra sem depender do fluxo",
          oQueE: "Segunda-feira chuvosa? Cliente da lista VIP vem quando o shopping tá vazio. É a sua receita previsível.",
          numeroPraMedir: "% do faturamento que veio de clientes já cadastrados (repetição).",
          acoes: [
            "Toda sexta: cardápio da semana com desconto exclusivo pra lista VIP no WhatsApp.",
            "Aniversário do cliente = cupom de brinde. Simples e emocional.",
            "Segmente a lista: quem comprou hidratante volta em 60 dias — dispare oferta 45 dias depois.",
          ],
        },
      ],
      problemas: [
        {
          problema: "Movimento do shopping caiu e minha venda foi junto",
          realidade:
            "Você não controla âncora do shopping, cinema fechando ou obra na entrada. Controla a sua base própria (WhatsApp, Instagram) e as ações de reativação.",
          caminho: [
            "Ative a lista VIP com promoção-relâmpago pra trazer quem já é cliente — não depende do fluxo.",
            "Faça live/story mostrando os produtos ao vivo do quiosque nos dias fracos — traz gente que já ia passar longe.",
            "Renegocie o aluguel: com o fluxo caindo, o shopping também tem interesse em manter você — traga números.",
          ],
        },
        {
          problema: "Vendo pouco no fim do mês (todo mês)",
          realidade:
            "A renda do seu cliente tem ciclo. Você não muda o salário dele, mas muda a sua agenda de ofertas pra pegar o começo do mês forte e sobreviver o fim.",
          caminho: [
            "Lançamento e kit premium na primeira quinzena. Produto de entrada e leve-3-pague-2 na segunda quinzena.",
            "Parcelamento sem juros nos últimos 10 dias do mês — desbloqueia compra que ia esperar.",
            "Programe disparo pra lista VIP no 5º dia útil: salário caiu, oferta na cara.",
          ],
        },
        {
          problema: "Concorrente do quiosque em frente vende mais barato",
          realidade:
            "Guerra de preço em quiosque destrói margem porque o aluguel não cai. Você não controla o preço dele — controla a experiência, o kit e a base.",
          caminho: [
            "Não iguale preço unitário: monte kits que ele não tem, com embalagem-presente.",
            "Atendimento com nome, memória do gosto do cliente, WhatsApp que responde — o que ele não faz é sua vantagem.",
            "Sua lista VIP é sua muralha: cliente que se sente da casa não atravessa 10 metros por R$ 5.",
          ],
        },
        {
          problema: "Faturamento parece bom mas o mês fecha ruim",
          realidade:
            "Aluguel de quiosque come 20–30% direto. Se o CMV subiu e o ticket não subiu junto, você trabalhou o mês pro shopping.",
          caminho: [
            "Preencha custos reais na aba Ajustes (aluguel, taxa cartão, comissão, CMV) — a calculadora mostra o ponto de equilíbrio real.",
            "Se ticket médio está abaixo da meta, foco imediato em kit e leve-3-pague-2. Vender 1 unidade por vez em quiosque é prejuízo.",
            "Renegocie aluguel percentual: em shopping fraco, muitos aceitam 'mínimo garantido + %' menor.",
          ],
        },
        {
          problema: "Não sei quantas pessoas preciso alcançar pra bater a meta",
          realidade:
            "Sem contar quantos passantes viram parada, teste, compra e recorrência, é impossível ajustar. Você fica no achismo enquanto o aluguel vence dia 10.",
          caminho: [
            "Uma vez por semana, conte manualmente por 1 hora: passantes, paradas, testes, compras. Extrapole pro mês.",
            "Preencha essas taxas na aba Ajustes — a calculadora mostra quantas pessoas precisam PARAR pra você bater a meta.",
            "Se a taxa de parada é o gargalo, mexa em vitrine. Se é a de fechamento, treine abordagem. Cada etapa tem uma ação diferente.",
          ],
        },
      ],
      rotina: [
        {
          frequencia: "Toda semana",
          duracao: "10 minutos",
          acoes: [
            "Anote: faturamento, ticket médio, quantos entraram na lista VIP, ranking do produto mais vendido.",
            "Dispare a oferta de sexta pra lista VIP.",
            "Troque a vitrine/produto-âncora se o da semana ficou fraco.",
          ],
        },
        {
          frequencia: "Todo mês",
          duracao: "45 minutos",
          acoes: [
            "Feche as taxas do funil (paradas, testes, vendas) e compare com o Plano do mês.",
            "Cheque o CMV real do mix vendido e se o ticket está acompanhando os aumentos de custo.",
            "Reveja a divisão do mix (entrada / médio / premium) e reposicione a vitrine.",
          ],
        },
      ],
    },
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
    estrategia: {
      intro:
        "Clínica particular popular não vive de médico bom — vive de agenda cheia. E agenda cheia é resultado de conta simples: quantas pessoas veem, quantas ligam, quantas marcam, quantas comparecem, quantas voltam. O jogo é dominar essa conta e transformar em receita previsível.",
      principio:
        "Você não controla convênio, plano do governo nem o preço do concorrente da esquina. Controla a sua agenda, a taxa de comparecimento e o retorno do paciente. Receita previsível nasce quando cada etapa do funil vira número medido — não achismo.",
      cliente: {
        quemE:
          "Paciente que não tem plano de saúde ou tem plano ruim, quer resolver rápido, preço acessível, sem burocracia. Decide por proximidade, indicação e reputação online. Sensível a preço, mas ainda mais sensível a demora e mau atendimento.",
        ondeEsta:
          "Google (busca 'clínica popular perto de mim'), Google Maps e reviews, Instagram/Facebook local, WhatsApp (onde a consulta é agendada de verdade) e boca-a-boca do bairro.",
        oQueEleQuer:
          "Preço claro no anúncio, atendimento rápido no WhatsApp, horário perto do trabalho ou fim de tarde, médico que escuta e resultado (receita, exame pedido) na hora — não 'volta na semana que vem pra ver o exame'.",
      },
      funil: [
        {
          emoji: "🔍",
          titulo: "Ser encontrado — quem procura precisa achar você",
          oQueE: "Consulta popular é procurada, não empurrada. Se você não aparece no Google e no Maps quando alguém busca, não existe.",
          numeroPraMedir: "Visualizações no Google Meu Negócio e cliques no botão 'ligar/WhatsApp' por semana.",
          acoes: [
            "Google Meu Negócio 100% completo: fotos reais da clínica, especialidades, preços de consulta, horário. É seu maior gerador de lead gratuito.",
            "Peça avaliação no Google a todo paciente satisfeito no fim da consulta — meta: 4,7+ estrelas com 100+ reviews.",
            "Anúncio pago local no Google e Instagram por raio (3–5 km) por especialidade — preço no anúncio filtra quem já aceita seu ticket.",
          ],
        },
        {
          emoji: "💬",
          titulo: "Virar contato — do clique ao WhatsApp",
          oQueE: "Quem viu e não escreveu, esqueceu. Cada segundo de atrito entre 'quero marcar' e 'consegui falar com alguém' vira paciente do concorrente.",
          numeroPraMedir: "De 10 visitantes do Google, quantos chamam no WhatsApp/telefone.",
          acoes: [
            "Botão de WhatsApp em tudo: Google, site, Instagram. Nada de formulário de contato.",
            "Resposta em até 5 minutos no horário comercial. Mais que isso, taxa de agendamento despenca.",
            "Script de resposta pronto: cumprimento + especialidade disponível + preço + próximos 3 horários. Fecha na primeira mensagem.",
          ],
        },
        {
          emoji: "📅",
          titulo: "Agendar — transformar interesse em compromisso",
          oQueE: "'Vou ver com a família e volto' é 80% de perda. Agendamento firme tem data, hora e, idealmente, confirmação por WhatsApp.",
          numeroPraMedir: "De 10 conversas no WhatsApp, quantas viram consulta marcada.",
          acoes: [
            "Ofereça só 2 horários por vez ('tenho quarta 15h ou quinta 10h, qual prefere?') — mais opções paralisam a decisão.",
            "Preço fechado sem pegadinha na hora de agendar. Se tem taxa de retorno grátis, diga na hora — isso fecha venda.",
            "Registre TODO agendamento numa planilha ou sistema simples com fonte (Google, indicação, Instagram): você precisa saber de onde vem cada consulta.",
          ],
        },
        {
          emoji: "🚪",
          titulo: "Comparecer — combater o no-show",
          oQueE: "Agenda cheia com 30% de faltosos é agenda de mentira. Cadeira vazia com médico esperando é o custo mais alto da clínica.",
          numeroPraMedir: "Taxa de comparecimento: agendados que efetivamente vieram ÷ total agendado.",
          acoes: [
            "Confirmação automática por WhatsApp 24h antes: 'confirma sua consulta amanhã 15h respondendo SIM'. Quem não confirma, libera a vaga.",
            "Overbooking calculado nos horários de pico: se historicamente falta 20%, agende 20% a mais nesse horário.",
            "Lista de espera ativa: sempre 3–5 pacientes prontos pra encaixar quando alguém desmarca.",
          ],
        },
        {
          emoji: "🔁",
          titulo: "Fazer voltar — retorno e recorrência",
          oQueE: "Paciente satisfeito vira exame, retorno e indicação — sem custo de anúncio nenhum. É onde a margem real da clínica mora.",
          numeroPraMedir: "% de consultas do mês que são retorno vs. primeira vez.",
          acoes: [
            "Já saia da consulta com o próximo passo agendado: exame, retorno, encaminhamento. Não deixe pro paciente 'ligar depois'.",
            "Pacote de acompanhamento por doença crônica (hipertensão, diabetes, dermatologia estética): receita recorrente previsível.",
            "Programa de indicação: paciente que indica alguém que consulta ganha desconto no próximo retorno.",
          ],
        },
      ],
      problemas: [
        {
          problema: "Agenda parece cheia mas o dia rende pouco (muito no-show)",
          realidade:
            "Você não controla se o paciente vai comparecer — controla a confirmação, o overbooking e a lista de espera. No-show ignorado é caixa jogado fora todo dia.",
          caminho: [
            "Meça a taxa por dia da semana / horário. Segunda de manhã falta mais que quinta à tarde? Ajuste overbooking.",
            "Confirmação automática 24h antes é obrigatória. Quem não confirmar em X horas, a vaga é oferecida à lista de espera.",
            "Considere cobrar taxa simbólica de reserva descontada na consulta — reduz no-show sem afastar quem realmente quer vir.",
          ],
        },
        {
          problema: "Concorrente abriu do lado cobrando R$ 20 a menos",
          realidade:
            "Guerra de preço em clínica popular é corrida pra baixo — quem ganha é quem tem escala. Você não controla o preço dele; controla a experiência da sua consulta.",
          caminho: [
            "Diferencie no atendimento: WhatsApp que responde rápido, agenda no dia, médico que escuta 20 minutos, receita entregue impressa.",
            "Combos: consulta + retorno grátis em 30 dias. Percepção de valor sobe sem cortar preço.",
            "Reforce reviews (Google, redes) — reputação alta justifica R$ 20 a mais sem discussão.",
          ],
        },
        {
          problema: "Fatura bem, mas o mês fecha no vermelho",
          realidade:
            "Clínica tem custo fixo alto (aluguel, secretárias, médicos plantão). Ticket popular só fecha conta com volume. Se falta paciente, o custo devora tudo.",
          caminho: [
            "Calcule o ponto de equilíbrio na aba Ajustes: quantas consultas/mês pra pagar toda a estrutura. Esse é seu 'não posso vender menos que isso'.",
            "Especialidades com procedimento (dermato, ginecologia) sobem o ticket médio sem precisar mais paciente.",
            "Contrate médico como PJ por consulta (não por plantão fixo) enquanto a agenda não trava — variabiliza o custo.",
          ],
        },
        {
          problema: "Não sei de onde vem meu paciente",
          realidade:
            "Se você anuncia em 4 lugares e não sabe qual traz consulta, está queimando dinheiro em 3 e nem sabe qual. Sem medir a fonte, não dá pra decidir onde investir.",
          caminho: [
            "Toda ligação/WhatsApp: 'como você nos conheceu?' vira campo obrigatório no agendamento.",
            "Números de WhatsApp diferentes por canal (um pro Instagram, um pro Google) — a origem se mede sozinha.",
            "Fim do mês: agrupe consultas por fonte. Corte o que não traz, dobre o que traz.",
          ],
        },
        {
          problema: "Médico bom pediu pra sair porque a agenda dele não estava cheia",
          realidade:
            "Médico não fica onde não fatura. Você não controla a lealdade dele — controla a agenda que oferece. Especialidade sem demanda é problema de captação, não do profissional.",
          caminho: [
            "Antes de contratar especialidade nova, faça 1 mês de anúncio pra medir demanda real do bairro.",
            "Comece o especialista com 1–2 dias/semana e só aumente quando a agenda encher.",
            "Divulgue a agenda do especialista individualmente — foto, currículo, WhatsApp direto. Especialista com marca própria enche mais.",
          ],
        },
      ],
      rotina: [
        {
          frequencia: "Toda semana",
          duracao: "20 minutos",
          acoes: [
            "Extraia da planilha: consultas realizadas, no-show, ticket médio, fonte de cada paciente novo.",
            "Confirme agenda da semana seguinte: quem não confirmou perde vaga.",
            "Compare com o Plano do mês — está no ritmo?",
          ],
        },
        {
          frequencia: "Todo mês",
          duracao: "1 hora",
          acoes: [
            "Feche o funil: visualizações → contatos → agendamentos → comparecimentos → retornos. Onde afunila mais?",
            "Revise custos fixos e ponto de equilíbrio na aba Ajustes.",
            "Peça 20 reviews no Google (SMS/WhatsApp pros pacientes satisfeitos do mês).",
          ],
        },
      ],
    },
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
    estrategia: {
      intro:
        "Doce caseiro não morre por falta de gente com vontade — morre por não ter previsibilidade. Quem vive disso vive de três coisas: encomenda que se planeja, ponto de venda que gira sozinho e cliente que volta. Esta página é o mapa; as outras abas são o painel de números.",
      principio:
        "Você não controla o preço do ovo nem a moda do concorrente. Controla o tamanho da porção, o valor percebido do seu doce e a agenda da semana. O jogo é transformar 'quem viu' em encomenda combinada — com data, hora e dinheiro na mão.",
      cliente: {
        quemE:
          "Vizinhança, colegas de trabalho da região, mães de escola, escritórios pequenos e clientes de datas (aniversário, dia das mães, páscoa, natal). Compra emocional e por confiança — quem come de você fala de você.",
        ondeEsta:
          "WhatsApp (onde a encomenda fecha), Instagram (onde nasce a vontade, com foto e vídeo do processo), grupos de bairro/condomínio e ponto físico parceiro (padaria, cafeteria, salão que revende).",
        oQueEleQuer:
          "Foto que dá água na boca, preço claro (unidade, kit, caixa), facilidade pra encomendar e uma sensação de 'feito pra mim' — feito à mão vale mais que produção industrial, esse é o seu ativo.",
      },
      funil: [
        {
          emoji: "👀",
          titulo: "Ser visto — alcance na região",
          oQueE: "Quem não é lembrado não é comprado. Doce artesanal precisa aparecer no feed da vizinhança na semana em que a pessoa vai encomendar.",
          numeroPraMedir: "Visualizações por post/story por semana e novos contatos no WhatsApp por mês.",
          acoes: [
            "Poste o processo, não só o produto: vídeo do recheio, do glacê caindo — mostra que é feito à mão e vale mais.",
            "Entre em 3 grupos de bairro / condomínio / mães da escola e apareça toda semana com uma foto e um combo.",
            "Deixe amostra em 1 ponto parceiro (cafeteria, salão): quem prova, pede — e o parceiro ganha uma comissão simbólica.",
          ],
        },
        {
          emoji: "📱",
          titulo: "Virar contato — do stories pro WhatsApp",
          oQueE: "Vontade sem canal direto vira nada. Cada post precisa terminar com 'me chama no zap' e cardápio pronto pra responder.",
          numeroPraMedir: "De 10 pessoas que viram o post, quantas mandam mensagem?",
          acoes: [
            "Cardápio-catálogo no WhatsApp Business com foto, preço, prazo e formas de pagamento — evita 30 min de conversa por pedido.",
            "Link direto do WhatsApp na bio e em todo story (figurinha de link).",
            "Responda em minutos: no artesanal, quem demora 2h pra responder perde pra quem responde na hora.",
          ],
        },
        {
          emoji: "📅",
          titulo: "Fechar a encomenda — data, hora, sinal",
          oQueE: "'Depois eu confirmo' é venda perdida. Encomenda de verdade tem data marcada e, quando o volume é maior, sinal pago antes.",
          numeroPraMedir: "De cada 10 conversas, quantas viram pedido pago (não só 'combinado').",
          acoes: [
            "Combos prontos com preço fechado: caixa de 6, 12, 24. Kit reduz a decisão e sobe o ticket sem esforço.",
            "Encomenda grande (festa, corporativo): 30–50% de sinal via Pix antes de comprar insumo. Trava o cliente e protege seu caixa.",
            "Prazo mínimo de encomenda claro (ex.: 48h): quem respeita seu prazo é cliente de verdade, quem não respeita é dor de cabeça.",
          ],
        },
        {
          emoji: "🍫",
          titulo: "Subir o ticket — kits, upsell e datas",
          oQueE: "Vender mais pra quem já ia comprar é a venda mais barata. E as datas do calendário são o seu 'verão' — quem se prepara fatura o mês em uma semana.",
          numeroPraMedir: "Ticket médio por pedido (na aba Ajustes) e faturamento nas datas comemorativas vs. mês comum.",
          acoes: [
            "Sempre ofereça 'quer levar mais 2 de outro sabor?' na finalização — 1 em cada 3 aceita.",
            "Encarte de datas: páscoa, dia das mães, festa junina, natal. Cardápio especial pré-anunciado 30 dias antes com preço maior justificado pelo tema.",
            "Kit corporativo (café da manhã do escritório, brinde de cliente) — 1 conta corporativa fixa vale 20 clientes soltos.",
          ],
        },
        {
          emoji: "🔁",
          titulo: "Fazer voltar — recorrência e indicação",
          oQueE: "Cliente satisfeito de doce artesanal indica sozinho — se você lembrar dele. Sem lembrança, some.",
          numeroPraMedir: "Quantos pedidos do mês vieram de quem já comprou antes.",
          acoes: [
            "Lista VIP no WhatsApp: toda quinta manda cardápio da semana, um combo em promoção e as datas de entrega.",
            "Fidelidade simples: 10º pedido ganha um mimo. No artesanal, brinde surpreende mais que desconto.",
            "Peça foto e depoimento — publique no story com o nome do cliente. Vira propaganda pra rede dele.",
          ],
        },
      ],
      problemas: [
        {
          problema: "Insumo subiu (ovo, chocolate, farinha) e a margem sumiu",
          realidade:
            "Você não controla o preço da commodity — controla a receita da porção, a embalagem e a tabela. Segurar preço com CMV subindo é escolher trabalhar de graça.",
          caminho: [
            "Refaça a ficha técnica: peso exato de cada insumo por unidade. Sem isso, você não sabe o custo real.",
            "Reajuste em blocos (ex.: a cada 3 meses), não a cada susto — cliente aceita reajuste programado, não zigue-zague.",
            "Crie uma linha 'popular' (porção menor) e mantenha a premium com o preço novo — dá saída pros dois bolsos.",
          ],
        },
        {
          problema: "Encomenda cancelada em cima da hora / cliente sumiu",
          realidade:
            "Combinado sem sinal é conversa fiada. Você não controla o compromisso dos outros — controla a regra da sua venda.",
          caminho: [
            "Sinal via Pix pra qualquer encomenda acima de X reais. Sem sinal, não entra na agenda.",
            "Confirmação automática 48h antes por WhatsApp: quem não confirma perde a vaga.",
            "Regra de cancelamento clara no cardápio (ex.: cancelou em menos de 24h, sinal não volta).",
          ],
        },
        {
          problema: "Concorrente vende mais barato e cliente compara",
          realidade:
            "Guerra de preço no artesanal é competir com fábrica. Você não vence — e não precisa. Seu preço reflete tempo, mão e ingrediente melhor.",
          caminho: [
            "Mostre o processo (vídeo, foto) — cliente que vê o trabalho aceita o preço.",
            "Nunca dê desconto direto no doce; dá brinde ('leva 5, ganha 1') pra proteger a percepção de valor.",
            "Foque em quem paga: cliente que só compra o mais barato não é seu público, é do supermercado.",
          ],
        },
        {
          problema: "Vendo bem em data comemorativa e no mês normal fica parado",
          realidade:
            "Doce vive de dois ciclos: o previsível (semana normal) e o de pico (datas). Sem trabalhar o previsível, você vive de ansiedade entre uma páscoa e outra.",
          caminho: [
            "Instale 3 pontos parceiros pra vender no mês comum: cafeteria, salão, escritório. Comissão simbólica pro parceiro, giro pra você.",
            "Assinatura simples: 'kit da semana' entregue toda sexta pra 10–20 clientes fixos. Faturamento previsível.",
            "Antecipe a próxima data: pedidos abertos com desconto 30 dias antes — trava agenda e caixa.",
          ],
        },
        {
          problema: "Não sei quanto preciso vender pra ganhar dinheiro de verdade",
          realidade:
            "No artesanal, é fácil confundir dinheiro entrando com lucro. Se você não separa custo do insumo, sua mão de obra e o seu 'pró-labore', trabalha o mês pra pagar o mercado.",
          caminho: [
            "Preencha a aba Ajustes com custo real, seu salário desejado e conta de casa — a calculadora te mostra quantas unidades por mês pra fechar no azul.",
            "Vá na aba Plano do mês: quantos contatos por semana, quantas encomendas por dia. É a sua receita previsível traduzida em rotina.",
            "Toda semana, marque quantas encomendas fechou e compare com o plano — desvio de duas semanas seguidas é sinal pra ajustar oferta.",
          ],
        },
      ],
      rotina: [
        {
          frequencia: "Toda semana",
          duracao: "15 minutos",
          acoes: [
            "Poste 3 vezes: um processo, um combo, um depoimento de cliente.",
            "Mande cardápio da semana pra lista VIP (sexta é o melhor dia).",
            "Anote: quantos pedidos, ticket médio, quantos clientes voltaram.",
          ],
        },
        {
          frequencia: "Todo mês",
          duracao: "45 minutos",
          acoes: [
            "Refaça o CMV real: total gasto em insumos ÷ faturamento. Está passando de 40%? Ajuste porção ou preço.",
            "Olhe o calendário: qual é a próxima data? Comece a divulgar 30 dias antes.",
            "Revise a lista de pontos parceiros: quem vendeu bem, quem parou. Renove ou troque.",
          ],
        },
      ],
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
