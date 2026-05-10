// ─── Command Palette / Search global (Cmd+K) ─────────────────────────────────

const CMD_INDEX = [
  // Ações rápidas
  { kind: "action", icon: "plus",   label: "Criar ordem de serviço",   hint: "Nova OS",            shortcut: "N",   group: "Ações" },
  { kind: "action", icon: "plus",   label: "Abrir solicitação",        hint: "Triagem",            shortcut: "S",   group: "Ações" },
  { kind: "action", icon: "list",   label: "Reatribuir OS atrasadas",   hint: "3 OS fora do SLA",  group: "Ações" },
  { kind: "action", icon: "calendar", label: "Reagendar turno",        hint: "Hoje · noturno",     group: "Ações" },
  { kind: "action", icon: "download", label: "Exportar relatório PDF",  hint: "12 meses",          group: "Ações" },

  // Telas
  { kind: "nav", icon: "dashboard", label: "Sala de controle",   target: "dashboard",   group: "Ir para" },
  { kind: "nav", icon: "list",      label: "Ordens de serviço",  target: "ordens",      group: "Ir para" },
  { kind: "nav", icon: "calendar",  label: "Agenda do turno",    target: "agenda",      group: "Ir para" },
  { kind: "nav", icon: "asset",     label: "Ativos & planta",    target: "ativos",      group: "Ir para" },
  { kind: "nav", icon: "team",      label: "Equipe",             target: "equipe",      group: "Ir para" },
  { kind: "nav", icon: "request",   label: "Solicitações",       target: "solicitacoes",group: "Ir para" },
  { kind: "nav", icon: "parts",     label: "Estoque",            target: "estoque",     group: "Ir para" },
  { kind: "nav", icon: "reports",   label: "Relatórios",         target: "relatorios",  group: "Ir para" },

  // Ordens
  { kind: "order", icon: "list", label: "OS #4521 · Cortadeira 02 — vibração",   hint: "Crítica · Carlos M.", tone: "crit",  group: "Ordens" },
  { kind: "order", icon: "list", label: "OS #4519 · Impressora Flexo — preventiva", hint: "Em andamento · J. Pereira", tone: "info", group: "Ordens" },
  { kind: "order", icon: "list", label: "OS #4517 · Extrusora 01 — alinhamento", hint: "Aguardando peça", tone: "warn", group: "Ordens" },
  { kind: "order", icon: "list", label: "OS #4514 · Empilhadeira 03 — bateria",  hint: "Concluída", tone: "good", group: "Ordens" },

  // Ativos
  { kind: "asset", icon: "asset", label: "EX-01 · Extrusora 01",       hint: "Saúde 62% · vibração alta", tone: "warn", group: "Ativos" },
  { kind: "asset", icon: "asset", label: "IM-01 · Impressora Flexo 1", hint: "Saúde 88% · operacional",   tone: "good", group: "Ativos" },
  { kind: "asset", icon: "asset", label: "CT-01 · Cortadeira 01",      hint: "Saúde 91% · operacional",   tone: "good", group: "Ativos" },
  { kind: "asset", icon: "asset", label: "CT-02 · Cortadeira 02",      hint: "Em parada · OS #4521",      tone: "crit", group: "Ativos" },

  // Equipe
  { kind: "person", icon: "team", label: "Carlos Mendes",  hint: "Mecânico sênior · em campo", group: "Pessoas" },
  { kind: "person", icon: "team", label: "Juliana Pereira", hint: "Eletricista · disponível",   group: "Pessoas" },
  { kind: "person", icon: "team", label: "Ricardo Souza",  hint: "Coordenador · sala",          group: "Pessoas" },
  { kind: "person", icon: "team", label: "Marina Lopes",   hint: "Mecânica · folga",            group: "Pessoas" },

  // Peças
  { kind: "part", icon: "parts", label: "Rolamento SKF 6308",    hint: "12 un. · estoque OK",  tone: "good", group: "Peças" },
  { kind: "part", icon: "parts", label: "Filtro hidráulico HF-204", hint: "3 un. · abaixo do mín.", tone: "crit", group: "Peças" },
  { kind: "part", icon: "parts", label: "Correia sincronizadora 8M", hint: "0 un. · pedido em curso", tone: "crit", group: "Peças" },
  { kind: "part", icon: "parts", label: "Sensor de vibração S-A12",  hint: "5 un. · estoque OK",   tone: "good", group: "Peças" },
];

// Score difuso simples
function fuzzyScore(query, text) {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t === q) return 1000;
  if (t.startsWith(q)) return 500 - (t.length - q.length);
  const idx = t.indexOf(q);
  if (idx >= 0) return 200 - idx;
  // Match por iniciais / substrings esparsas
  let qi = 0, score = 0, last = -1;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      score += last >= 0 && i === last + 1 ? 5 : 1;
      last = i; qi++;
    }
  }
  return qi === q.length ? score : -1;
}

function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [hover, setHover] = React.useState(0);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);

  // Atalho global
  React.useEffect(() => {
    const onKey = (e) => {
      const isK = (e.key === "k" || e.key === "K");
      if (isK && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(o => !o);
        setQuery("");
        setHover(0);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Foco no input quando abre
  React.useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  // Listener para o botão de busca da topbar
  React.useEffect(() => {
    const handler = () => { setOpen(true); setQuery(""); setHover(0); };
    window.addEventListener("__open_command_palette", handler);
    return () => window.removeEventListener("__open_command_palette", handler);
  }, []);

  const results = React.useMemo(() => {
    if (!query) return CMD_INDEX;
    return CMD_INDEX
      .map(it => ({ it, score: fuzzyScore(query, it.label + " " + (it.hint || "")) }))
      .filter(x => x.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.it);
  }, [query]);

  // Agrupar
  const grouped = React.useMemo(() => {
    const map = new Map();
    results.forEach(r => {
      if (!map.has(r.group)) map.set(r.group, []);
      map.get(r.group).push(r);
    });
    return Array.from(map.entries());
  }, [results]);

  // Flat list para navegação por teclado
  const flat = results;

  // Reset hover quando query muda
  React.useEffect(() => { setHover(0); }, [query]);

  // Scroll item ativo
  React.useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector(`[data-idx="${hover}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [hover, open]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setHover(h => Math.min(flat.length - 1, h + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHover(h => Math.max(0, h - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); execute(flat[hover]); }
  };

  const execute = (item) => {
    if (!item) return;
    if (item.kind === "nav" && item.target) {
      window.dispatchEvent(new CustomEvent("__nav", { detail: item.target }));
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="cmdk-backdrop" onClick={() => setOpen(false)}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input-wrap">
          <span className="cmdk-input-icon">{I.search}</span>
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Buscar ordens, ativos, peças, pessoas, ações…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <kbd className="cmdk-kbd">esc</kbd>
        </div>

        <div className="cmdk-list scroll" ref={listRef}>
          {flat.length === 0 && (
            <div className="cmdk-empty">
              <strong>Nada encontrado</strong>
              <span>Tente termos como "extrusora", "OS 4521", "filtro" ou "carlos".</span>
            </div>
          )}

          {grouped.map(([group, items]) => (
            <div key={group} className="cmdk-group">
              <div className="cmdk-group-h">{group}</div>
              {items.map(it => {
                const idx = flat.indexOf(it);
                return (
                  <button
                    key={it.label}
                    className="cmdk-item"
                    data-idx={idx}
                    data-active={idx === hover}
                    data-tone={it.tone || ""}
                    onMouseEnter={() => setHover(idx)}
                    onClick={() => execute(it)}
                  >
                    <span className="cmdk-item-icon">{I[it.icon]}</span>
                    <span className="cmdk-item-body">
                      <span className="cmdk-item-label">{it.label}</span>
                      {it.hint && <span className="cmdk-item-hint">{it.hint}</span>}
                    </span>
                    {it.shortcut && <kbd className="cmdk-kbd">{it.shortcut}</kbd>}
                    {idx === hover && <span className="cmdk-item-arrow">↵</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="cmdk-foot">
          <span className="cmdk-foot-hint"><kbd>↑↓</kbd> navegar</span>
          <span className="cmdk-foot-hint"><kbd>↵</kbd> selecionar</span>
          <span className="cmdk-foot-hint"><kbd>esc</kbd> fechar</span>
          <span className="cmdk-foot-spacer" />
          <span className="cmdk-foot-hint cmdk-foot-tip"><kbd>⌘</kbd><kbd>K</kbd> a qualquer momento</span>
        </div>
      </div>
    </div>
  );
}

window.CommandPalette = CommandPalette;
