import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { PRESETS, getPreset, type Preset, type MixItem, type Especialidade } from "@/lib/presets";

export const Route = createFileRoute("/")({
  component: Index,
});

const THEME_KEY = "planner-theme";
const ACTIVE_KEY = "planner-nicho-ativo";
const stateKey = (nichoId: string) => `planner-${nichoId}`;

type Mes = { pctMeta: number; pctOrganico: number };

type Vendedor = {
  id: string;
  nome: string;
  leadsRecebidos: number;
  conversaoAtual: number; // %
  ticketMedioAtual: number; // R$
};

type State = {
  nichoId: string;
  nomeNegocio: string;
  metaLucro: number;
  fixoMarketing: number;
  fixoContas: number;
  fixoOutros: number;
  // Estrutura de custo variável (% do ticket)
  comissaoPct: number;
  cmvPct: number;
  aluguelPct: number;
  aluguelFixo: number;
  taxaCartaoPct: number;
  // Ticket
  ticketMedio: number;
  // Benchmarks
  cacMin: number;
  cacMax: number;
  convMin: number;
  convMax: number;
  // Capacidade & plano
  capacidade: number;
  descontoPromo: number;
  diasVenda: number;
  meses: Mes[];
  // Equipe
  vendedores: Vendedor[];
  // Blocos específicos por nicho
  mixReceita: MixItem[];
  especialidades: Especialidade[];
  produtoGuiaNome: string;
  produtoGuiaTicket: number;
  produtoGuiaCustoPct: number;
  produtoGuiaAdicionais: string[];
};

function makeDefaults(p: Preset): State {
  return {
    nichoId: p.id,
    nomeNegocio: "",
    metaLucro: 5000,
    fixoMarketing: 0,
    fixoContas: 0,
    fixoOutros: 0,
    comissaoPct: p.estruturaCusto.comissaoPct,
    cmvPct: p.estruturaCusto.cmvPct,
    aluguelPct: p.estruturaCusto.aluguelPct,
    aluguelFixo: p.estruturaCusto.aluguelFixo,
    taxaCartaoPct: p.estruturaCusto.taxaCartaoPct,
    ticketMedio: p.ticketInicial,
    cacMin: p.cacMin,
    cacMax: p.cacMax,
    convMin: p.convMin,
    convMax: p.convMax,
    capacidade: p.capacidade.valorReferencia,
    descontoPromo: 10,
    diasVenda: 22,
    meses: [
      { pctMeta: 40, pctOrganico: 20 },
      { pctMeta: 70, pctOrganico: 35 },
      { pctMeta: 100, pctOrganico: 50 },
      { pctMeta: 100, pctOrganico: 65 },
      { pctMeta: 120, pctOrganico: 80 },
    ],
    vendedores: [
      {
        id: crypto.randomUUID(),
        nome: `${p.rotulos.profissional.charAt(0).toUpperCase() + p.rotulos.profissional.slice(1)} 1`,
        leadsRecebidos: 40,
        conversaoAtual: (p.convMin + p.convMax) / 2 * 3, // conversão de vendedor costuma ser maior que orgânica
        ticketMedioAtual: p.ticketInicial,
      },
    ],
    mixReceita: p.mixReceita ? p.mixReceita.map((m) => ({ ...m })) : [],
    especialidades: p.especialidades ? p.especialidades.map((e) => ({ ...e })) : [],
    produtoGuiaNome: p.produtoGuia?.nome ?? "",
    produtoGuiaTicket: p.produtoGuia?.ticket ?? 0,
    produtoGuiaCustoPct: p.produtoGuia?.custoInsumosPct ?? 0,
    produtoGuiaAdicionais: p.produtoGuia?.adicionais ?? [],
  };
}

const brl = (v: number) =>
  isFinite(v)
    ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 })
    : "—";
const num = (v: number) => (isFinite(v) ? Math.ceil(v).toLocaleString("pt-BR") : "—");

function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

function loadState(nichoId: string): State {
  const p = getPreset(nichoId);
  try {
    const raw = localStorage.getItem(stateKey(nichoId));
    if (raw) return { ...makeDefaults(p), ...JSON.parse(raw), nichoId: p.id };
  } catch {
    /* ignore */
  }
  return makeDefaults(p);
}

function Index() {
  const hydrated = useHydrated();
  const [nichoAtivo, setNichoAtivo] = useState<string>("acaiteria");
  const [state, setState] = useState<State>(() => makeDefaults(PRESETS[0]));
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState<"meta" | "parametros" | "capacidade" | "equipe" | "plano">("meta");
  const [nichoPendente, setNichoPendente] = useState<string | null>(null);

  const preset = useMemo(() => getPreset(state.nichoId), [state.nichoId]);

  // Hidratação: carrega nicho ativo + estado dele + tema
  useEffect(() => {
    try {
      const ativo = localStorage.getItem(ACTIVE_KEY) ?? "acaiteria";
      setNichoAtivo(ativo);
      setState(loadState(ativo));
      const t = localStorage.getItem(THEME_KEY);
      setDark(t ? t === "dark" : true);
    } catch {
      /* ignore */
    }
  }, []);

  // Persistência do estado por nicho
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(stateKey(state.nichoId), JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  // Persistência do nicho ativo
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(ACTIVE_KEY, nichoAtivo);
    } catch {
      /* ignore */
    }
  }, [nichoAtivo, hydrated]);

  // Cor de marca por nicho: gira a paleta inteira pro matiz do preset ativo
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.style.setProperty("--hue-rot", String(preset.corHue - 27));
  }, [preset, hydrated]);

  // Persistência do tema
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [dark, hydrated]);

  const patch = (p: Partial<State>) => setState((s) => ({ ...s, ...p }));

  const trocarNicho = (novoId: string) => {
    if (novoId === state.nichoId) return;
    const defaults = makeDefaults(getPreset(state.nichoId));
    const isCustomized = JSON.stringify({ ...state, nichoId: "x" }) !==
      JSON.stringify({ ...defaults, nichoId: "x" });
    // Sempre salva o estado atual antes de trocar
    try {
      localStorage.setItem(stateKey(state.nichoId), JSON.stringify(state));
    } catch {
      /* ignore */
    }
    if (isCustomized && localStorage.getItem(stateKey(novoId)) === null) {
      // Só pergunta se o usuário mexeu nos valores E o novo nicho não tem estado salvo
      setNichoPendente(novoId);
      return;
    }
    setNichoAtivo(novoId);
    setState(loadState(novoId));
  };

  const confirmarTroca = (opcao: "manter" | "resetar") => {
    if (!nichoPendente) return;
    if (opcao === "resetar") {
      // Apaga qualquer estado salvo antigo do novo nicho e usa defaults
      try {
        localStorage.removeItem(stateKey(nichoPendente));
      } catch {
        /* ignore */
      }
    }
    // "Manter": migra os valores atuais para o novo nicho (só o nome muda; a
    // estrutura de custo do preset novo NÃO é aplicada, mantendo o que o
    // usuário já ajustou).
    if (opcao === "manter") {
      const migrado = { ...state, nichoId: nichoPendente };
      try {
        localStorage.setItem(stateKey(nichoPendente), JSON.stringify(migrado));
      } catch {
        /* ignore */
      }
    }
    setNichoAtivo(nichoPendente);
    setState(loadState(nichoPendente));
    setNichoPendente(null);
  };

  // Cálculos derivados ------------------------------------------------------
  const custoVarPct =
    state.comissaoPct + state.cmvPct + state.aluguelPct + state.taxaCartaoPct;
  const custoUnitario = (state.ticketMedio * custoVarPct) / 100;
  const custosFixos =
    state.fixoMarketing + state.fixoContas + state.fixoOutros + state.aluguelFixo;
  const metaEfetiva = state.metaLucro + custosFixos;
  const margem = state.ticketMedio - custoUnitario;

  // Faixa de tickets para o PriceBar / Capacidade
  const faixaTickets = useMemo(() => {
    const base = state.ticketMedio;
    const mults = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3];
    return mults.map((m) => Math.round(base * m));
  }, [state.ticketMedio]);

  const mesesCalc = useMemo(() => {
    return state.meses.map((m) => {
      const lucroAlvo = state.metaLucro * (m.pctMeta / 100);
      const alvoEfetivo = lucroAlvo + custosFixos;
      const unidades = margem > 0 ? Math.ceil(alvoEfetivo / margem) : Infinity;
      const uOrg = Math.round(unidades * (m.pctOrganico / 100));
      const uPago = unidades - uOrg;
      const invMin = uPago * state.cacMin;
      const invMax = uPago * state.cacMax;
      const alcMax = state.convMin > 0 ? uOrg / (state.convMin / 100) : Infinity;
      const alcMin = state.convMax > 0 ? uOrg / (state.convMax / 100) : Infinity;
      return { lucroAlvo, unidades, uOrg, uPago, invMin, invMax, alcMin, alcMax };
    });
  }, [state.meses, state.metaLucro, margem, state.cacMin, state.cacMax, state.convMin, state.convMax, custosFixos]);

  const capacidadeCalc = useMemo(() => {
    return faixaTickets.map((p) => {
      const custoP = (p * custoVarPct) / 100;
      const marg = p - custoP;
      const necessarias = marg > 0 ? Math.ceil(metaEfetiva / marg) : Infinity;
      const suficiente = state.capacidade >= necessarias;
      const lucroMaxBruto = state.capacidade * marg - custosFixos;
      const lucroMax = suficiente ? state.metaLucro : Math.max(0, lucroMaxBruto);
      const precoMin =
        state.capacidade > 0 ? metaEfetiva / (state.capacidade * (1 - custoVarPct / 100)) : Infinity;
      return { preco: p, marg, necessarias, suficiente, lucroMax, precoMin };
    });
  }, [faixaTickets, custoVarPct, metaEfetiva, state.capacidade, custosFixos]);

  const recomendacao = useMemo(() => {
    const viaveis = capacidadeCalc.filter((c) => c.marg > 0 && c.suficiente).sort((a, b) => a.preco - b.preco);
    const comFolga = viaveis.find((c) => state.capacidade >= c.necessarias * 1.15);
    if (comFolga)
      return {
        preco: comFolga.preco,
        tipo: "folga" as const,
        motivo: "menor ticket que cabe na sua capacidade com folga de ~15% pra imprevistos.",
      };
    if (viaveis[0])
      return {
        preco: viaveis[0].preco,
        tipo: "apertado" as const,
        motivo: "menor ticket que ainda cabe na capacidade, mas sem folga. Uma venda perdida já derruba a meta.",
      };
    return {
      preco: null,
      tipo: "impossivel" as const,
      motivo: "nenhum ticket da faixa cabe nessa capacidade. Aumente a capacidade ou suba o ticket médio.",
    };
  }, [capacidadeCalc, state.capacidade]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center gap-3 px-3 py-3 sm:px-6">
          <div className="w-9 h-9 rounded-md ember-gradient flex items-center justify-center text-lg">
            📈
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl sm:text-2xl tracking-wide leading-none">
              PLANEJADOR <span className="ember-text">DE RECEITA</span>
            </h1>
            <input
              value={state.nomeNegocio}
              onChange={(e) => patch({ nomeNegocio: e.target.value })}
              placeholder="Nome do seu negócio"
              className="mt-1 text-[11px] sm:text-xs bg-transparent border-b border-dashed border-border focus:border-primary outline-none w-full max-w-[220px] text-muted-foreground focus:text-foreground"
            />
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            className="text-xs px-2.5 py-1.5 rounded-md border border-border hover:bg-secondary transition"
            aria-label="Alternar tema"
          >
            {dark ? "☀️ Claro" : "🌙 Escuro"}
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-3 sm:px-6 pb-2 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => trocarNicho(p.id)}
              className={`text-xs px-2.5 py-1 rounded-full border transition ${
                p.id === state.nichoId
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-input"
              }`}
            >
              <span className="mr-1">{p.emoji}</span>
              {p.nome}
            </button>
          ))}
        </div>

        <nav className="max-w-5xl mx-auto px-3 sm:px-6 flex gap-1 overflow-x-auto">
          {[
            { id: "meta", label: "🎯 Meta" },
            { id: "parametros", label: "1. Ajustes" },
            { id: "capacidade", label: "2. Capacidade" },
            { id: "equipe", label: "3. Equipe" },
            { id: "plano", label: "4. Plano do mês" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 transition ${
                tab === t.id
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4">
        {preset.avisoConfianca && (
          <div className="rounded-lg border border-[color:var(--color-warning)]/60 bg-[color:var(--color-warning)]/15 p-3 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <span className="text-lg leading-none">⚠️</span>
              <div>
                <div className="font-semibold text-foreground mb-0.5">
                  Confiabilidade dos dados de partida — {preset.nome}
                </div>
                <p className="text-muted-foreground leading-relaxed">{preset.avisoConfianca}</p>
              </div>
            </div>
          </div>
        )}

        {tab === "meta" && (
          <MetaGuiadaTab
            state={state}
            patch={patch}
            preset={preset}
            custosFixos={custosFixos}
            margem={margem}
            metaEfetiva={metaEfetiva}
            recomendacao={recomendacao}
            setTab={setTab}
          />
        )}

        {tab === "parametros" && (
          <>
            <PriceBar
              precos={faixaTickets}
              precoSelecionado={state.ticketMedio}
              onSelect={(p) => patch({ ticketMedio: p })}
              rotulo={`Ticket médio (${brl(preset.ticketMin)} – ${brl(preset.ticketMax)})`}
              hint="Toque num valor para simular todos os cálculos com ele. A faixa varia 30% pra menos e 30% pra mais do ticket médio."
            />
            <AjustesTab
              state={state}
              patch={patch}
              preset={preset}
              custoVarPct={custoVarPct}
              custoUnitario={custoUnitario}
              custosFixos={custosFixos}
            />
          </>
        )}

        {tab === "capacidade" && (
          <SectionCard
            title="Passo 2 · Capacidade × ticket"
            help={
              <>
                Diga <strong>{preset.capacidade.unidade}</strong> que você consegue entregar. A
                ferramenta compara cada ticket da faixa: mostra se cabe, o lucro máximo e o ticket
                mínimo que ainda entrega a meta.
              </>
            }
          >
            <div className="mb-4">
              <div className="flex items-baseline justify-between mb-1">
                <label className="text-sm font-medium">
                  Capacidade — {preset.capacidade.unidade}
                </label>
                <span className="font-display text-2xl text-primary">
                  {state.capacidade}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(200, state.capacidade * 2)}
                value={state.capacidade}
                onChange={(e) => patch({ capacidade: +e.target.value })}
                className="w-full accent-[color:var(--color-primary)]"
              />
            </div>

            <LucroChart
              dados={capacidadeCalc}
              precoSelecionado={state.ticketMedio}
              metaLucro={state.metaLucro}
              onSelect={(p) => patch({ ticketMedio: p })}
            />

            <div className="overflow-x-auto -mx-3 sm:mx-0 mt-4">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="text-left border-b border-border text-muted-foreground">
                    <th className="p-2">Ticket</th>
                    <th className="p-2">Precisa</th>
                    <th className="p-2">Cabe?</th>
                    <th className="p-2">Lucro máx</th>
                    <th className="p-2">Ticket mín</th>
                  </tr>
                </thead>
                <tbody>
                  {capacidadeCalc.map((r) => (
                    <tr
                      key={r.preco}
                      className={`border-b border-border ${
                        r.preco === state.ticketMedio ? "bg-secondary/60" : ""
                      }`}
                    >
                      <td className="p-2 font-semibold">{brl(r.preco)}</td>
                      <td className="p-2">
                        {num(r.necessarias)} {preset.rotulos.unidadeVenda}
                        {r.necessarias === 1 ? "" : "s"}
                      </td>
                      <td className="p-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            r.suficiente
                              ? "bg-[color:var(--color-success)] text-[color:var(--color-success-foreground)]"
                              : "bg-destructive text-destructive-foreground"
                          }`}
                        >
                          {r.suficiente ? "Sim" : "Não"}
                        </span>
                      </td>
                      <td className="p-2">{brl(r.lucroMax)}</td>
                      <td className="p-2 text-primary">{brl(r.precoMin)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <RecomendacaoCard
              recomendacao={recomendacao}
              capacidade={state.capacidade}
              unidade={preset.capacidade.unidade}
              onUsar={(p) => patch({ ticketMedio: p })}
            />
          </SectionCard>
        )}

        {tab === "equipe" && (
          <EquipeTab
            state={state}
            patch={patch}
            preset={preset}
            metaEfetiva={metaEfetiva}
          />
        )}

        {tab === "plano" && (
          <>
            <Dashboard
              preco={state.ticketMedio}
              custoUnitario={custoUnitario}
              metaLucro={state.metaLucro}
              custosFixos={custosFixos}
              cacMin={state.cacMin}
              cacMax={state.cacMax}
              convMin={state.convMin}
              convMax={state.convMax}
              meses={state.meses}
              diasVenda={state.diasVenda}
              onDiasVendaChange={(v) => patch({ diasVenda: v })}
              descontoPromo={state.descontoPromo}
              onDescontoChange={(v) => patch({ descontoPromo: v })}
              unidadeVenda={preset.rotulos.unidadeVenda}
            />

            <SectionCard
              title="Passo 4 · Plano do mês"
              help={
                <>
                  Rampa de 5 meses. Para cada mês, defina <em>% da meta</em> a atingir e{" "}
                  <em>% do volume orgânico</em>. A ferramenta calcula {preset.rotulos.unidadeVenda}
                  s, gasto em ads e alcance orgânico.
                </>
              }
            >
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="text-left border-b border-border text-muted-foreground">
                      <th className="p-2">Mês</th>
                      <th className="p-2 min-w-[140px]">% da meta</th>
                      <th className="p-2 min-w-[140px]">% orgânico</th>
                      <th className="p-2">Lucro alvo</th>
                      <th className="p-2">Unid.</th>
                      <th className="p-2">Org / Pago</th>
                      <th className="p-2">Meta Ads</th>
                      <th className="p-2">Alcance orgânico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.meses.map((m, i) => {
                      const c = mesesCalc[i];
                      return (
                        <tr key={i} className="border-b border-border align-middle">
                          <td className="p-2 font-display text-base text-primary">M{i + 1}</td>
                          <td className="p-2">
                            <MiniSlider
                              value={m.pctMeta}
                              min={0}
                              max={200}
                              step={5}
                              suffix="%"
                              onChange={(v) => {
                                const arr = [...state.meses];
                                arr[i] = { ...m, pctMeta: v };
                                patch({ meses: arr });
                              }}
                            />
                          </td>
                          <td className="p-2">
                            <MiniSlider
                              value={m.pctOrganico}
                              min={0}
                              max={100}
                              step={5}
                              suffix="%"
                              onChange={(v) => {
                                const arr = [...state.meses];
                                arr[i] = { ...m, pctOrganico: v };
                                patch({ meses: arr });
                              }}
                            />
                          </td>
                          <td className="p-2">{brl(c.lucroAlvo)}</td>
                          <td className="p-2 font-semibold">{num(c.unidades)}</td>
                          <td className="p-2">
                            {num(c.uOrg)} / {num(c.uPago)}
                          </td>
                          <td className="p-2 text-primary whitespace-nowrap">
                            {brl(c.invMin)}
                            <span className="text-muted-foreground"> a </span>
                            {brl(c.invMax)}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            {num(c.alcMin)}
                            <span className="text-muted-foreground"> a </span>
                            {num(c.alcMax)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-muted-foreground mt-3">
                💡 Nos primeiros meses o normal é depender mais de <strong>Meta Ads</strong>.
                Conforme o Instagram / boca a boca crescem, a fatia orgânica sobe e o gasto com ads cai.
              </p>
            </SectionCard>
          </>
        )}

        <FormulasCard unidade={preset.rotulos.unidadeVenda} />
      </main>

      {nichoPendente && (
        <TrocaNichoModal
          de={preset.nome}
          para={getPreset(nichoPendente).nome}
          onCancelar={() => setNichoPendente(null)}
          onConfirmar={confirmarTroca}
        />
      )}
    </div>
  );
}

/* =========================================================================
   AJUSTES TAB — parâmetros do nicho + blocos específicos
   ========================================================================= */

function MetaGuiadaTab({
  state,
  patch,
  preset,
  custosFixos,
  margem,
  metaEfetiva,
  recomendacao,
  setTab,
}: {
  state: State;
  patch: (p: Partial<State>) => void;
  preset: Preset;
  custosFixos: number;
  margem: number;
  metaEfetiva: number;
  recomendacao: {
    preco: number | null;
    tipo: "folga" | "apertado" | "impossivel";
    motivo: string;
  };
  setTab: (t: "meta" | "parametros" | "capacidade" | "equipe" | "plano") => void;
}) {
  const [comparando, setComparando] = useState(false);
  const unidade = preset.rotulos.unidadeVenda;
  const plural = (n: number, s: string) => `${s}${n === 1 ? "" : "s"}`;

  // Cenário "mercado": só o ticket e a estrutura de custo do preset, sem
  // nenhuma customização do usuário — é o caminho ilustrativo com médias.
  const custoVarMercado =
    preset.estruturaCusto.comissaoPct +
    preset.estruturaCusto.cmvPct +
    preset.estruturaCusto.aluguelPct +
    preset.estruturaCusto.taxaCartaoPct;
  const margemMercado = preset.ticketInicial * (1 - custoVarMercado / 100);
  const unidadesMercado =
    margemMercado > 0 ? Math.ceil(state.metaLucro / margemMercado) : Infinity;
  const unidadesMercadoDia = isFinite(unidadesMercado) ? Math.ceil(unidadesMercado / 30) : Infinity;

  // Cenário "seu negócio": usa os valores já customizados em `state`
  // (margem e metaEfetiva já vêm calculados lá de cima, no Index()).
  const unidadesReal = margem > 0 ? Math.ceil(metaEfetiva / margem) : Infinity;
  const unidadesRealDia = isFinite(unidadesReal) ? Math.ceil(unidadesReal / 30) : Infinity;

  let fraseComparativa = "Ajuste o ticket médio pra ver a comparação.";
  if (isFinite(unidadesReal) && isFinite(unidadesMercado)) {
    const diffUnidades = unidadesReal - unidadesMercado;
    const partes: string[] = [];
    if (Math.abs(state.ticketMedio - preset.ticketInicial) > 0.5) {
      const pct = Math.abs(
        ((state.ticketMedio - preset.ticketInicial) / preset.ticketInicial) * 100,
      ).toFixed(0);
      partes.push(
        `seu ticket médio é ${pct}% ${state.ticketMedio < preset.ticketInicial ? "menor" : "maior"} que a média`,
      );
    }
    if (custosFixos > 0) {
      partes.push(`você tem ${brl(custosFixos)} de custo fixo por mês que o cenário de mercado não considera`);
    }
    const motivo = partes.length > 0 ? partes.join(" e ") : "pequenas diferenças de estrutura de custo";
    if (Math.abs(diffUnidades) < 1) {
      fraseComparativa =
        "Seus números estão bem próximos da média de mercado — o caminho pra meta é praticamente o mesmo.";
    } else if (diffUnidades > 0) {
      fraseComparativa = `Como ${motivo}, você precisa vender ${num(diffUnidades)} ${plural(diffUnidades, unidade)} a mais por mês do que o cenário de mercado pra bater a mesma meta.`;
    } else {
      fraseComparativa = `Como ${motivo}, você consegue bater a meta vendendo ${num(-diffUnidades)} ${plural(-diffUnidades, unidade)} a menos por mês do que o cenário de mercado.`;
    }
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="🎯 Qual é a sua meta?"
        help="Só isso. A partir daqui, a gente calcula o caminho — você não precisa preencher mais nada pra ver o primeiro resultado."
      >
        <div className="flex flex-wrap gap-2 mb-3">
          {[1000, 2000, 3000, 5000].map((v) => (
            <button
              key={v}
              onClick={() => patch({ metaLucro: v })}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                state.metaLucro === v
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              }`}
            >
              {brl(v)}
            </button>
          ))}
          <div className="flex items-center gap-1 border border-input rounded-md px-2 py-1 bg-background">
            <span className="text-[11px] text-muted-foreground">R$</span>
            <input
              type="number"
              value={state.metaLucro}
              onChange={(e) => patch({ metaLucro: +e.target.value })}
              className="w-24 bg-transparent outline-none text-sm font-display text-lg"
            />
          </div>
        </div>
      </SectionCard>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6 text-center">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
          Com o {unidade} médio de mercado ({brl(preset.ticketInicial)})
        </div>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Pra bater <strong className="text-foreground">{brl(state.metaLucro)}</strong> de lucro
          por mês, você precisa vender
        </p>
        <div className="font-display text-4xl sm:text-5xl ember-text py-1.5">
          {num(unidadesMercado)} {plural(unidadesMercado, unidade)}/mês
        </div>
        <p className="text-sm text-muted-foreground">(~{num(unidadesMercadoDia)} por dia)</p>
      </div>

      <button
        onClick={() => setComparando((c) => !c)}
        className="w-full rounded-xl border border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 transition p-3 text-sm font-medium text-primary flex items-center justify-center gap-2 text-center"
      >
        <span>{comparando ? "▲" : "▼"}</span>
        Esses números são a média do mercado. Quer ver com os seus números reais?
      </button>

      {comparando && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Seu ticket médio"
              value={state.ticketMedio}
              prefix="R$"
              onChange={(v) => patch({ ticketMedio: v })}
            />
            <NumberField
              label={`Sua capacidade (${preset.capacidade.unidade})`}
              value={state.capacidade}
              onChange={(v) => patch({ capacidade: v })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Quer refinar comissão, CMV, aluguel e outros custos fixos com mais detalhe? Isso fica na
            aba{" "}
            <button
              onClick={() => setTab("parametros")}
              className="text-primary underline underline-offset-2"
            >
              Ajustes
            </button>
            .
          </p>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border text-muted-foreground text-xs">
                  <th className="p-2"></th>
                  <th className="p-2">Mercado (padrão)</th>
                  <th className="p-2">O seu negócio</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 text-muted-foreground">Ticket médio</td>
                  <td className="p-2">{brl(preset.ticketInicial)}</td>
                  <td className="p-2 font-semibold">{brl(state.ticketMedio)}</td>
                </tr>
                <tr>
                  <td className="p-2 text-muted-foreground capitalize">{unidade}s/mês necessário</td>
                  <td className="p-2">{num(unidadesMercado)}</td>
                  <td className="p-2 font-semibold">{num(unidadesReal)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm rounded-lg bg-secondary/60 p-3 leading-relaxed">{fraseComparativa}</p>
        </div>
      )}

      <SectionCard
        title="📦 Isso cabe na sua capacidade?"
        help={`Sua capacidade hoje: ${state.capacidade} ${preset.capacidade.unidade}.`}
      >
        <p className="text-sm leading-relaxed mb-3">
          {recomendacao.tipo === "impossivel"
            ? `Com o ticket em torno de ${brl(state.ticketMedio)}, ${recomendacao.motivo}`
            : `O ticket de ${brl(recomendacao.preco ?? 0)} é o ${recomendacao.motivo}`}
        </p>
        <button
          onClick={() => setTab("capacidade")}
          className="text-sm text-primary underline underline-offset-2"
        >
          Ver detalhes de capacidade →
        </button>
      </SectionCard>

      <SectionCard
        title="🗓️ Seu plano pra chegar lá"
        help="Uma rampa de 5 meses, migrando de tráfego pago pra orgânico conforme sua base de clientes cresce."
      >
        <button
          onClick={() => setTab("plano")}
          className="text-sm text-primary underline underline-offset-2"
        >
          Ver plano mês a mês completo →
        </button>
      </SectionCard>
    </div>
  );
}

function AjustesTab({
  state,
  patch,
  preset,
  custoVarPct,
  custoUnitario,
  custosFixos,
}: {
  state: State;
  patch: (p: Partial<State>) => void;
  preset: Preset;
  custoVarPct: number;
  custoUnitario: number;
  custosFixos: number;
}) {
  return (
    <SectionCard
      title="Passo 1 · Ajustes"
      help={
        <>
          Configure <strong>meta, estrutura de custo e benchmarks</strong> do seu negócio. Todos os
          valores vieram do preset de <strong>{preset.nome}</strong> e podem ser alterados.
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <SliderField
          label="Meta de lucro / mês"
          hint="Quanto você quer sobrar no bolso"
          value={state.metaLucro}
          min={500}
          max={50000}
          step={100}
          prefix="R$"
          onChange={(v) => patch({ metaLucro: v })}
        />
        <SliderField
          label="Ticket médio"
          hint={`Faixa do nicho: ${brl(preset.ticketMin)} – ${brl(preset.ticketMax)}`}
          value={state.ticketMedio}
          min={Math.round(preset.ticketMin * 0.5)}
          max={Math.round(preset.ticketMax * 2)}
          step={1}
          prefix="R$"
          onChange={(v) => patch({ ticketMedio: v })}
        />
        <SliderField
          label="CAC mínimo"
          hint="Custo por cliente pago (otimista)"
          value={state.cacMin}
          min={1}
          max={200}
          step={1}
          prefix="R$"
          onChange={(v) => patch({ cacMin: v })}
        />
        <SliderField
          label="CAC máximo"
          hint="Custo por cliente pago (pessimista)"
          value={state.cacMax}
          min={1}
          max={200}
          step={1}
          prefix="R$"
          onChange={(v) => patch({ cacMax: v })}
        />
        <SliderField
          label="Conversão orgânica mín."
          hint="% de quem vê e vira cliente (pior)"
          value={state.convMin}
          min={0.5}
          max={15}
          step={0.1}
          suffix="%"
          onChange={(v) => patch({ convMin: v })}
        />
        <SliderField
          label="Conversão orgânica máx."
          hint="% de quem vê e vira cliente (melhor)"
          value={state.convMax}
          min={0.5}
          max={15}
          step={0.1}
          suffix="%"
          onChange={(v) => patch({ convMax: v })}
        />
      </div>

      {/* Estrutura de custo */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-semibold">Estrutura de custo variável</h3>
          <span className="text-xs text-muted-foreground">
            Total: <strong className="text-foreground">{custoVarPct.toFixed(1)}%</strong> do ticket
            = <strong className="text-foreground">{brl(custoUnitario)}</strong> por {preset.rotulos.unidadeVenda}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Percentuais que saem de cada venda. A margem por {preset.rotulos.unidadeVenda} é ticket × (1 − total).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <SliderField
            label="Comissão"
            hint="Ex.: salão parceiro = 50%"
            value={state.comissaoPct}
            min={0}
            max={70}
            step={0.5}
            suffix="%"
            onChange={(v) => patch({ comissaoPct: v })}
          />
          <SliderField
            label="CMV / insumos"
            hint="Matéria-prima, produtos, insumos"
            value={state.cmvPct}
            min={0}
            max={80}
            step={0.5}
            suffix="%"
            onChange={(v) => patch({ cmvPct: v })}
          />
          <SliderField
            label="Aluguel (% faturamento)"
            hint="Se o aluguel varia com a venda (quiosque)"
            value={state.aluguelPct}
            min={0}
            max={40}
            step={0.5}
            suffix="%"
            onChange={(v) => patch({ aluguelPct: v })}
          />
          <SliderField
            label="Taxa de cartão"
            hint="Média entre débito, crédito, Pix"
            value={state.taxaCartaoPct}
            min={0}
            max={10}
            step={0.1}
            suffix="%"
            onChange={(v) => patch({ taxaCartaoPct: v })}
          />
        </div>
      </div>

      {/* Custos fixos */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-semibold">Custos fixos do mês</h3>
          <span className="text-xs text-muted-foreground">
            Total: <strong className="text-foreground">{brl(custosFixos)}</strong>
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          O que sai da conta todo mês, tenha ou não venda. Somamos à sua meta pra mostrar o número
          real de {preset.rotulos.unidadeVenda}s que você precisa vender.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <SliderField
            label="Marketing recorrente"
            hint="Assinaturas, ferramentas, impulsionamento fixo"
            value={state.fixoMarketing}
            min={0}
            max={5000}
            step={50}
            prefix="R$"
            onChange={(v) => patch({ fixoMarketing: v })}
          />
          <SliderField
            label="Contas do negócio"
            hint="Internet, celular, água, luz"
            value={state.fixoContas}
            min={0}
            max={5000}
            step={50}
            prefix="R$"
            onChange={(v) => patch({ fixoContas: v })}
          />
          <SliderField
            label="Aluguel fixo"
            hint="R$ fixo/mês (alternativo ao % faturamento)"
            value={state.aluguelFixo}
            min={0}
            max={20000}
            step={100}
            prefix="R$"
            onChange={(v) => patch({ aluguelFixo: v })}
          />
          <SliderField
            label="Outros custos fixos"
            hint="Contador, seguros, folha administrativa"
            value={state.fixoOutros}
            min={0}
            max={20000}
            step={100}
            prefix="R$"
            onChange={(v) => patch({ fixoOutros: v })}
          />
        </div>
      </div>

      {/* Blocos específicos por nicho */}
      {preset.mixReceita && preset.mixReceita.length > 0 && (
        <MixReceitaBlock
          mix={state.mixReceita}
          onChange={(mix) => patch({ mixReceita: mix })}
        />
      )}
      {preset.especialidades && preset.especialidades.length > 0 && (
        <EspecialidadesBlock
          especialidades={state.especialidades}
          onChange={(esp) => patch({ especialidades: esp })}
        />
      )}
      {preset.produtoGuia && (
        <ProdutoGuiaBlock state={state} patch={patch} />
      )}

      {preset.notasReferencia && preset.notasReferencia.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Notas de referência — {preset.nome}
          </h3>
          <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
            {preset.notasReferencia.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}
    </SectionCard>
  );
}

function MixReceitaBlock({
  mix,
  onChange,
}: {
  mix: MixItem[];
  onChange: (m: MixItem[]) => void;
}) {
  const totalPct = mix.reduce((s, i) => s + i.pctReceita, 0);
  const margemMedia =
    totalPct > 0 ? mix.reduce((s, i) => s + (i.pctReceita * i.margem) / totalPct, 0) : 0;
  return (
    <div className="mt-6 pt-4 border-t border-border">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-semibold">Mix de receita</h3>
        <span className="text-xs text-muted-foreground">
          Total: <strong className={totalPct === 100 ? "text-[color:var(--color-success)]" : "text-[color:var(--color-warning)]"}>{totalPct.toFixed(0)}%</strong>{" "}
          · Margem média ponderada: <strong className="text-foreground">{margemMedia.toFixed(1)}%</strong>
        </span>
      </div>
      <div className="space-y-2">
        {mix.map((item, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr] gap-2 items-center text-sm">
            <input
              value={item.nome}
              onChange={(e) => {
                const arr = [...mix];
                arr[i] = { ...item, nome: e.target.value };
                onChange(arr);
              }}
              className="bg-background border border-input rounded px-2 py-1 text-sm outline-none"
            />
            <NumberField
              label="% da receita"
              value={item.pctReceita}
              suffix="%"
              onChange={(v) => {
                const arr = [...mix];
                arr[i] = { ...item, pctReceita: v };
                onChange(arr);
              }}
            />
            <NumberField
              label="Margem"
              value={item.margem}
              suffix="%"
              onChange={(v) => {
                const arr = [...mix];
                arr[i] = { ...item, margem: v };
                onChange(arr);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function EspecialidadesBlock({
  especialidades,
  onChange,
}: {
  especialidades: Especialidade[];
  onChange: (e: Especialidade[]) => void;
}) {
  return (
    <div className="mt-6 pt-4 border-t border-border">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-semibold">Especialidades</h3>
        <span className="text-xs text-muted-foreground">Tickets iniciais idênticos — ajuste conforme sua realidade.</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {especialidades.map((esp, i) => (
          <div key={i} className="flex items-center gap-2 border border-input rounded-md p-2 bg-background">
            <input
              value={esp.nome}
              onChange={(e) => {
                const arr = [...especialidades];
                arr[i] = { ...esp, nome: e.target.value };
                onChange(arr);
              }}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-muted-foreground">R$</span>
              <input
                type="number"
                value={esp.ticket}
                onChange={(e) => {
                  const arr = [...especialidades];
                  arr[i] = { ...esp, ticket: +e.target.value };
                  onChange(arr);
                }}
                className="w-16 bg-transparent outline-none text-sm text-right"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProdutoGuiaBlock({
  state,
  patch,
}: {
  state: State;
  patch: (p: Partial<State>) => void;
}) {
  return (
    <div className="mt-6 pt-4 border-t border-border">
      <h3 className="font-semibold mb-2">Produto guia + adicionais</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Seu carro-chefe pauta a produção. Adicionais aumentam o ticket médio da venda.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-2 mb-3">
        <input
          value={state.produtoGuiaNome}
          onChange={(e) => patch({ produtoGuiaNome: e.target.value })}
          placeholder="Nome do produto guia"
          className="bg-background border border-input rounded px-2 py-1 text-sm outline-none"
        />
        <NumberField
          label="Ticket produto"
          prefix="R$"
          value={state.produtoGuiaTicket}
          onChange={(v) => patch({ produtoGuiaTicket: v })}
        />
        <NumberField
          label="Custo insumos"
          suffix="%"
          value={state.produtoGuiaCustoPct}
          onChange={(v) => patch({ produtoGuiaCustoPct: v })}
        />
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-1">Adicionais sugeridos</div>
        <div className="flex flex-wrap gap-2">
          {state.produtoGuiaAdicionais.map((a, i) => (
            <div key={i} className="flex items-center gap-1 border border-input rounded-md pl-2 bg-background">
              <input
                value={a}
                onChange={(e) => {
                  const arr = [...state.produtoGuiaAdicionais];
                  arr[i] = e.target.value;
                  patch({ produtoGuiaAdicionais: arr });
                }}
                className="w-32 py-1 bg-transparent outline-none text-sm"
              />
              <button
                onClick={() =>
                  patch({
                    produtoGuiaAdicionais: state.produtoGuiaAdicionais.filter((_, j) => j !== i),
                  })
                }
                className="text-muted-foreground hover:text-destructive text-xs px-2 py-1"
                aria-label="remover"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => patch({ produtoGuiaAdicionais: [...state.produtoGuiaAdicionais, ""] })}
            className="text-xs px-3 py-1.5 rounded-md border border-dashed border-input hover:border-primary hover:text-primary"
          >
            + adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   EQUIPE TAB — coração da ferramenta
   ========================================================================= */

function EquipeTab({
  state,
  patch,
  preset,
  metaEfetiva,
}: {
  state: State;
  patch: (p: Partial<State>) => void;
  preset: Preset;
  metaEfetiva: number;
}) {
  const prof = preset.rotulos.profissional;
  const profCap = prof.charAt(0).toUpperCase() + prof.slice(1);

  // Cálculos por vendedor
  const ranking = useMemo(() => {
    const arr = state.vendedores.map((v) => {
      const atendimentos = v.leadsRecebidos * (v.conversaoAtual / 100);
      const receita = atendimentos * v.ticketMedioAtual;
      const valorEsperadoPorLead = (v.conversaoAtual / 100) * v.ticketMedioAtual;
      return { ...v, atendimentos, receita, valorEsperadoPorLead };
    });
    const receitaTotal = arr.reduce((s, v) => s + v.receita, 0);
    return arr
      .map((v) => ({
        ...v,
        pctContribuicao: receitaTotal > 0 ? (v.receita / receitaTotal) * 100 : 0,
      }))
      .sort((a, b) => b.valorEsperadoPorLead - a.valorEsperadoPorLead);
  }, [state.vendedores]);

  const totalLeadsAtual = state.vendedores.reduce((s, v) => s + v.leadsRecebidos, 0);
  const receitaTotalAtual = ranking.reduce((s, v) => s + v.receita, 0);

  // Realocação
  const [totalLeadsSim, setTotalLeadsSim] = useState<number>(totalLeadsAtual);
  const [dist, setDist] = useState<Record<string, number>>({});

  useEffect(() => {
    // resync quando lista muda
    setTotalLeadsSim(totalLeadsAtual);
    const d: Record<string, number> = {};
    state.vendedores.forEach((v) => (d[v.id] = v.leadsRecebidos));
    setDist(d);
  }, [state.vendedores.length, totalLeadsAtual]);

  const setLeadPara = (id: string, v: number) => {
    // Trava: soma = totalLeadsSim. Rebalanceia os outros proporcionalmente.
    const outros = state.vendedores.filter((x) => x.id !== id);
    const restante = Math.max(0, totalLeadsSim - v);
    const somaOutros = outros.reduce((s, x) => s + (dist[x.id] ?? 0), 0);
    const novo: Record<string, number> = { ...dist, [id]: v };
    if (somaOutros > 0) {
      outros.forEach((x) => {
        novo[x.id] = Math.round(((dist[x.id] ?? 0) / somaOutros) * restante);
      });
    } else {
      const parte = outros.length > 0 ? Math.floor(restante / outros.length) : 0;
      outros.forEach((x) => (novo[x.id] = parte));
    }
    setDist(novo);
  };

  const receitaSimulada = state.vendedores.reduce((s, v) => {
    const leads = dist[v.id] ?? v.leadsRecebidos;
    return s + leads * (v.conversaoAtual / 100) * v.ticketMedioAtual;
  }, 0);
  const deltaReceita = receitaSimulada - receitaTotalAtual;

  const addVendedor = () => {
    const novo: Vendedor = {
      id: crypto.randomUUID(),
      nome: `${profCap} ${state.vendedores.length + 1}`,
      leadsRecebidos: 20,
      conversaoAtual: 15,
      ticketMedioAtual: state.ticketMedio,
    };
    patch({ vendedores: [...state.vendedores, novo] });
  };
  const removeVendedor = (id: string) =>
    patch({ vendedores: state.vendedores.filter((v) => v.id !== id) });
  const updateVendedor = (id: string, p: Partial<Vendedor>) =>
    patch({
      vendedores: state.vendedores.map((v) => (v.id === id ? { ...v, ...p } : v)),
    });

  return (
    <div className="space-y-4">
      <SectionCard
        title={`Passo 3 · Equipe de ${prof}s`}
        help={
          <>
            Adicione cada {prof} da sua operação com <strong>leads recebidos, conversão e ticket médio</strong>.
            A ferramenta ordena por <strong>valor esperado por lead</strong> — a métrica que mostra
            onde cada novo lead rende mais.
          </>
        }
      >
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
          <strong className="text-foreground">Por que essa métrica importa:</strong> um lead vale
          mais nas mãos de quem converte melhor e vende com ticket médio mais alto. Direcionar mais
          leads para quem tem o maior valor esperado por lead aumenta a receita total do negócio{" "}
          <em>sem precisar de mais tráfego ou investimento em marketing</em>.
        </div>

        <div className="rounded-md border border-border bg-background p-3 text-xs text-muted-foreground mb-4">
          💡 Conversão costuma ser a métrica mais rápida de melhorar com treinamento — e é a que
          mais impacta o valor esperado por lead.
        </div>

        {/* CRUD */}
        <div className="space-y-3">
          {ranking.map((v, i) => (
            <VendedorCard
              key={v.id}
              v={v}
              rank={i}
              onUpdate={(p) => updateVendedor(v.id, p)}
              onRemove={() => removeVendedor(v.id)}
              metaEfetiva={metaEfetiva}
              totalLeadsRanking={totalLeadsAtual}
            />
          ))}
        </div>

        <button
          onClick={addVendedor}
          className="mt-4 text-sm px-3 py-1.5 rounded-md border border-dashed border-input hover:border-primary hover:text-primary"
        >
          + adicionar {prof}
        </button>
      </SectionCard>

      {/* Simulador de realocação */}
      <SectionCard
        title="Simulador de realocação de leads"
        help={
          <>
            Redistribua o total de leads do mês entre os {prof}s. Os sliders travam a soma no total.
            A receita atualiza ao vivo.
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <NumberField
            label="Total de leads no mês"
            value={totalLeadsSim}
            onChange={(v) => {
              setTotalLeadsSim(v);
              // redistribui proporcionalmente
              const soma = Object.values(dist).reduce((s, x) => s + x, 0);
              if (soma > 0) {
                const novo: Record<string, number> = {};
                state.vendedores.forEach((x) => {
                  novo[x.id] = Math.round(((dist[x.id] ?? 0) / soma) * v);
                });
                setDist(novo);
              }
            }}
          />
          <div className="rounded-md border border-border bg-background p-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Receita simulada
            </div>
            <div className="font-display text-lg">{brl(receitaSimulada)}</div>
          </div>
          <div
            className={`rounded-md border p-2 ${
              deltaReceita >= 0
                ? "border-[color:var(--color-success)]/50 bg-[color:var(--color-success)]/5"
                : "border-destructive/60 bg-destructive/5"
            }`}
          >
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Δ vs. distribuição original
            </div>
            <div
              className={`font-display text-lg ${
                deltaReceita >= 0 ? "text-[color:var(--color-success)]" : "text-destructive"
              }`}
            >
              {deltaReceita >= 0 ? "+" : ""}
              {brl(deltaReceita)}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {state.vendedores.map((v) => {
            const leadsAtual = dist[v.id] ?? v.leadsRecebidos;
            const receitaV = leadsAtual * (v.conversaoAtual / 100) * v.ticketMedioAtual;
            return (
              <div key={v.id} className="rounded-md border border-border bg-background p-3">
                <div className="flex items-baseline justify-between mb-1 gap-2 flex-wrap">
                  <div className="text-sm font-medium">{v.nome}</div>
                  <div className="text-xs text-muted-foreground">
                    Leads: <strong className="text-foreground">{leadsAtual}</strong> · Receita:{" "}
                    <strong className="text-foreground">{brl(receitaV)}</strong>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={totalLeadsSim}
                  value={leadsAtual}
                  onChange={(e) => setLeadPara(v.id, +e.target.value)}
                  className="w-full accent-[color:var(--color-primary)]"
                />
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

function VendedorCard({
  v,
  rank,
  onUpdate,
  onRemove,
  metaEfetiva,
  totalLeadsRanking,
}: {
  v: {
    id: string;
    nome: string;
    leadsRecebidos: number;
    conversaoAtual: number;
    ticketMedioAtual: number;
    atendimentos: number;
    receita: number;
    valorEsperadoPorLead: number;
    pctContribuicao: number;
  };
  rank: number;
  onUpdate: (p: Partial<Vendedor>) => void;
  onRemove: () => void;
  metaEfetiva: number;
  totalLeadsRanking: number;
}) {
  // Fatia da meta proporcional aos leads
  const fatiaMeta =
    totalLeadsRanking > 0 ? metaEfetiva * (v.leadsRecebidos / totalLeadsRanking) : 0;

  // Cenário A — subir ticket mantendo leads e conversão
  const denomA = v.leadsRecebidos * (v.conversaoAtual / 100);
  const ticketNecessario = denomA > 0 ? fatiaMeta / denomA : Infinity;

  // Cenário B — subir conversão mantendo leads e ticket
  const denomB = v.leadsRecebidos * v.ticketMedioAtual;
  const convNecessaria = denomB > 0 ? (fatiaMeta / denomB) * 100 : Infinity;

  return (
    <div className="rounded-lg border border-border bg-background p-3 space-y-3">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <input
            value={v.nome}
            onChange={(e) => onUpdate({ nome: e.target.value })}
            className="text-sm font-semibold bg-transparent border-b border-dashed border-border focus:border-primary outline-none flex-1"
          />
          {rank === 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wide bg-primary text-primary-foreground px-2 py-0.5 rounded-full whitespace-nowrap">
              🏆 Melhor retorno por lead
            </span>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-xs text-muted-foreground hover:text-destructive px-2 py-1"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <NumberField
          label="Leads recebidos"
          value={v.leadsRecebidos}
          onChange={(x) => onUpdate({ leadsRecebidos: x })}
        />
        <NumberField
          label="Conversão"
          suffix="%"
          value={v.conversaoAtual}
          onChange={(x) => onUpdate({ conversaoAtual: x })}
        />
        <NumberField
          label="Ticket médio"
          prefix="R$"
          value={v.ticketMedioAtual}
          onChange={(x) => onUpdate({ ticketMedioAtual: x })}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <MiniKpi label="Atendimentos" value={v.atendimentos.toFixed(1)} />
        <MiniKpi label="Receita gerada" value={brl(v.receita)} />
        <MiniKpi
          label="Valor esperado / lead"
          value={brl(v.valorEsperadoPorLead)}
          highlight
        />
        <MiniKpi label="Contribui hoje" value={`${v.pctContribuicao.toFixed(1)}%`} />
      </div>

      {/* Cenários A/B */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Cenário A · Subir o ticket
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Mantendo leads e conversão, ticket necessário pra cobrir a fatia da meta ({brl(fatiaMeta)}):
          </div>
          <div className="font-display text-xl text-primary mt-1">
            {isFinite(ticketNecessario) ? brl(ticketNecessario) : "—"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            hoje: {brl(v.ticketMedioAtual)}
          </div>
        </div>
        <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Cenário B · Subir a conversão
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Mantendo leads e ticket, conversão necessária pra cobrir a fatia da meta:
          </div>
          <div className="font-display text-xl text-primary mt-1">
            {isFinite(convNecessaria) ? `${convNecessaria.toFixed(1)}%` : "—"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            hoje: {v.conversaoAtual.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Modal de troca de nicho
   ========================================================================= */

function TrocaNichoModal({
  de,
  para,
  onCancelar,
  onConfirmar,
}: {
  de: string;
  para: string;
  onCancelar: () => void;
  onConfirmar: (opcao: "manter" | "resetar") => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-xl border border-border bg-card p-5 shadow-xl">
        <h2 className="font-display text-xl text-primary mb-2">
          Trocar de <span className="ember-text">{de}</span> para{" "}
          <span className="ember-text">{para}</span>
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Você tem valores customizados no nicho atual. O que quer fazer?
        </p>
        <div className="space-y-2">
          <button
            onClick={() => onConfirmar("manter")}
            className="w-full text-left rounded-md border border-border p-3 hover:border-primary hover:bg-primary/5 transition"
          >
            <div className="font-semibold text-sm">Manter valores atuais</div>
            <div className="text-xs text-muted-foreground">
              Migra seus ajustes (meta, custos, benchmarks, equipe) para o novo nicho. Só troca os
              rótulos e o preset visual.
            </div>
          </button>
          <button
            onClick={() => onConfirmar("resetar")}
            className="w-full text-left rounded-md border border-border p-3 hover:border-primary hover:bg-primary/5 transition"
          >
            <div className="font-semibold text-sm">Resetar para o preset do nicho</div>
            <div className="text-xs text-muted-foreground">
              Começa do zero com os valores de referência de {para}.
            </div>
          </button>
        </div>
        <button
          onClick={onCancelar}
          className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground py-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   Componentes auxiliares (copiados do calculadoracb, adaptados)
   ========================================================================= */

function SectionCard({
  title,
  help,
  children,
}: {
  title: string;
  help: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card text-card-foreground p-3 sm:p-4">
      <h2 className="font-display text-xl tracking-wide text-primary">{title}</h2>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-3 leading-relaxed">{help}</p>
      {children}
    </section>
  );
}

function PriceBar({
  precos,
  precoSelecionado,
  onSelect,
  rotulo,
  hint,
}: {
  precos: number[];
  precoSelecionado: number;
  onSelect: (p: number) => void;
  rotulo: string;
  hint: string;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-3 sm:p-4">
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{rotulo}</div>
          <div className="text-xs text-muted-foreground">{hint}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {precos.map((p) => {
          const active = precoSelecionado === p;
          return (
            <button
              key={p}
              onClick={() => onSelect(p)}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              }`}
            >
              {brl(p)}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function RecomendacaoCard({
  recomendacao,
  capacidade,
  unidade,
  onUsar,
}: {
  recomendacao: {
    preco: number | null;
    tipo: "folga" | "apertado" | "impossivel";
    motivo: string;
  };
  capacidade: number;
  unidade: string;
  onUsar: (p: number) => void;
}) {
  const isOk = recomendacao.preco !== null;
  return (
    <section
      className={`mt-4 rounded-xl border p-3 sm:p-4 ${
        recomendacao.tipo === "folga"
          ? "border-primary/50 bg-primary/5"
          : recomendacao.tipo === "apertado"
            ? "border-[color:var(--color-warning)]/60 bg-[color:var(--color-warning)]/10"
            : "border-destructive/50 bg-destructive/10"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{isOk ? "⭐" : "⚠️"}</div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Recomendação
          </div>
          {isOk ? (
            <>
              <div className="font-display text-lg sm:text-xl leading-tight">
                Pra {capacidade} {unidade}, use{" "}
                <span className="ember-text">{brl(recomendacao.preco!)}</span> de ticket
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{recomendacao.motivo}</p>
              <button
                onClick={() => onUsar(recomendacao.preco!)}
                className="mt-2 text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90"
              >
                Usar esse ticket
              </button>
            </>
          ) : (
            <p className="text-sm text-foreground mt-1">{recomendacao.motivo}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Dashboard({
  preco,
  custoUnitario,
  metaLucro,
  custosFixos,
  cacMin,
  cacMax,
  convMin,
  convMax,
  meses,
  diasVenda,
  onDiasVendaChange,
  descontoPromo,
  onDescontoChange,
  unidadeVenda,
}: {
  preco: number;
  custoUnitario: number;
  metaLucro: number;
  custosFixos: number;
  cacMin: number;
  cacMax: number;
  convMin: number;
  convMax: number;
  meses: Mes[];
  diasVenda: number;
  onDiasVendaChange: (v: number) => void;
  descontoPromo: number;
  onDescontoChange: (v: number) => void;
  unidadeVenda: string;
}) {
  const mc = preco - custoUnitario;
  const margemPct = preco > 0 ? (mc / preco) * 100 : 0;
  const metaEfetiva = metaLucro + custosFixos;
  const breakEven = mc > 0 ? Math.ceil(metaEfetiva / mc) : Infinity;
  const pontoEquilibrio = mc > 0 ? Math.ceil(custosFixos / mc) : 0;
  const roasMin = cacMin > 0 ? preco / cacMin : Infinity;
  const roasMax = cacMax > 0 ? preco / cacMax : Infinity;
  const lucroAdMin = mc - cacMax;
  const lucroAdMax = mc - cacMin;

  const contatosMax = convMin > 0 && isFinite(breakEven) ? Math.ceil(breakEven / (convMin / 100)) : Infinity;
  const contatosMin = convMax > 0 && isFinite(breakEven) ? Math.ceil(breakEven / (convMax / 100)) : Infinity;
  const contatosDiaMin = isFinite(contatosMin) ? Math.ceil(contatosMin / diasVenda) : Infinity;
  const contatosDiaMax = isFinite(contatosMax) ? Math.ceil(contatosMax / diasVenda) : Infinity;
  const contatosSemMin = isFinite(contatosMin) ? Math.ceil(contatosMin / 4.3) : Infinity;
  const contatosSemMax = isFinite(contatosMax) ? Math.ceil(contatosMax / 4.3) : Infinity;

  const receitaMes = isFinite(breakEven) ? breakEven * preco : 0;
  const unidadesDia = isFinite(breakEven) ? breakEven / diasVenda : 0;
  const receitaDia = receitaMes / diasVenda;
  const lucroDia = metaLucro / diasVenda;

  const pctOrgAvg = meses.length > 0 ? meses.reduce((s, m) => s + m.pctOrganico, 0) / meses.length : 0;
  const unidadesPagas = isFinite(breakEven) ? breakEven * (1 - pctOrgAvg / 100) : 0;
  const cacMed = (cacMin + cacMax) / 2;
  const investAds = unidadesPagas * cacMed;
  const cpmAlvoMin = convMin > 0 ? cacMin * (convMin / 100) * 1000 : 0;
  const cpmAlvoMax = convMax > 0 ? cacMax * (convMax / 100) * 1000 : 0;
  const roiAd = cacMed > 0 ? ((mc - cacMed) / cacMed) * 100 : 0;
  const adRuim = roiAd < 100;

  const precoPromo = preco * (1 - descontoPromo / 100);
  const margemPromo = precoPromo - custoUnitario;
  const unidadesPromo = margemPromo > 0 ? Math.ceil(metaEfetiva / margemPromo) : Infinity;
  const extraUnidades =
    isFinite(unidadesPromo) && isFinite(breakEven) ? unidadesPromo - breakEven : Infinity;
  const promoRuim = margemPromo <= cacMax;

  const cards: Array<{
    label: string;
    value: string;
    hint: string;
    tone?: "primary" | "warn" | "ok";
  }> = [
    {
      label: `Margem por ${unidadeVenda}`,
      value: brl(mc),
      hint: "Ticket − custo variável",
      tone: mc <= 0 ? "warn" : "primary",
    },
    { label: "Margem %", value: `${margemPct.toFixed(1)}%`, hint: "sobre o ticket" },
    {
      label: "Ponto de equilíbrio",
      value: mc > 0 ? `${num(pontoEquilibrio)} un.` : "—",
      hint: custosFixos > 0 ? `cobre ${brl(custosFixos)} de fixos` : "informe custos fixos ↑",
      tone: custosFixos > 0 ? "ok" : "warn",
    },
    {
      label: `${unidadeVenda}s p/ meta`,
      value: `${num(breakEven)}`,
      hint: custosFixos > 0 ? "meta + fixos" : "no mês inteiro",
      tone: "primary",
    },
    {
      label: "ROAS em ads",
      value: `${roasMax.toFixed(1)}x – ${roasMin.toFixed(1)}x`,
      hint: "retorno por R$ em ads",
    },
    {
      label: "Lucro por venda paga",
      value: `${brl(lucroAdMin)} – ${brl(lucroAdMax)}`,
      hint: "margem − CAC",
      tone: lucroAdMin < 0 ? "warn" : "ok",
    },
  ];

  return (
    <section className="rounded-xl border border-border bg-card p-3 sm:p-4">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Diagnóstico do ticket atual
          </div>
          <div className="text-xs text-muted-foreground">
            Como esse ticket se comporta agora — atualiza em tempo real.
          </div>
        </div>
        <div className="font-display text-2xl text-primary">{brl(preco)}</div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {cards.map((c) => {
          const toneClass =
            c.tone === "warn"
              ? "border-destructive/60 bg-destructive/10 text-destructive"
              : c.tone === "ok"
                ? "border-[color:var(--color-success)]/50"
                : c.tone === "primary"
                  ? "border-primary/40"
                  : "border-border";
          return (
            <div key={c.label} className={`rounded-lg border p-2.5 bg-background ${toneClass}`}>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {c.label}
              </div>
              <div className="font-display text-lg leading-tight mt-0.5">{c.value}</div>
              <div className="text-[10px] text-muted-foreground">{c.hint}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-3">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
          Contatos necessários — quantas pessoas você precisa alcançar
        </div>
        <div className="text-xs text-muted-foreground mb-3">
          A cada 100 pessoas que virem seu anúncio, entre {convMin} e {convMax} vão comprar. Para
          vender <strong className="text-foreground">{num(breakEven)} {unidadeVenda}s</strong> no
          mês você precisa aparecer para ~
          {isFinite(contatosMin) ? `${num(contatosMin)} a ${num(contatosMax)}` : "—"} pessoas.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <MiniKpi
            label="No mês (faixa)"
            value={isFinite(contatosMin) ? `${num(contatosMin)} – ${num(contatosMax)}` : "—"}
          />
          <MiniKpi
            label="Por semana"
            value={isFinite(contatosSemMin) ? `${num(contatosSemMin)} – ${num(contatosSemMax)}` : "—"}
          />
          <MiniKpi
            label={`Por dia (${diasVenda}d)`}
            value={isFinite(contatosDiaMin) ? `${num(contatosDiaMin)} – ${num(contatosDiaMax)}` : "—"}
          />
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-border bg-background p-3">
        <div className="flex items-baseline justify-between mb-2 gap-2 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Ritmo diário
            </div>
            <div className="text-xs text-muted-foreground">
              A meta quebrada em ação por dia de venda.
            </div>
          </div>
          <div className="inline-flex rounded-md border border-input overflow-hidden text-xs">
            <button
              onClick={() => onDiasVendaChange(22)}
              className={`px-2.5 py-1 ${diasVenda === 22 ? "bg-primary text-primary-foreground" : "bg-background hover:bg-secondary"}`}
            >
              Todo dia (22)
            </button>
            <button
              onClick={() => onDiasVendaChange(12)}
              className={`px-2.5 py-1 border-l border-input ${diasVenda === 12 ? "bg-primary text-primary-foreground" : "bg-background hover:bg-secondary"}`}
            >
              Só fim de semana (12)
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <MiniKpi label={`${unidadeVenda}s / dia`} value={isFinite(unidadesDia) ? unidadesDia.toFixed(1) : "—"} />
          <MiniKpi label="Faturamento / dia" value={brl(receitaDia)} />
          <MiniKpi label="Lucro / dia" value={brl(lucroDia)} />
          <MiniKpi
            label="Contatos / dia"
            value={isFinite(contatosDiaMin) ? `${num(contatosDiaMin)}–${num(contatosDiaMax)}` : "—"}
          />
        </div>
      </div>

      <div
        className={`mt-3 rounded-lg border p-3 ${adRuim ? "border-destructive/60 bg-destructive/5" : "border-border bg-background"}`}
      >
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
          Eficiência do anúncio pago
        </div>
        <div className="text-xs text-muted-foreground mb-3">
          Considerando que {pctOrgAvg.toFixed(0)}% das vendas vêm do orgânico (média dos 5 meses).
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <MiniKpi
            label={`${unidadeVenda}s pagas / mês`}
            value={isFinite(unidadesPagas) ? `${num(unidadesPagas)}` : "—"}
          />
          <MiniKpi label="Investimento em ads" value={brl(investAds)} />
          <MiniKpi
            label="ROI do anúncio"
            value={isFinite(roiAd) ? `${roiAd.toFixed(0)}%` : "—"}
            warn={adRuim}
          />
          <MiniKpi label="CPM alvo" value={cpmAlvoMin > 0 ? `${brl(cpmAlvoMin)} – ${brl(cpmAlvoMax)}` : "—"} />
        </div>
        {adRuim && (
          <p className="text-xs text-destructive mt-2">
            ⚠️ ROI abaixo de 100% — cada real gasto em ads volta menos que o dobro. Suba o ticket ou
            reduza o CAC.
          </p>
        )}
      </div>

      {/* Simulador de promoção */}
      <div
        className={`mt-4 rounded-lg border p-3 ${
          promoRuim ? "border-destructive/60 bg-destructive/5" : "border-primary/30 bg-primary/5"
        }`}
      >
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Simulador de promoção
            </div>
            <div className="text-xs text-muted-foreground">
              Quantos {unidadeVenda}s a MAIS pra manter o lucro se você der desconto.
            </div>
          </div>
          <div className="font-display text-2xl text-primary">{descontoPromo}%</div>
        </div>
        <input
          type="range"
          min={0}
          max={30}
          step={1}
          value={descontoPromo}
          onChange={(e) => onDescontoChange(+e.target.value)}
          className="w-full accent-[color:var(--color-primary)]"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          <MiniKpi label="Ticket promo" value={brl(precoPromo)} />
          <MiniKpi label="Nova margem" value={brl(margemPromo)} warn={margemPromo <= 0} />
          <MiniKpi
            label={`${unidadeVenda}s necessários`}
            value={isFinite(unidadesPromo) ? `${num(unidadesPromo)}` : "—"}
          />
          <MiniKpi
            label="A mais que hoje"
            value={
              isFinite(extraUnidades)
                ? extraUnidades > 0
                  ? `+${num(extraUnidades)}`
                  : `${extraUnidades}`
                : "—"
            }
            warn={promoRuim}
          />
        </div>
        {promoRuim && descontoPromo > 0 && (
          <p className="text-xs text-destructive mt-2">
            ⚠️ Com esse desconto, a margem fica menor ou igual ao CAC máximo — cada venda paga por
            ads dá prejuízo.
          </p>
        )}
      </div>
    </section>
  );
}

function MiniKpi({
  label,
  value,
  warn,
  highlight,
}: {
  label: string;
  value: string;
  warn?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-md border p-2 bg-background ${
        warn
          ? "border-destructive/60 text-destructive"
          : highlight
            ? "border-primary/60 bg-primary/5"
            : "border-border"
      }`}
    >
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`font-display text-base leading-tight ${highlight ? "text-primary" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function LucroChart({
  dados,
  precoSelecionado,
  metaLucro,
  onSelect,
}: {
  dados: Array<{ preco: number; lucroMax: number; suficiente: boolean }>;
  precoSelecionado: number;
  metaLucro: number;
  onSelect: (p: number) => void;
}) {
  const max = Math.max(metaLucro, ...dados.map((d) => d.lucroMax), 1);
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
          Lucro × Ticket
        </div>
        <div className="text-[10px] text-muted-foreground">
          linha tracejada = meta ({brl(metaLucro)})
        </div>
      </div>
      <div className="relative h-40 flex items-end gap-1 sm:gap-2 pt-4">
        <div
          className="absolute left-0 right-0 border-t border-dashed border-primary/60 pointer-events-none"
          style={{ bottom: `${(metaLucro / max) * 100}%` }}
        />
        {dados.map((d) => {
          const h = Math.max(2, (d.lucroMax / max) * 100);
          const active = d.preco === precoSelecionado;
          return (
            <button
              key={d.preco}
              onClick={() => onSelect(d.preco)}
              className="flex-1 flex flex-col items-center justify-end h-full group"
              title={`${brl(d.preco)} → ${brl(d.lucroMax)}`}
            >
              <span className="text-[9px] sm:text-[10px] text-muted-foreground group-hover:text-foreground mb-0.5">
                {brl(d.lucroMax)}
              </span>
              <div
                className={`w-full rounded-t transition-all ${
                  active ? "ember-gradient" : d.suficiente ? "bg-primary/70" : "bg-muted"
                }`}
                style={{ height: `${h}%` }}
              />
              <span
                className={`text-[9px] sm:text-[10px] mt-1 ${
                  active ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {brl(d.preco)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SliderField({
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium">{label}</span>
        <div className="flex items-center gap-1 border border-input rounded-md px-2 py-0.5 bg-background">
          {prefix && <span className="text-[11px] text-muted-foreground">{prefix}</span>}
          <input
            type="number"
            step={step}
            value={value}
            onChange={(e) => onChange(+e.target.value)}
            className="w-20 text-right bg-transparent outline-none text-sm"
          />
          {suffix && <span className="text-[11px] text-muted-foreground">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full accent-[color:var(--color-primary)]"
      />
      {hint && <span className="text-[10px] text-muted-foreground leading-tight">{hint}</span>}
    </div>
  );
}

function MiniSlider({
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5 min-w-[120px]">
      <div className="flex items-center gap-1">
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(+e.target.value)}
          className="w-14 text-right bg-background border border-input rounded px-1 py-0.5 outline-none text-xs"
        />
        {suffix && <span className="text-[10px] text-muted-foreground">{suffix}</span>}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full accent-[color:var(--color-primary)]"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  prefix,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-md border border-input bg-background p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="flex items-baseline gap-1 mt-0.5">
        {prefix && <span className="text-xs text-muted-foreground">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(+e.target.value)}
          className="flex-1 bg-transparent outline-none font-display text-lg min-w-0"
        />
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

function FormulasCard({ unidade }: { unidade: string }) {
  return (
    <details className="group rounded-xl border border-border bg-card p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground">
      <summary className="flex items-center justify-between cursor-pointer list-none select-none">
        <h2 className="font-display text-xl tracking-wide text-primary">
          Como cada número é calculado
        </h2>
        <span className="text-primary text-lg transition-transform group-open:rotate-90" aria-hidden>
          ›
        </span>
      </summary>
      <ul className="space-y-1.5 list-disc pl-5 mt-3">
        <li>
          <strong className="text-foreground">Custo variável por {unidade}</strong> = Ticket ×
          (Comissão% + CMV% + Aluguel% + Taxa cartão%) ÷ 100.
        </li>
        <li>
          <strong className="text-foreground">Margem por {unidade}</strong> = Ticket − Custo
          variável. Se ficar ≤ 0, o negócio perde dinheiro em cada venda.
        </li>
        <li>
          <strong className="text-foreground">Margem %</strong> = Margem ÷ Ticket × 100.
        </li>
        <li>
          <strong className="text-foreground">Custos fixos totais</strong> = Marketing recorrente +
          Contas do negócio + Aluguel fixo + Outros. É o que sai da conta todo mês, tenha ou não
          venda.
        </li>
        <li>
          <strong className="text-foreground">Meta efetiva</strong> = Meta de lucro + Custos fixos.
          É o valor real que a operação precisa gerar de margem no mês.
        </li>
        <li>
          <strong className="text-foreground">Ponto de equilíbrio</strong> = teto(Custos fixos ÷
          Margem por {unidade}). Cobre <em>só</em> os fixos, antes de gerar lucro.
        </li>
        <li>
          <strong className="text-foreground">{unidade}s para bater a meta</strong> = teto(Meta
          efetiva ÷ Margem por {unidade}).
        </li>
        <li>
          <strong className="text-foreground">Contatos necessários (mês)</strong> = {unidade}s p/
          meta ÷ Taxa de conversão. Ex.: 60 vendas ÷ 2% = 3.000 pessoas.
        </li>
        <li>
          <strong className="text-foreground">Contatos por semana / dia</strong> = mês ÷ 4,3
          semanas ou ÷ dias de venda (22 se todo dia, 12 se só fim de semana).
        </li>
        <li>
          <strong className="text-foreground">Ritmo diário</strong> = totais do mês ÷ dias de
          venda.
        </li>
        <li>
          <strong className="text-foreground">ROI do anúncio</strong> = (Margem − CAC médio) ÷ CAC
          médio × 100. &lt; 100% = anúncio não vale a pena.
        </li>
        <li>
          <strong className="text-foreground">CPM alvo</strong> = CAC × conversão × 1000. Máximo
          por 1.000 impressões.
        </li>
        <li>
          <strong className="text-foreground">Preço mínimo (capacidade)</strong> = Meta efetiva ÷
          (Capacidade × (1 − custoVar%)). Menor ticket que cabe na produção.
        </li>
        <li>
          <strong className="text-foreground">Recomendação de ticket</strong> = menor ticket da
          faixa em que a capacidade cobre com pelo menos 15% de folga.
        </li>
        <li>
          <strong className="text-foreground">Simulador de promoção</strong> = teto(Meta efetiva ÷
          Nova margem) − {unidade}s atuais.
        </li>
        <li>
          <strong className="text-foreground">Aba Equipe — Valor esperado por lead</strong> =
          Conversão × Ticket médio. É a métrica que ordena o ranking: quanto cada novo lead rende
          nas mãos daquela pessoa.
        </li>
        <li>
          <strong className="text-foreground">Receita por pessoa</strong> = Leads × Conversão ×
          Ticket.
        </li>
        <li>
          <strong className="text-foreground">Fatia da meta por pessoa</strong> = Meta efetiva ×
          (Leads da pessoa ÷ Total de leads). Distribui a meta proporcionalmente aos leads
          recebidos.
        </li>
        <li>
          <strong className="text-foreground">Cenário A — ticket necessário</strong> = Fatia da
          meta ÷ (Leads × Conversão). Ticket que a pessoa precisaria pra cobrir sua fatia sem mudar
          leads nem conversão.
        </li>
        <li>
          <strong className="text-foreground">Cenário B — conversão necessária</strong> = Fatia da
          meta ÷ (Leads × Ticket) × 100.
        </li>
        <li>
          <strong className="text-foreground">Realocação — receita simulada</strong> = Σ (Leads
          novos × Conversão × Ticket) por pessoa. Compara com a distribuição original e mostra Δ.
        </li>
      </ul>
    </details>
  );
}
