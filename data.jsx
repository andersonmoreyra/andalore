// Dados mockados realistas para o coordenador de manutenção
// Cenário: planta industrial de embalagens (linhas de extrusão, impressão, corte)

const PLANT = {
  nome: "Planta Vinhedo",
  turno: "Turno A · 06:00 — 14:00",
  data: "Ter, 04 mai 2026",
};

const TECHNICIANS = [
  { id: "T01", nome: "Rafael Mendes", initials: "RM", especialidade: "Mecânico Sr",   status: "executando", osAtual: "OS-2841", color: "#7c9cff", carga: 0.85 },
  { id: "T02", nome: "Camila Souza",  initials: "CS", especialidade: "Eletricista",   status: "deslocando", osAtual: "OS-2847", color: "#a78bfa", carga: 0.62 },
  { id: "T03", nome: "Diego Araújo",  initials: "DA", especialidade: "Mecânico Pl",   status: "executando", osAtual: "OS-2839", color: "#34d399", carga: 0.91 },
  { id: "T04", nome: "Larissa Pinto", initials: "LP", especialidade: "Instrumentista",status: "disponível", osAtual: null,      color: "#fbbf24", carga: 0.30 },
  { id: "T05", nome: "Bruno Caldas",  initials: "BC", especialidade: "Mecânico Sr",   status: "pausa",      osAtual: null,      color: "#fb7185", carga: 0.55 },
  { id: "T06", nome: "Helena Vargas", initials: "HV", especialidade: "Eletricista",   status: "executando", osAtual: "OS-2845", color: "#22d3ee", carga: 0.78 },
  { id: "T07", nome: "Igor Ferreira", initials: "IF", especialidade: "Aux. Manut.",   status: "executando", osAtual: "OS-2842", color: "#f472b6", carga: 0.70 },
  { id: "T08", nome: "Marina Lopes",  initials: "ML", especialidade: "Instrumentista",status: "disponível", osAtual: null,      color: "#94a3b8", carga: 0.40 },
];

const ASSETS = [
  { id: "EX-01", nome: "Extrusora 01",      area: "Extrusão",  criticidade: "A", saude: 0.62, mtbf: 412, runtime: 84 },
  { id: "EX-02", nome: "Extrusora 02",      area: "Extrusão",  criticidade: "A", saude: 0.91, mtbf: 720, runtime: 96 },
  { id: "EX-03", nome: "Extrusora 03",      area: "Extrusão",  criticidade: "B", saude: 0.78, mtbf: 540, runtime: 88 },
  { id: "IM-01", nome: "Impressora Flexo 1",area: "Impressão", criticidade: "A", saude: 0.45, mtbf: 280, runtime: 72 },
  { id: "IM-02", nome: "Impressora Flexo 2",area: "Impressão", criticidade: "A", saude: 0.83, mtbf: 610, runtime: 92 },
  { id: "CT-01", nome: "Cortadeira 01",     area: "Acabamento",criticidade: "B", saude: 0.55, mtbf: 380, runtime: 80 },
  { id: "CT-02", nome: "Cortadeira 02",     area: "Acabamento",criticidade: "B", saude: 0.88, mtbf: 660, runtime: 94 },
  { id: "RB-01", nome: "Rebobinadeira 01",  area: "Acabamento",criticidade: "C", saude: 0.94, mtbf: 800, runtime: 98 },
  { id: "CP-01", nome: "Compressor Central",area: "Utilidades",criticidade: "A", saude: 0.71, mtbf: 1200,runtime: 99 },
  { id: "CL-01", nome: "Chiller 01",        area: "Utilidades",criticidade: "B", saude: 0.86, mtbf: 950, runtime: 97 },
  { id: "PT-01", nome: "Paletizadora",      area: "Expedição", criticidade: "C", saude: 0.92, mtbf: 720, runtime: 90 },
];

// Ordens de serviço — mistura de corretivas, preventivas, preditivas e melhorias
const WORK_ORDERS = [
  {
    id: "OS-2839", titulo: "Vibração anormal no eixo principal",
    equipamento: "EX-01", equipamentoNome: "Extrusora 01", area: "Extrusão",
    tipo: "corretiva", prioridade: "crítica", status: "executando",
    tecnico: "T03", tecnicoNome: "Diego Araújo",
    dataAbertura: "04/05 06:12", prazo: "04/05 11:00",
    sla: 0.72, // 0..1 — quanto do tempo já passou
    estimativa: 180, decorrido: 132,
    pecas: [{ codigo: "ROL-6308", nome: "Rolamento SKF 6308", quantidade: 2, estoque: 5 }],
    descricao: "Operador reportou vibração crescente desde 04:50. Análise preditiva indicou falha incipiente no rolamento traseiro.",
    impacto: "Linha 1 parada · perda estimada R$ 4.800/h",
  },
  {
    id: "OS-2841", titulo: "Substituição de cilindro de impressão",
    equipamento: "IM-01", equipamentoNome: "Impressora Flexo 1", area: "Impressão",
    tipo: "preventiva", prioridade: "alta", status: "executando",
    tecnico: "T01", tecnicoNome: "Rafael Mendes",
    dataAbertura: "04/05 06:00", prazo: "04/05 09:30",
    sla: 0.55, estimativa: 210, decorrido: 115,
    pecas: [{ codigo: "CIL-FX-340", nome: "Cilindro Flexo 340mm", quantidade: 1, estoque: 1 }],
    descricao: "Troca programada conforme plano preventivo P-IM-Q.",
    impacto: "Janela de troca planejada — sem perda",
  },
  {
    id: "OS-2842", titulo: "Lubrificação rotativa semanal",
    equipamento: "CT-01", equipamentoNome: "Cortadeira 01", area: "Acabamento",
    tipo: "preventiva", prioridade: "média", status: "executando",
    tecnico: "T07", tecnicoNome: "Igor Ferreira",
    dataAbertura: "04/05 07:00", prazo: "04/05 10:00",
    sla: 0.40, estimativa: 90, decorrido: 36,
    pecas: [{ codigo: "LUB-EP2", nome: "Graxa EP-2 (kg)", quantidade: 1, estoque: 18 }],
    descricao: "Rotina S-CT — lubrificação de mancais e correntes.",
    impacto: "Sem parada — executado em janela de setup",
  },
  {
    id: "OS-2845", titulo: "Curto-circuito no painel de comando",
    equipamento: "EX-02", equipamentoNome: "Extrusora 02", area: "Extrusão",
    tipo: "corretiva", prioridade: "alta", status: "executando",
    tecnico: "T06", tecnicoNome: "Helena Vargas",
    dataAbertura: "04/05 07:48", prazo: "04/05 10:00",
    sla: 0.81, estimativa: 120, decorrido: 98,
    pecas: [{ codigo: "CTR-LC1", nome: "Contator LC1-D32", quantidade: 1, estoque: 3 }],
    descricao: "Disjuntor abriu sem causa aparente. Termografia revelou ponto quente no contator K3.",
    impacto: "Linha 2 parada · perda estimada R$ 3.200/h",
  },
  {
    id: "OS-2847", titulo: "Calibração de sensor de temperatura",
    equipamento: "CP-01", equipamentoNome: "Compressor Central", area: "Utilidades",
    tipo: "preditiva", prioridade: "média", status: "deslocando",
    tecnico: "T02", tecnicoNome: "Camila Souza",
    dataAbertura: "04/05 08:15", prazo: "04/05 11:30",
    sla: 0.22, estimativa: 60, decorrido: 0,
    pecas: [],
    descricao: "Desvio de leitura > 3°C detectado pelo sistema preditivo.",
    impacto: "Sem parada prevista",
  },
  {
    id: "OS-2849", titulo: "Troca de filtros do chiller",
    equipamento: "CL-01", equipamentoNome: "Chiller 01", area: "Utilidades",
    tipo: "preventiva", prioridade: "baixa", status: "aberta",
    tecnico: null, tecnicoNome: null,
    dataAbertura: "04/05 08:30", prazo: "04/05 14:00",
    sla: 0.10, estimativa: 75, decorrido: 0,
    pecas: [{ codigo: "FLT-CL-22", nome: "Filtro Chiller G4", quantidade: 4, estoque: 12 }],
    descricao: "Plano P-CL-M conforme calendário.",
    impacto: "Sem perda",
  },
  {
    id: "OS-2851", titulo: "Ruído excessivo no redutor",
    equipamento: "RB-01", equipamentoNome: "Rebobinadeira 01", area: "Acabamento",
    tipo: "corretiva", prioridade: "média", status: "aberta",
    tecnico: null, tecnicoNome: null,
    dataAbertura: "04/05 09:02", prazo: "04/05 13:00",
    sla: 0.05, estimativa: 90, decorrido: 0,
    pecas: [],
    descricao: "Solicitação aberta pelo operador Sandro (turno A).",
    impacto: "Operação reduzida a 70%",
  },
  {
    id: "OS-2853", titulo: "Inspeção termográfica trimestral",
    equipamento: "IM-02", equipamentoNome: "Impressora Flexo 2", area: "Impressão",
    tipo: "preditiva", prioridade: "baixa", status: "aberta",
    tecnico: null, tecnicoNome: null,
    dataAbertura: "04/05 09:10", prazo: "04/05 16:00",
    sla: 0, estimativa: 45, decorrido: 0,
    pecas: [],
    descricao: "Inspeção programada conforme plano preditivo.",
    impacto: "Sem parada",
  },
  {
    id: "OS-2820", titulo: "Troca de correia transportadora",
    equipamento: "PT-01", equipamentoNome: "Paletizadora", area: "Expedição",
    tipo: "corretiva", prioridade: "média", status: "concluída",
    tecnico: "T05", tecnicoNome: "Bruno Caldas",
    dataAbertura: "03/05 13:20", prazo: "03/05 17:00",
    sla: 1, estimativa: 150, decorrido: 142,
    pecas: [{ codigo: "CRR-PT-2400", nome: "Correia 2400mm", quantidade: 1, estoque: 0 }],
    descricao: "Concluída sem intercorrências.",
    impacto: "Concluída",
  },
  {
    id: "OS-2832", titulo: "Vazamento de óleo na bomba hidráulica",
    equipamento: "CT-02", equipamentoNome: "Cortadeira 02", area: "Acabamento",
    tipo: "corretiva", prioridade: "alta", status: "aguardando peça",
    tecnico: "T03", tecnicoNome: "Diego Araújo",
    dataAbertura: "04/05 05:30", prazo: "04/05 12:00",
    sla: 0.62, estimativa: 180, decorrido: 0,
    pecas: [{ codigo: "RET-BHD-50", nome: "Retentor BHD-50", quantidade: 2, estoque: 0 }],
    descricao: "Retentor solicitado ao almoxarifado — chegada prevista 11:00.",
    impacto: "Linha 4 em ritmo reduzido",
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
  { hora: "09:14", who: "Helena Vargas", what: "abriu OS-2845",          tag: "alta" },
  { hora: "09:08", who: "Sistema",       what: "alerta preditivo CP-01", tag: "preditivo" },
  { hora: "08:52", who: "Diego Araújo",  what: "concluiu etapa 2/4 em OS-2839", tag: "exec" },
  { hora: "08:30", who: "Almoxarifado",  what: "recebeu retentores RET-BHD-50", tag: "estoque" },
  { hora: "08:15", who: "Sandro Lima",   what: "solicitou OS-2851",       tag: "solic" },
  { hora: "07:48", who: "Sistema",       what: "disjuntor abriu em EX-02",tag: "alerta" },
  { hora: "07:00", who: "Igor Ferreira", what: "iniciou OS-2842",         tag: "exec" },
  { hora: "06:12", who: "Operador L1",   what: "reportou vibração EX-01", tag: "solic" },
];

// Solicitações de serviço pendentes (ainda não viraram OS)
const REQUESTS = [
  { id: "SR-118", solicitante: "Op. Linha 3",    equipamento: "EX-03", titulo: "Temperatura instável zona 4", prioridade: "média", hora: "09:22" },
  { id: "SR-117", solicitante: "Qualidade",      equipamento: "IM-02", titulo: "Variação de cor lote #4421",  prioridade: "média", hora: "08:55" },
  { id: "SR-116", solicitante: "Op. Linha 1",    equipamento: "EX-01", titulo: "Ruído metálico intermitente", prioridade: "alta",  hora: "08:40" },
  { id: "SR-115", solicitante: "Sup. Acabamento",equipamento: "RB-01", titulo: "Tensionador desregulado",      prioridade: "baixa", hora: "07:30" },
];

// Calendário 7 dias — preventivas planejadas
const SCHEDULE_DAYS = ["Ter 04", "Qua 05", "Qui 06", "Sex 07", "Sáb 08", "Dom 09", "Seg 10"];
const PLANNED = [
  { day: 0, equipamento: "IM-01", titulo: "Subst. cilindro", duracao: 3, tipo: "preventiva" },
  { day: 0, equipamento: "CT-01", titulo: "Lubrif. semanal", duracao: 1.5, tipo: "preventiva" },
  { day: 0, equipamento: "CL-01", titulo: "Filtros chiller", duracao: 1.25, tipo: "preventiva" },
  { day: 1, equipamento: "EX-02", titulo: "Inspeção elétrica", duracao: 4, tipo: "preditiva" },
  { day: 1, equipamento: "CP-01", titulo: "Análise de óleo", duracao: 1, tipo: "preditiva" },
  { day: 2, equipamento: "IM-02", titulo: "Termografia trim.", duracao: 0.75, tipo: "preditiva" },
  { day: 2, equipamento: "EX-01", titulo: "Troca rolamentos", duracao: 6, tipo: "preventiva" },
  { day: 3, equipamento: "PT-01", titulo: "Verif. mecânica", duracao: 2, tipo: "preventiva" },
  { day: 4, equipamento: "CT-02", titulo: "Overhaul bomba",  duracao: 8, tipo: "preventiva" },
  { day: 6, equipamento: "RB-01", titulo: "Calibração",      duracao: 2, tipo: "preditiva" },
];

Object.assign(window, {
  PLANT, TECHNICIANS, ASSETS, WORK_ORDERS, KPIS, ACTIVITY, REQUESTS,
  SCHEDULE_DAYS, PLANNED,
});

// Sincroniza os dados profissionais mockados com o localStorage somente na primeira carga.
// Não sobrescreve dados reais já gravados pelo usuário.
try {
  if (window.Storage) {
    if ((Storage.getWorkOrders() || []).length === 0) Storage.set(Storage.KEYS.WORK_ORDERS, WORK_ORDERS);
    if ((Storage.getRequests() || []).length === 0) Storage.set(Storage.KEYS.REQUESTS, REQUESTS);
  }
} catch (e) { /* mantém carregamento visual mesmo se o navegador bloquear localStorage */ }

