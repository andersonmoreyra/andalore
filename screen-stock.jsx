// ─── Tela: Estoque & peças ───────────────────────────────────────────────────

const PARTS = [
  { code: "ROL-6308",   name: "Rolamento SKF 6308 2RS",        category: "Mecânica",   stock: 5,  min: 4,  max: 12, location: "A-12-3", unit: "un",  cost: 142.00, lead: 7,  consumption: [2,1,3,2,4,2,3], abc: "A" },
  { code: "ROL-6310",   name: "Rolamento SKF 6310 ZZ",          category: "Mecânica",   stock: 2,  min: 3,  max: 8,  location: "A-12-4", unit: "un",  cost: 198.50, lead: 7,  consumption: [1,2,1,2,3,2,2], abc: "A" },
  { code: "CIL-FX-340", name: "Cilindro Flexo 340mm",           category: "Impressão",  stock: 1,  min: 2,  max: 4,  location: "C-04-1", unit: "un",  cost: 8400.00, lead: 21, consumption: [0,1,0,1,1,1,0], abc: "A" },
  { code: "CTR-LC1",    name: "Contator LC1-D32 24V",           category: "Elétrica",   stock: 3,  min: 4,  max: 10, location: "B-08-2", unit: "un",  cost: 320.00, lead: 14, consumption: [1,2,1,3,2,1,2], abc: "A" },
  { code: "RET-BHD-50", name: "Retentor BHD-50 Viton",          category: "Hidráulica", stock: 0,  min: 6,  max: 20, location: "A-15-1", unit: "un",  cost: 48.00,  lead: 5,  consumption: [3,4,2,5,3,4,3], abc: "B" },
  { code: "FLT-CL-22",  name: "Filtro Chiller G4 595×595",      category: "HVAC",       stock: 12, min: 8,  max: 24, location: "D-02-2", unit: "un",  cost: 78.00,  lead: 10, consumption: [2,2,1,2,3,2,2], abc: "B" },
  { code: "LUB-EP2",    name: "Graxa EP-2 Mobilux",             category: "Lubrif.",    stock: 18, min: 10, max: 40, location: "E-01-5", unit: "kg",  cost: 32.00,  lead: 3,  consumption: [4,5,3,6,4,5,4], abc: "B" },
  { code: "OIL-ISO46",  name: "Óleo hidráulico ISO 46",         category: "Lubrif.",    stock: 60, min: 40, max: 200,location: "E-03-1", unit: "L",   cost: 18.00,  lead: 5,  consumption: [10,12,8,15,12,10,9], abc: "B" },
  { code: "CRR-PT-2400",name: "Correia transp. 2400mm",         category: "Mecânica",   stock: 0,  min: 1,  max: 3,  location: "C-09-1", unit: "un",  cost: 4200.00, lead: 30, consumption: [0,0,1,0,0,1,0], abc: "A" },
  { code: "VLV-PNT-12", name: "Válvula pneum. 1/2\" 5/2 vias",   category: "Pneumática", stock: 6,  min: 4,  max: 12, location: "B-11-3", unit: "un",  cost: 410.00, lead: 12, consumption: [1,1,2,1,1,2,1], abc: "B" },
  { code: "SEN-TMP-PT100",name: "Sensor PT100 c/ rosca",         category: "Instrum.",   stock: 4,  min: 3,  max: 10, location: "B-14-2", unit: "un",  cost: 280.00, lead: 8,  consumption: [1,0,1,2,1,1,1], abc: "B" },
  { code: "CBO-EST-25", name: "Cabo de aço Ø25mm (m)",          category: "Mecânica",   stock: 45, min: 20, max: 80, location: "F-01-1", unit: "m",   cost: 22.00,  lead: 4,  consumption: [3,5,4,6,5,4,3], abc: "C" },
  { code: "PAR-SC-M12", name: "Parafuso M12×60 cl.8.8",         category: "Consumo",    stock: 320,min: 100,max: 500,location: "G-02-2", unit: "un",  cost: 1.80,   lead: 2,  consumption: [25,30,28,32,29,27,26], abc: "C" },
  { code: "DSJ-3F-32",  name: "Disjuntor tripolar 32A",         category: "Elétrica",   stock: 5,  min: 3,  max: 8,  location: "B-07-4", unit: "un",  cost: 240.00, lead: 10, consumption: [1,1,2,1,1,1,1], abc: "B" },
];

const PURCHASE_ORDERS = [
  { id: "PO-1042", code: "RET-BHD-50",  qty: 20, supplier: "Vedações SP",   eta: "Hoje 11:00",   status: "em rota",   tone: "warn" },
  { id: "PO-1041", code: "CRR-PT-2400", qty: 2,  supplier: "Esteiras Tech", eta: "12/05 (3 dias)", status: "fabricando", tone: "info" },
  { id: "PO-1040", code: "ROL-6310",    qty: 6,  supplier: "SKF Brasil",    eta: "11/05",        status: "aprovada",   tone: "neutral" },
  { id: "PO-1039", code: "CIL-FX-340",  qty: 2,  supplier: "Flexopack",     eta: "30/05",        status: "fabricando", tone: "info" },
];

function StockScreen() {
  const [filter, setFilter] = React.useState("todos");
  const [search, setSearch] = React.useState("");

  const stats = React.useMemo(() => {
    const ruptura = PARTS.filter(p => p.stock < p.min).length;
    const valorTotal = PARTS.reduce((s, p) => s + p.stock * p.cost, 0);
    const itensCriticos = PARTS.filter(p => p.abc === "A" && p.stock <= p.min).length;
    const giroMedio = PARTS.reduce((s, p) => s + p.consumption.reduce((a,b)=>a+b,0), 0) / PARTS.length;
    return { ruptura, valorTotal, itensCriticos, giroMedio };
  }, []);

  const filters = [
    { id: "todos",    label: "Todos",          count: PARTS.length },
    { id: "ruptura",  label: "Ruptura",        count: PARTS.filter(p => p.stock < p.min).length },
    { id: "critico",  label: "Próximo do mín.", count: PARTS.filter(p => p.stock >= p.min && p.stock < p.min * 1.5).length },
    { id: "abc-a",    label: "Curva A",        count: PARTS.filter(p => p.abc === "A").length },
  ];

  const items = PARTS.filter(p => {
    if (filter === "ruptura" && p.stock >= p.min) return false;
    if (filter === "critico" && !(p.stock >= p.min && p.stock < p.min * 1.5)) return false;
    if (filter === "abc-a" && p.abc !== "A") return false;
    if (search && !`${p.code} ${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const fmtBRL = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  return (
    <div className="screen-pad scroll">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Estoque & peças</h1>
          <p className="screen-sub">Almoxarifado central · {PARTS.length} SKUs ativos</p>
        </div>
        <div className="screen-actions">
          <button className="btn">{I.download}<span>Exportar</span></button>
          <button className="btn">{I.request}<span>Solicitar compra</span></button>
          <button className="btn btn-primary">{I.plus}<span>Cadastrar peça</span></button>
        </div>
      </div>

      {/* Resumo */}
      <div className="stock-summary">
        <div className="stock-summary-item" data-tone="crit">
          <div className="week-summary-label">Ruptura</div>
          <div className="week-summary-value mono">{stats.ruptura}</div>
          <div className="stock-summary-foot">SKUs abaixo do mínimo</div>
        </div>
        <div className="stock-summary-item" data-tone="warn">
          <div className="week-summary-label">Itens A críticos</div>
          <div className="week-summary-value mono">{stats.itensCriticos}</div>
          <div className="stock-summary-foot">alta criticidade</div>
        </div>
        <div className="stock-summary-item">
          <div className="week-summary-label">Valor imobilizado</div>
          <div className="week-summary-value mono">{fmtBRL(stats.valorTotal)}</div>
          <div className="stock-summary-foot">total em estoque</div>
        </div>
        <div className="stock-summary-item">
          <div className="week-summary-label">Pedidos abertos</div>
          <div className="week-summary-value mono">{PURCHASE_ORDERS.length}</div>
          <div className="stock-summary-foot">{PURCHASE_ORDERS.filter(p=>p.status==="em rota").length} em rota</div>
        </div>
        <div className="stock-summary-item">
          <div className="week-summary-label">Giro médio (sem.)</div>
          <div className="week-summary-value mono">{stats.giroMedio.toFixed(1)}</div>
          <div className="stock-summary-foot">unidades/SKU</div>
        </div>
      </div>

      <div className="stock-grid">
        {/* Lista de peças */}
        <div className="card stock-card">
          <div className="card-hd">
            <span>Peças & materiais</span>
            <div className="search" style={{ minWidth: 240 }}>
              {I.search}
              <input placeholder="Buscar SKU, descrição…"
                     value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="wo-tabs" style={{ padding: "0 14px" }}>
            {filters.map(f => (
              <button key={f.id} className="wo-tab" data-active={filter === f.id}
                      onClick={() => setFilter(f.id)}>
                <span>{f.label}</span>
                <span className="wo-tab-count mono">{f.count}</span>
              </button>
            ))}
          </div>
          <div className="stock-table-wrap scroll">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Descrição</th>
                  <th>Cat.</th>
                  <th>Local</th>
                  <th>ABC</th>
                  <th>Estoque</th>
                  <th>Mín / Máx</th>
                  <th>Consumo 7d</th>
                  <th>Lead</th>
                  <th>Custo un.</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(p => {
                  const tone = p.stock < p.min ? "crit" : p.stock < p.min * 1.5 ? "warn" : "good";
                  const fillPct = Math.min(100, (p.stock / p.max) * 100);
                  const minPct = (p.min / p.max) * 100;
                  return (
                    <tr key={p.code} data-tone={tone}>
                      <td className="mono">{p.code}</td>
                      <td className="stock-desc">{p.name}</td>
                      <td><span className="pill" style={{ fontSize: 10 }}>{p.category}</span></td>
                      <td className="mono ink-3">{p.location}</td>
                      <td><span className={`abc-badge abc-${p.abc}`}>{p.abc}</span></td>
                      <td>
                        <div className="stock-cell-stock">
                          <span className="mono" style={{ fontWeight: 600, color: tone === "crit" ? "var(--crit)" : tone === "warn" ? "oklch(45% 0.16 65)" : "var(--ink)" }}>
                            {p.stock}
                          </span>
                          <span className="mono ink-3" style={{ fontSize: 10 }}>{p.unit}</span>
                          <div className="stock-gauge" data-tone={tone}>
                            <i style={{ width: `${fillPct}%` }} />
                            <span className="stock-gauge-min" style={{ left: `${minPct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="mono ink-3">{p.min} / {p.max}</td>
                      <td>
                        <Sparkline values={p.consumption} />
                      </td>
                      <td className="mono ink-3">{p.lead}d</td>
                      <td className="mono">{fmtBRL(p.cost)}</td>
                      <td>
                        {p.stock < p.min ? (
                          <button className="btn btn-mini btn-accent">Comprar</button>
                        ) : (
                          <button className="icon-btn-sm">{I.more}</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pedidos de compra */}
        <div className="card">
          <div className="card-hd">
            <span>Pedidos abertos</span>
            <span className="sub">{PURCHASE_ORDERS.length}</span>
          </div>
          <div className="po-list">
            {PURCHASE_ORDERS.map(po => {
              const part = PARTS.find(p => p.code === po.code);
              return (
                <div key={po.id} className="po-row">
                  <div className="po-row-h">
                    <span className="mono">{po.id}</span>
                    <span className="pill" data-tone={po.tone}>{po.status}</span>
                  </div>
                  <div className="po-row-title">
                    <span className="mono ink-3">{po.code}</span>
                    <span style={{ fontSize: 12 }}>{part?.name}</span>
                  </div>
                  <div className="po-row-meta">
                    <span><strong className="mono">{po.qty}</strong> {part?.unit}</span>
                    <span>·</span>
                    <span>{po.supplier}</span>
                  </div>
                  <div className="po-row-eta">
                    <span style={{ color: "var(--ink-3)" }}>{I.clock}</span>
                    <span className="mono">{po.eta}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sparkline minimalista
function Sparkline({ values, width = 80, height = 22 }) {
  const max = Math.max(...values, 1);
  const min = 0;
  const step = width / (values.length - 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / (max - min || 1)) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const last = values[values.length - 1];
  const lastX = (values.length - 1) * step;
  const lastY = height - ((last - min) / (max - min || 1)) * (height - 4) - 2;
  return (
    <svg width={width} height={height} className="sparkline">
      <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={points} />
      <circle cx={lastX} cy={lastY} r="2" fill="currentColor" />
    </svg>
  );
}

window.StockScreen = StockScreen;
window.Sparkline = Sparkline;
