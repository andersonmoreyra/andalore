// ─── Tela: Relatórios & Indicadores ──────────────────────────────────────────
// Visão executiva: MTBF, MTTR, disponibilidade, Pareto de falhas, custos, top ofensores

function Sparkline({ values, width, height }) {
  if (!values || values.length === 0) return null;
  
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 12 meses de dados
const MONTHS = ["Jun","Jul","Ago","Set","Out","Nov","Dez","Jan","Fev","Mar","Abr","Mai"];

const MTBF_HIST = [380, 410, 395, 440, 460, 455, 480, 495, 510, 540, 560, 580];
const MTTR_HIST = [3.8, 3.6, 3.7, 3.4, 3.2, 3.3, 3.0, 2.8, 2.7, 2.5, 2.4, 2.4];
const AVAIL_HIST = [89.2, 90.1, 89.8, 91.0, 91.8, 91.5, 92.4, 93.0, 93.4, 93.9, 94.0, 94.2];

// Pareto de causas raiz (12 meses)
const CAUSES = [
  { label: "Desgaste mecânico",     count: 142, color: "var(--crit)" },
  { label: "Falha elétrica",        count: 96,  color: "var(--warn)" },
  { label: "Operação inadequada",   count: 64,  color: "var(--info)" },
  { label: "Lubrificação",          count: 48,  color: "var(--preditivo)" },
  { label: "Contaminação",          count: 32,  color: "var(--good)" },
  { label: "Falha de instrum.",     count: 24,  color: "oklch(60% 0.14 200)" },
  { label: "Outros",                count: 18,  color: "var(--ink-3)" },
];

// Custo de manutenção por mês (R$ mil)
const COST_HIST = [
  { m: "Jun", corretiva: 124, preventiva: 88, preditiva: 42 },
  { m: "Jul", corretiva: 132, preventiva: 92, preditiva: 44 },
  { m: "Ago", corretiva: 118, preventiva: 95, preditiva: 48 },
  { m: "Set", corretiva: 96,  preventiva: 102, preditiva: 52 },
  { m: "Out", corretiva: 88,  preventiva: 110, preditiva: 56 },
  { m: "Nov", corretiva: 102, preventiva: 105, preditiva: 54 },
  { m: "Dez", corretiva: 78,  preventiva: 115, preditiva: 60 },
  { m: "Jan", corretiva: 72,  preventiva: 118, preditiva: 62 },
  { m: "Fev", corretiva: 68,  preventiva: 120, preditiva: 64 },
  { m: "Mar", corretiva: 64,  preventiva: 122, preditiva: 68 },
  { m: "Abr", corretiva: 58,  preventiva: 125, preditiva: 70 },
  { m: "Mai", corretiva: 52,  preventiva: 128, preditiva: 72 },
];

// Top ofensores
const TOP_OFFENDERS = [
  { id: "EX-01", name: "Extrusora 01",       failures: 18, downtime: 42, cost: 86 },
  { id: "IM-01", name: "Impressora Flexo 1", failures: 14, downtime: 38, cost: 72 },
  { id: "CT-01", name: "Cortadeira 01",      failures: 11, downtime: 24, cost: 48 },
  { id: "EX-02", name: "Extrusora 02",       failures: 9,  downtime: 18, cost: 38 },
  { id: "CT-02", name: "Cortadeira 02",      failures: 7,  downtime: 16, cost: 32 },
];

// ─── Componentes de gráficos ─────────────────────────────────────────────────

function LineChart({ data, height = 140, color = "var(--accent)", labels, formatY = (v) => v }) {
  const W = 600, H = height;
  const padL = 36, padR = 12, padT = 14, padB = 22;
  const max = Math.max(...data) * 1.1;
  const min = Math.min(...data) * 0.9;
  const xStep = (W - padL - padR) / (data.length - 1);
  const yScale = (v) => H - padB - ((v - min) / (max - min)) * (H - padT - padB);

  const points = data.map((v, i) => `${padL + i * xStep},${yScale(v)}`);
  const line = points.join(" ");
  const area = `M${padL},${H - padB} L${points.join(" L")} L${padL + (data.length - 1) * xStep},${H - padB} Z`;

  // Y ticks
  const yTicks = [min, min + (max - min) / 2, max];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" preserveAspectRatio="none">
      {/* Y grid */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={yScale(t)} x2={W - padR} y2={yScale(t)}
                stroke="currentColor" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 3" />
          <text x={padL - 6} y={yScale(t) + 3} fontSize="9" fill="currentColor" opacity="0.55" textAnchor="end" fontFamily="var(--font-mono)">
            {formatY(t)}
          </text>
        </g>
      ))}
      {/* X labels */}
      {labels.map((l, i) => (
        <text key={i} x={padL + i * xStep} y={H - 6} fontSize="9.5" fill="currentColor"
              opacity="0.55" textAnchor="middle">{l}</text>
      ))}
      {/* Area + line */}
      <path d={area} fill={color} opacity="0.08" />
      <polyline fill="none" stroke={color} strokeWidth="1.8" points={line}
                strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point */}
      <circle cx={padL + (data.length - 1) * xStep} cy={yScale(data[data.length - 1])}
              r="3.5" fill="var(--surface)" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

function BarStackedChart({ data, height = 200 }) {
  const W = 720, H = height;
  const padL = 36, padR = 12, padT = 14, padB = 24;
  const barW = (W - padL - padR) / data.length * 0.7;
  const gap = (W - padL - padR) / data.length * 0.3;
  const step = (W - padL - padR) / data.length;
  const max = Math.max(...data.map(d => d.corretiva + d.preventiva + d.preditiva)) * 1.1;
  const yScale = (v) => H - padB - (v / max) * (H - padT - padB);

  const yTicks = [0, max / 2, max];
  const colors = {
    corretiva: "var(--crit)",
    preventiva: "var(--info)",
    preditiva: "var(--preditivo)",
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" preserveAspectRatio="none">
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={yScale(t)} x2={W - padR} y2={yScale(t)}
                stroke="currentColor" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 3" />
          <text x={padL - 6} y={yScale(t) + 3} fontSize="9" fill="currentColor" opacity="0.55" textAnchor="end" fontFamily="var(--font-mono)">
            {Math.round(t)}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = padL + i * step + gap / 2;
        let y = H - padB;
        const segs = [
          { val: d.corretiva,  color: colors.corretiva },
          { val: d.preventiva, color: colors.preventiva },
          { val: d.preditiva,  color: colors.preditiva },
        ];
        return (
          <g key={i}>
            {segs.map((s, j) => {
              const segH = (s.val / max) * (H - padT - padB);
              y -= segH;
              return <rect key={j} x={x} y={y} width={barW} height={segH} fill={s.color}
                           rx={j === 2 ? 2 : 0} />;
            })}
            <text x={x + barW / 2} y={H - 8} fontSize="9.5" fill="currentColor"
                  opacity="0.55" textAnchor="middle">{d.m}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ParetoChart({ data, height = 200 }) {
  const W = 580, H = height;
  const padL = 36, padR = 36, padT = 14, padB = 56;
  const total = data.reduce((s, d) => s + d.count, 0);
  const max = Math.max(...data.map(d => d.count)) * 1.1;
  const step = (W - padL - padR) / data.length;
  const barW = step * 0.65;
  const yScale = (v) => H - padB - (v / max) * (H - padT - padB);

  // Acumulada (linha %)
  let cum = 0;
  const points = data.map((d, i) => {
    cum += d.count;
    const x = padL + i * step + step / 2;
    const y = H - padB - (cum / total) * (H - padT - padB);
    return { x, y, pct: cum / total };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart">
      {/* Y grid */}
      {[0, max/2, max].map((t, i) => (
        <line key={i} x1={padL} y1={yScale(t)} x2={W - padR} y2={yScale(t)}
              stroke="currentColor" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 3" />
      ))}
      {[0, max/2, max].map((t, i) => (
        <text key={`y${i}`} x={padL - 6} y={yScale(t) + 3} fontSize="9" fill="currentColor"
              opacity="0.55" textAnchor="end" fontFamily="var(--font-mono)">{Math.round(t)}</text>
      ))}
      {/* Bars */}
      {data.map((d, i) => {
        const x = padL + i * step + (step - barW) / 2;
        const h = (d.count / max) * (H - padT - padB);
        return (
          <g key={i}>
            <rect x={x} y={H - padB - h} width={barW} height={h} fill={d.color} rx="2" />
            <text x={x + barW / 2} y={H - padB + 14} fontSize="9" fill="currentColor"
                  opacity="0.65" textAnchor="middle">
              <tspan>{d.label.length > 14 ? d.label.slice(0, 12) + "…" : d.label}</tspan>
            </text>
            <text x={x + barW / 2} y={H - padB + 26} fontSize="8.5" fill="currentColor"
                  opacity="0.45" textAnchor="middle" fontFamily="var(--font-mono)">{d.count}</text>
          </g>
        );
      })}
      {/* Cumulative line */}
      <polyline fill="none" stroke="var(--accent)" strokeWidth="1.5"
                points={points.map(p => `${p.x},${p.y}`).join(" ")} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5" />
      ))}
      {/* 80% line */}
      <line x1={padL} y1={yScale(max) + (H - padT - padB) * 0.2}
            x2={W - padR} y2={yScale(max) + (H - padT - padB) * 0.2}
            stroke="var(--ink-3)" strokeWidth="0.8" strokeDasharray="2 4" />
      <text x={W - padR + 4} y={yScale(max) + (H - padT - padB) * 0.2 + 3}
            fontSize="9" fill="var(--ink-3)" fontFamily="var(--font-mono)">80%</text>
    </svg>
  );
}

// ─── Tela ────────────────────────────────────────────────────────────────────

function ReportsScreen() {
  const [period, setPeriod] = React.useState("12m");
  const last = (arr) => arr[arr.length - 1];
  const prev = (arr) => arr[arr.length - 2];
  const delta = (arr) => last(arr) - prev(arr);

  return (
    <div className="screen-pad scroll">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Relatórios & indicadores</h1>
          <p className="screen-sub">Análise consolidada · Planta Vinhedo</p>
        </div>
        <div className="screen-actions">
          <div className="btn-group">
            <button className="btn" data-active={period === "30d"} onClick={() => setPeriod("30d")}>30 dias</button>
            <button className="btn" data-active={period === "90d"} onClick={() => setPeriod("90d")}>90 dias</button>
            <button className="btn" data-active={period === "12m"} onClick={() => setPeriod("12m")}>12 meses</button>
          </div>
          <button className="btn">{I.download}<span>Exportar PDF</span></button>
        </div>
      </div>

      {/* KPIs grandes com tendência */}
      <div className="report-kpis">
        <KpiCard label="MTBF" value={last(MTBF_HIST).toFixed(0)} unit="h"
                 delta={`+${delta(MTBF_HIST)}h`} trend="up" tone="good"
                 series={MTBF_HIST} color="var(--good)"
                 subtitle="Tempo médio entre falhas" />
        <KpiCard label="MTTR" value={last(MTTR_HIST).toFixed(1)} unit="h"
                 delta={`${delta(MTTR_HIST).toFixed(1)}h`} trend="down" tone="good"
                 series={MTTR_HIST} color="var(--info)"
                 subtitle="Tempo médio de reparo" />
        <KpiCard label="Disponibilidade" value={last(AVAIL_HIST).toFixed(1)} unit="%"
                 delta={`+${delta(AVAIL_HIST).toFixed(1)} pp`} trend="up" tone="good"
                 series={AVAIL_HIST} color="var(--accent)"
                 subtitle="Uptime acumulado" />
        <KpiCard label="Custo total (mês)" value="R$ 252k"
                 delta="−6%" trend="down" tone="good"
                 series={COST_HIST.map(c => c.corretiva + c.preventiva + c.preditiva)}
                 color="var(--preditivo)"
                 subtitle="Comparado ao mês anterior" />
      </div>

      <div className="report-grid">
        {/* MTBF/MTTR/Avail tendência */}
        <div className="card">
          <div className="card-hd">
            <span>Tendência de indicadores</span>
            <span className="sub">12 meses · evolução</span>
          </div>
          <div className="report-multichart">
            <ChartBlock title="MTBF" unit="h" series={MTBF_HIST} color="var(--good)" labels={MONTHS} />
            <ChartBlock title="MTTR" unit="h" series={MTTR_HIST} color="var(--info)" labels={MONTHS} formatY={(v) => v.toFixed(1)} />
            <ChartBlock title="Disponibilidade" unit="%" series={AVAIL_HIST} color="var(--accent)" labels={MONTHS} formatY={(v) => v.toFixed(1)} />
          </div>
        </div>

        {/* Pareto */}
        <div className="card">
          <div className="card-hd">
            <span>Causas raiz (Pareto)</span>
            <span className="sub">12 meses · {CAUSES.reduce((s,c) => s + c.count, 0)} ocorrências</span>
          </div>
          <div className="chart-wrap">
            <ParetoChart data={CAUSES} />
          </div>
          <div className="chart-legend">
            <strong>Os 3 primeiros respondem por 75% das falhas.</strong>
            <span style={{ color: "var(--ink-3)" }}>Foco preditivo recomendado em desgaste mecânico.</span>
          </div>
        </div>
      </div>

      {/* Custos */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-hd">
          <span>Composição de custos por tipo</span>
          <div style={{ display: "flex", gap: 14, fontSize: 11.5, color: "var(--ink-2)" }}>
            <LegendDot color="var(--crit)" label="Corretiva" />
            <LegendDot color="var(--info)" label="Preventiva" />
            <LegendDot color="var(--preditivo)" label="Preditiva" />
            <span className="sub">R$ mil/mês</span>
          </div>
        </div>
        <div className="chart-wrap">
          <BarStackedChart data={COST_HIST} />
        </div>
        <div className="chart-legend chart-legend-cols">
          <div>
            <span className="chart-legend-label">Corretiva</span>
            <span className="mono" style={{ fontWeight: 600, color: "var(--crit)" }}>R$ 52k</span>
            <span className="mono" style={{ color: "var(--good)" }}>−58% vs Jun</span>
          </div>
          <div>
            <span className="chart-legend-label">Preventiva</span>
            <span className="mono" style={{ fontWeight: 600, color: "var(--info)" }}>R$ 128k</span>
            <span className="mono" style={{ color: "var(--ink-3)" }}>+45% vs Jun</span>
          </div>
          <div>
            <span className="chart-legend-label">Preditiva</span>
            <span className="mono" style={{ fontWeight: 600, color: "var(--preditivo)" }}>R$ 72k</span>
            <span className="mono" style={{ color: "var(--ink-3)" }}>+71% vs Jun</span>
          </div>
        </div>
      </div>

      {/* Top ofensores */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-hd">
          <span>Top 5 ativos ofensores</span>
          <span className="sub">12 meses · ranking por horas paradas</span>
        </div>
        <table className="offender-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}>#</th>
              <th>Ativo</th>
              <th>Falhas</th>
              <th style={{ width: "30%" }}>Horas paradas</th>
              <th>Custo</th>
              <th style={{ width: 80 }}></th>
            </tr>
          </thead>
          <tbody>
            {TOP_OFFENDERS.map((a, i) => {
              const maxDt = Math.max(...TOP_OFFENDERS.map(x => x.downtime));
              return (
                <tr key={a.id}>
                  <td className="mono ink-3">{String(i + 1).padStart(2, "0")}</td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontWeight: 500 }}>{a.nome}</span>
                      <span className="mono ink-3" style={{ fontSize: 10.5 }}>{a.id}</span>
                    </div>
                  </td>
                  <td className="mono">{a.failures}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="bar" style={{ flex: 1 }} data-tone={i === 0 ? "crit" : i < 2 ? "warn" : "accent"}>
                        <i style={{ width: `${(a.downtime / maxDt) * 100}%` }} />
                      </div>
                      <span className="mono" style={{ fontWeight: 500, minWidth: 36, textAlign: "right" }}>{a.downtime}h</span>
                    </div>
                  </td>
                  <td className="mono">R$ {a.cost}k</td>
                  <td><button className="btn btn-mini">Inspecionar</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ label, value, unit, delta, trend, tone, series, color, subtitle }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card-h">
        <span className="kpi-card-label">{label}</span>
        <span className="pill" data-tone={tone}>
          {trend === "up" ? "↑" : "↓"} {delta}
        </span>
      </div>
      <div className="kpi-card-value">
        <span className="mono">{value}</span>
        <span className="kpi-card-unit">{unit}</span>
      </div>
      <div className="kpi-card-sub">{subtitle}</div>
      <div className="kpi-card-spark" style={{ color }}>
        <Sparkline values={series} width={240} height={36} />
      </div>
    </div>
  );
}

function ChartBlock({ title, unit, series, color, labels, formatY }) {
  return (
    <div className="chart-block">
      <div className="chart-block-h">
        <span className="chart-block-title">{title}</span>
        <span className="mono chart-block-value" style={{ color }}>{series[series.length - 1]}{unit}</span>
      </div>
      <div className="chart-wrap">
        <LineChart data={series} labels={labels} color={color} formatY={formatY} />
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
      <span>{label}</span>
    </span>
  );
}

window.ReportsScreen = ReportsScreen;
