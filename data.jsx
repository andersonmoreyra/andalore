// Dados mockados realistas para o coordenador de manutenção
// Cenário: planta industrial de embalagens (linhas de extrusão, impressão, corte)

const PLANT = {
  name: "Planta Vinhedo",
  shift: "Turno A · 06:00 — 14:00",
  date: "Ter, 04 mai 2026",
};

const TECHNICIANS = [
  { id: "T01", name: "Rafael Mendes", initials: "RM", role: "Mecânico Sr",   status: "executando", currentWO: "OS-2841", color: "#7c9cff", load: 0.85 },
  { id: "T02", name: "Camila Souza",  initials: "CS", role: "Eletricista",   status: "deslocando", currentWO: "OS-2847", color: "#a78bfa", load: 0.62 },
  { id: "T03", name: "Diego Araújo",  initials: "DA", role: "Mecânico Pl",   status: "executando", currentWO: "OS-2839", color: "#34d399", load: 0.91 },
  { id: "T04", name: "Larissa Pinto", initials: "LP", role: "Instrumentista",status: "disponível", currentWO: null,      color: "#fbbf24", load: 0.30 },
  { id: "T05", name: "Bruno Caldas",  initials: "BC", role: "Mecânico Sr",   status: "pausa",      currentWO: null,      color: "#fb7185", load: 0.55 },
  { id: "T06", name: "Helena Vargas", initials: "HV", role: "Eletricista",   status: "executando", currentWO: "OS-2845", color: "#22d3ee", load: 0.78 },
  { id: "T07", name: "Igor Ferreira", initials: "IF", role: "Aux. Manut.",   status: "executando", currentWO: "OS-2842", color: "#f472b6", load: 0.70 },
  { id: "T08", name: "Marina Lopes",  initials: "ML", role: "Instrumentista",status: "disponível", currentWO: null,      color: "#94a3b8", load: 0.40 },
];

const ASSETS = [
  { id: "EX-01", name: "Extrusora 01",      area: "Extrusão",  criticality: "A", health: 0.62, mtbf: 412, runtime: 84 },
  { id: "EX-02", name: "Extrusora 02",      area: "Extrusão",  criticality: "A", health: 0.91, mtbf: 720, runtime: 96 },
  { id: "EX-03", name: "Extrusora 03",      area: "Extrusão",  criticality: "B", health: 0.78, mtbf: 540, runtime: 88 },
  { id: "IM-01", name: "Impressora Flexo 1",area: "Impressão", criticality: "A", health: 0.45, mtbf: 280, runtime: 72 },
  { id: "IM-02", name: "Impressora Flexo 2",area: "Impressão", criticality: "A", health: 0.83, mtbf: 610, runtime: 92 },
  { id: "CT-01", name: "Cortadeira 01",     area: "Acabamento",criticality: "B", health: 0.55, mtbf: 380, runtime: 80 },
  { id: "CT-02", name: "Cortadeira 02",     area: "Acabamento",criticality: "B", health: 0.88, mtbf: 660, runtime: 94 },
  { id: "RB-01", name: "Rebobinadeira 01",  area: "Acabamento",criticality: "C", health: 0.94, mtbf: 800, runtime: 98 },
  { id: "CP-01", name: "Compressor Central",area: "Utilidades",criticality: "A", health: 0.71, mtbf: 1200,runtime: 99 },
  { id: "CL-01", name: "Chiller 01",        area: "Utilidades",criticality: "B", health: 0.86, mtbf: 950, runtime: 97 },
  { id: "PT-01", name: "Paletizadora",      area: "Expedição", criticality: "C", health: 0.92, mtbf: 720, runtime: 90 },
];

// Ordens de serviço — mistura de corretivas, preventivas, preditivas e melhorias
const WORK_ORDERS = [
  {
    id: "OS-2839", title: "Vibração anormal no eixo principal",
    asset: "EX-01", assetName: "Extrusora 01", area: "Extrusão",
    type: "corretiva", priority: "crítica", status: "executando",
    assignee: "T03", assigneeName: "Diego Araújo",
    opened: "04/05 06:12", due: "04/05 11:00",
    sla: 0.72, // 0..1 — quanto do tempo já passou
    estimate: 180, elapsed: 132,
    parts: [{ code: "ROL-6308", name: "Rolamento SKF 6308", qty: 2, stock: 5 }],
    description: "Operador reportou vibração crescente desde 04:50. Análise preditiva indicou falha incipiente no rolamento traseiro.",
    impact: "Linha 1 parada · perda estimada R$ 4.800/h",
  },
  {
    id: "OS-2841", title: "Substituição de cilindro de impressão",
    asset: "IM-01", assetName: "Impressora Flexo 1", area: "Impressão",
    type: "preventiva", priority: "alta", status: "executando",
    assignee: "T01", assigneeName: "Rafael Mendes",
    opened: "04/05 06:00", due: "04/05 09:30",
    sla: 0.55, estimate: 210, elapsed: 115,
    parts: [{ code: "CIL-FX-340", name: "Cilindro Flexo 340mm", qty: 1, stock: 1 }],
    description: "Troca programada conforme plano preventivo P-IM-Q.",
    impact: "Janela de troca planejada — sem perda",
  },
  {
    id: "OS-2842", title: "Lubrificação rotativa semanal",
    asset: "CT-01", assetName: "Cortadeira 01", area: "Acabamento",
    type: "preventiva", priority: "média", status: "executando",
    assignee: "T07", assigneeName: "Igor Ferreira",
    opened: "04/05 07:00", due: "04/05 10:00",
    sla: 0.40, estimate: 90, elapsed: 36,
    parts: [{ code: "LUB-EP2", name: "Graxa EP-2 (kg)", qty: 1, stock: 18 }],
    description: "Rotina S-CT — lubrificação de mancais e correntes.",
    impact: "Sem parada — executado em janela de setup",
  },
  {
    id: "OS-2845", title: "Curto-circuito no painel de comando",
    asset: "EX-02", assetName: "Extrusora 02", area: "Extrusão",
    type: "corretiva", priority: "alta", status: "executando",
    assignee: "T06", assigneeName: "Helena Vargas",
    opened: "04/05 07:48", due: "04/05 10:00",
    sla: 0.81, estimate: 120, elapsed: 98,
    parts: [{ code: "CTR-LC1", name: "Contator LC1-D32", qty: 1, stock: 3 }],
    description: "Disjuntor abriu sem causa aparente. Termografia revelou ponto quente no contator K3.",
    impact: "Linha 2 parada · perda estimada R$ 3.200/h",
  },
  {
    id: "OS-2847", title: "Calibração de sensor de temperatura",
    asset: "CP-01", assetName: "Compressor Central", area: "Utilidades",
    type: "preditiva", priority: "média", status: "deslocando",
    assignee: "T02", assigneeName: "Camila Souza",
    opened: "04/05 08:15", due: "04/05 11:30",
    sla: 0.22, estimate: 60, elapsed: 0,
    parts: [],
    description: "Desvio de leitura > 3°C detectado pelo sistema preditivo.",
    impact: "Sem parada prevista",
  },
  {
    id: "OS-2849", title: "Troca de filtros do chiller",
    asset: "CL-01", assetName: "Chiller 01", area: "Utilidades",
    type: "preventiva", priority: "baixa", status: "aberta",
    assignee: null, assigneeName: null,
    opened: "04/05 08:30", due: "04/05 14:00",
    sla: 0.10, estimate: 75, elapsed: 0,
    parts: [{ code: "FLT-CL-22", name: "Filtro Chiller G4", qty: 4, stock: 12 }],
    description: "Plano P-CL-M conforme calendário.",
    impact: "Sem perda",
  },
  {
    id: "OS-2851", title: "Ruído excessivo no redutor",
    asset: "RB-01", assetName: "Rebobinadeira 01", area: "Acabamento",
    type: "corretiva", priority: "média", status: "aberta",
    assignee: null, assigneeName: null,
    opened: "04/05 09:02", due: "04/05 13:00",
    sla: 0.05, estimate: 90, elapsed: 0,
    parts: [],
    description: "Solicitação aberta pelo operador Sandro (turno A).",
    impact: "Operação reduzida a 70%",
  },
  {
    id: "OS-2853", title: "Inspeção termográfica trimestral",
    asset: "IM-02", assetName: "Impressora Flexo 2", area: "Impressão",
    type: "preditiva", priority: "baixa", status: "aberta",
    assignee: null, assigneeName: null,
    opened: "04/05 09:10", due: "04/05 16:00",
    sla: 0, estimate: 45, elapsed: 0,
    parts: [],
    description: "Inspeção programada conforme plano preditivo.",
    impact: "Sem parada",
  },
  {
    id: "OS-2820", title: "Troca de correia transportadora",
    asset: "PT-01", assetName: "Paletizadora", area: "Expedição",
    type: "corretiva", priority: "média", status: "concluída",
    assignee: "T05", assigneeName: "Bruno Caldas",
    opened: "03/05 13:20", due: "03/05 17:00",
    sla: 1, estimate: 150, elapsed: 142,
    parts: [{ code: "CRR-PT-2400", name: "Correia 2400mm", qty: 1, stock: 0 }],
    description: "Concluída sem intercorrências.",
    impact: "Concluída",
  },
  {
    id: "OS-2832", title: "Vazamento de óleo na bomba hidráulica",
    asset: "CT-02", assetName: "Cortadeira 02", area: "Acabamento",
    type: "corretiva", priority: "alta", status: "aguardando peça",
    assignee: "T03", assigneeName: "Diego Araújo",
    opened: "04/05 05:30", due: "04/05 12:00",
    sla: 0.62, estimate: 180, elapsed: 0,
    parts: [{ code: "RET-BHD-50", name: "Retentor BHD-50", qty: 2, stock: 0 }],
    description: "Retentor solicitado ao almoxarifado — chegada prevista 11:00.",
    impact: "Linha 4 em ritmo reduzido",
  },
];

// KPIs do turno
const KPIS = [
  { label: "OS abertas",          value: 18,    delta: "+3",     trend: "up",   tone: "neutral" },
  { label: "Atrasadas",           value: 3,     delta: "−1",     trend: "down", tone: "warn" },
  { label: "Disponibilidade",     value: "94,2%", delta: "+0,8 pp", trend: "up", tone: "good" },
  { label: "MTTR (h)",            value: "2,4", delta: "−0,3",   trend: "down", tone: "good" },
  { label: "Backlog (h)",         value: "47",  delta: "+5",     trend: "up",   tone: "warn" },
  { label: "Aderência preventiva",value: "87%", delta: "−2 pp",  trend: "down", tone: "warn" },
];

// Atividade recente — feed lateral
const ACTIVITY = [
  { time: "09:14", who: "Helena Vargas", what: "abriu OS-2845",          tag: "alta" },
  { time: "09:08", who: "Sistema",       what: "alerta preditivo CP-01", tag: "preditivo" },
  { time: "08:52", who: "Diego Araújo",  what: "concluiu etapa 2/4 em OS-2839", tag: "exec" },
  { time: "08:30", who: "Almoxarifado",  what: "recebeu retentores RET-BHD-50", tag: "estoque" },
  { time: "08:15", who: "Sandro Lima",   what: "solicitou OS-2851",       tag: "solic" },
  { time: "07:48", who: "Sistema",       what: "disjuntor abriu em EX-02",tag: "alerta" },
  { time: "07:00", who: "Igor Ferreira", what: "iniciou OS-2842",         tag: "exec" },
  { time: "06:12", who: "Operador L1",   what: "reportou vibração EX-01", tag: "solic" },
];

// Solicitações de serviço pendentes (ainda não viraram OS)
const REQUESTS = [
  { id: "SR-118", from: "Op. Linha 3",    asset: "EX-03", title: "Temperatura instável zona 4", priority: "média", time: "09:22" },
  { id: "SR-117", from: "Qualidade",      asset: "IM-02", title: "Variação de cor lote #4421",  priority: "média", time: "08:55" },
  { id: "SR-116", from: "Op. Linha 1",    asset: "EX-01", title: "Ruído metálico intermitente", priority: "alta",  time: "08:40" },
  { id: "SR-115", from: "Sup. Acabamento",asset: "RB-01", title: "Tensionador desregulado",      priority: "baixa", time: "07:30" },
];

// Calendário 7 dias — preventivas planejadas
const SCHEDULE_DAYS = ["Ter 04", "Qua 05", "Qui 06", "Sex 07", "Sáb 08", "Dom 09", "Seg 10"];
const PLANNED = [
  { day: 0, asset: "IM-01", title: "Subst. cilindro", duration: 3, type: "preventiva" },
  { day: 0, asset: "CT-01", title: "Lubrif. semanal", duration: 1.5, type: "preventiva" },
  { day: 0, asset: "CL-01", title: "Filtros chiller", duration: 1.25, type: "preventiva" },
  { day: 1, asset: "EX-02", title: "Inspeção elétrica", duration: 4, type: "preditiva" },
  { day: 1, asset: "CP-01", title: "Análise de óleo", duration: 1, type: "preditiva" },
  { day: 2, asset: "IM-02", title: "Termografia trim.", duration: 0.75, type: "preditiva" },
  { day: 2, asset: "EX-01", title: "Troca rolamentos", duration: 6, type: "preventiva" },
  { day: 3, asset: "PT-01", title: "Verif. mecânica", duration: 2, type: "preventiva" },
  { day: 4, asset: "CT-02", title: "Overhaul bomba",  duration: 8, type: "preventiva" },
  { day: 6, asset: "RB-01", title: "Calibração",      duration: 2, type: "preditiva" },
];

Object.assign(window, {
  PLANT, TECHNICIANS, ASSETS, WORK_ORDERS, KPIS, ACTIVITY, REQUESTS,
  SCHEDULE_DAYS, PLANNED,
});
