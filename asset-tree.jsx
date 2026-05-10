// ─── Tela: Árvore de ativos (cadastro hierárquico) ───────────────────────────
// Estrutura: Planta → Área → Linha → Equipamento → Componente
// CRUD: adicionar / editar / excluir / mover

const TREE_INITIAL = {
  id: "PL-VIN", kind: "plant", name: "Planta Vinhedo",
  meta: { code: "VIN-01", location: "Vinhedo, SP", criticality: "Estratégica" },
  children: [
    {
      id: "AR-EXT", kind: "area", name: "Extrusão",
      meta: { code: "EXT", supervisor: "R. Souza" },
      children: [
        {
          id: "LN-EX-A", kind: "line", name: "Linha A",
          meta: { code: "LN-EX-A", capacity: "850 kg/h" },
          children: [
            { id: "EX-01", kind: "equipment", name: "Extrusora 01", meta: { tag: "EX-01", model: "Davis-Standard 110mm", year: 2019, criticality: "A" }, children: [
              { id: "EX-01-MT", kind: "component", name: "Motor principal 75 kW", meta: { tag: "EX-01-MT", manufacturer: "WEG" }, children: [] },
              { id: "EX-01-RD", kind: "component", name: "Redutor planetário", meta: { tag: "EX-01-RD", manufacturer: "SEW" }, children: [] },
              { id: "EX-01-HD", kind: "component", name: "Sistema hidráulico", meta: { tag: "EX-01-HD" }, children: [] },
            ]},
            { id: "EX-02", kind: "equipment", name: "Extrusora 02", meta: { tag: "EX-02", model: "Davis-Standard 90mm", year: 2020, criticality: "A" }, children: [] },
          ]
        },
        {
          id: "LN-EX-B", kind: "line", name: "Linha B",
          meta: { code: "LN-EX-B", capacity: "600 kg/h" },
          children: [
            { id: "EX-03", kind: "equipment", name: "Extrusora 03", meta: { tag: "EX-03", model: "Reifenhäuser", year: 2017, criticality: "B" }, children: [] },
          ]
        },
      ]
    },
    {
      id: "AR-IMP", kind: "area", name: "Impressão",
      meta: { code: "IMP", supervisor: "M. Costa" },
      children: [
        { id: "LN-IMP-1", kind: "line", name: "Linha de impressão", meta: { code: "LN-IMP" }, children: [
          { id: "IM-01", kind: "equipment", name: "Impressora Flexo 1", meta: { tag: "IM-01", model: "Bobst F&K", year: 2018, criticality: "A" }, children: [] },
          { id: "IM-02", kind: "equipment", name: "Impressora Flexo 2", meta: { tag: "IM-02", model: "Bobst F&K", year: 2021, criticality: "A" }, children: [] },
        ]},
      ]
    },
    {
      id: "AR-ACA", kind: "area", name: "Acabamento",
      meta: { code: "ACA", supervisor: "C. Mendes" },
      children: [
        { id: "LN-ACA-1", kind: "line", name: "Linha de corte", meta: { code: "LN-CT" }, children: [
          { id: "CT-01", kind: "equipment", name: "Cortadeira 01", meta: { tag: "CT-01", model: "Atlas CW-1500", criticality: "B" }, children: [] },
          { id: "CT-02", kind: "equipment", name: "Cortadeira 02", meta: { tag: "CT-02", model: "Atlas CW-1500", criticality: "B" }, children: [] },
          { id: "RB-01", kind: "equipment", name: "Rebobinadeira 01", meta: { tag: "RB-01", criticality: "C" }, children: [] },
        ]},
      ]
    },
    {
      id: "AR-UTL", kind: "area", name: "Utilidades",
      meta: { code: "UTL", supervisor: "F. Almeida" },
      children: [
        { id: "CP-01", kind: "equipment", name: "Compressor 01", meta: { tag: "CP-01", criticality: "A" }, children: [] },
        { id: "CL-01", kind: "equipment", name: "Chiller 01", meta: { tag: "CL-01", criticality: "B" }, children: [] },
      ]
    },
  ],
};

const KIND_LABEL = { plant: "Planta", area: "Área", line: "Linha", equipment: "Equipamento", component: "Componente" };
const KIND_ICON = {
  plant: "🏭", area: "🏢", line: "▸", equipment: "⚙", component: "·"
};
const KIND_NEXT = { plant: "area", area: "line", line: "equipment", equipment: "component", component: null };

// Helpers de árvore (imutáveis)
function findNode(node, id) {
  if (node.id === id) return node;
  for (const c of node.children) {
    const r = findNode(c, id); if (r) return r;
  }
  return null;
}
function findParent(node, id, parent = null) {
  if (node.id === id) return parent;
  for (const c of node.children) {
    const r = findParent(c, id, node); if (r) return r;
  }
  return null;
}
function mapTree(node, fn) {
  const n = fn(node);
  return { ...n, children: n.children.map(c => mapTree(c, fn)) };
}
function addChild(node, parentId, child) {
  return mapTree(node, n => n.id === parentId ? { ...n, children: [...n.children, child] } : n);
}
function updateNode(node, id, patch) {
  return mapTree(node, n => n.id === id ? { ...n, ...patch } : n);
}
function removeNode(node, id) {
  return mapTree(node, n => ({ ...n, children: n.children.filter(c => c.id !== id) }));
}

function AssetTree({ onJumpMap }) {
  const [tree, setTree] = React.useState(TREE_INITIAL);
  const [selectedId, setSelectedId] = React.useState("EX-01");
  const [expanded, setExpanded] = React.useState(new Set(["PL-VIN", "AR-EXT", "AR-IMP", "AR-ACA", "AR-UTL", "LN-EX-A"]));
  const [editing, setEditing] = React.useState(null); // { mode: 'add'|'edit', parentId, kind, node }
  const [filter, setFilter] = React.useState("");

  const selected = findNode(tree, selectedId) || tree;
  const selParent = findParent(tree, selectedId);

  const toggle = (id) => {
    setExpanded(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleAdd = (parent) => {
    const nextKind = KIND_NEXT[parent.kind];
    if (!nextKind) return;
    setEditing({ mode: "add", parentId: parent.id, kind: nextKind });
  };
  const handleEdit = (node) => setEditing({ mode: "edit", node });
  const handleDelete = (node) => {
    if (!confirm(`Excluir "${node.name}" e todos seus sub-itens?`)) return;
    setTree(t => removeNode(t, node.id));
    window.showToast?.(`"${node.name}" removido`, "warn");
    if (selectedId === node.id) setSelectedId(tree.id);
  };
  const saveEdit = (data) => {
    if (editing.mode === "add") {
      const id = data.tag || `N-${Date.now()}`;
      const newNode = { id, kind: editing.kind, name: data.name, meta: data, children: [] };
      setTree(t => addChild(t, editing.parentId, newNode));
      setExpanded(s => new Set([...s, editing.parentId]));
      setSelectedId(id);
      window.showToast?.(`${KIND_LABEL[editing.kind]} "${data.name}" cadastrado`, "good", `Pai: ${findNode(tree, editing.parentId)?.name}`);
    } else {
      setTree(t => updateNode(t, editing.node.id, { name: data.name, meta: { ...editing.node.meta, ...data } }));
      window.showToast?.(`"${data.name}" atualizado`, "good");
    }
    setEditing(null);
  };

  // Conta total
  const countNodes = (n) => 1 + n.children.reduce((s, c) => s + countNodes(c), 0);
  const countByKind = (n, kind) => (n.kind === kind ? 1 : 0) + n.children.reduce((s, c) => s + countByKind(c, kind), 0);
  const total = countNodes(tree) - 1; // -planta
  const totals = {
    area: countByKind(tree, "area"),
    line: countByKind(tree, "line"),
    equipment: countByKind(tree, "equipment"),
    component: countByKind(tree, "component"),
  };

  return (
    <div className="tree-screen">
      <div className="tree-toolbar">
        <input className="tree-search form-input"
               placeholder="Buscar por tag, nome ou código…"
               value={filter}
               onChange={(e) => setFilter(e.target.value)} />
        <div className="tree-totals">
          <span><b>{totals.area}</b> áreas</span>
          <span>·</span>
          <span><b>{totals.line}</b> linhas</span>
          <span>·</span>
          <span><b>{totals.equipment}</b> equipamentos</span>
          <span>·</span>
          <span><b>{totals.component}</b> componentes</span>
        </div>
        <button className="btn" data-no-toast="true"
                onClick={() => { setExpanded(new Set([tree.id, ...tree.children.map(c => c.id)])); }}>
          Recolher tudo
        </button>
        <button className="btn btn-primary" data-no-toast="true"
                onClick={() => handleAdd(tree)}>
          + Nova área
        </button>
      </div>

      <div className="tree-grid">
        <div className="tree-pane scroll">
          <TreeNode node={tree} depth={0}
                    expanded={expanded} toggle={toggle}
                    selectedId={selectedId} onSelect={setSelectedId}
                    onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete}
                    filter={filter.trim().toLowerCase()} />
        </div>

        <div className="tree-detail scroll">
          <NodeDetail node={selected} parent={selParent}
                      onAdd={() => handleAdd(selected)}
                      onEdit={() => handleEdit(selected)}
                      onDelete={() => selected.kind !== "plant" && handleDelete(selected)}
                      onJumpMap={onJumpMap} />
        </div>
      </div>

      {editing && (
        <NodeEditModal editing={editing} tree={tree}
                       onClose={() => setEditing(null)}
                       onSave={saveEdit} />
      )}
    </div>
  );
}

function TreeNode({ node, depth, expanded, toggle, selectedId, onSelect, onAdd, onEdit, onDelete, filter }) {
  const isExp = expanded.has(node.id);
  const hasChildren = node.children.length > 0;
  const matches = !filter ||
    node.name.toLowerCase().includes(filter) ||
    node.id.toLowerCase().includes(filter) ||
    JSON.stringify(node.meta || {}).toLowerCase().includes(filter);
  const childrenMatch = node.children.some(c => filterMatches(c, filter));
  if (filter && !matches && !childrenMatch) return null;
  const showChildren = isExp || (filter && childrenMatch);

  return (
    <>
      <div className={`tree-row ${selectedId === node.id ? "is-selected" : ""}`}
           data-kind={node.kind}
           style={{ paddingLeft: 8 + depth * 18 }}
           onClick={() => onSelect(node.id)}>
        {hasChildren ? (
          <button className="tree-chev" data-no-toast="true"
                  onClick={(e) => { e.stopPropagation(); toggle(node.id); }}>
            <span style={{ transform: showChildren ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block", transition: "transform 0.15s" }}>▸</span>
          </button>
        ) : (
          <span className="tree-chev tree-chev-empty">·</span>
        )}
        <span className="tree-kind-icon" data-kind={node.kind}>{KIND_ICON[node.kind]}</span>
        <span className="tree-name">{node.name}</span>
        <span className="tree-id mono">{node.id}</span>
        <div className="tree-actions">
          {KIND_NEXT[node.kind] && (
            <button className="tree-act" data-no-toast="true" title={`Adicionar ${KIND_LABEL[KIND_NEXT[node.kind]]}`}
                    onClick={(e) => { e.stopPropagation(); onAdd(node); }}>＋</button>
          )}
          <button className="tree-act" data-no-toast="true" title="Editar"
                  onClick={(e) => { e.stopPropagation(); onEdit(node); }}>✎</button>
          {node.kind !== "plant" && (
            <button className="tree-act tree-act-danger" data-no-toast="true" title="Excluir"
                    onClick={(e) => { e.stopPropagation(); onDelete(node); }}>✕</button>
          )}
        </div>
      </div>
      {showChildren && node.children.map(c => (
        <TreeNode key={c.id} node={c} depth={depth + 1}
                  expanded={expanded} toggle={toggle}
                  selectedId={selectedId} onSelect={onSelect}
                  onAdd={onAdd} onEdit={onEdit} onDelete={onDelete}
                  filter={filter} />
      ))}
    </>
  );
}

function filterMatches(node, filter) {
  if (!filter) return true;
  if (node.name.toLowerCase().includes(filter)) return true;
  if (node.id.toLowerCase().includes(filter)) return true;
  return node.children.some(c => filterMatches(c, filter));
}

function NodeDetail({ node, parent, onAdd, onEdit, onDelete, onJumpMap }) {
  const childKind = KIND_NEXT[node.kind];
  return (
    <>
      <div className="nd-h">
        <div>
          <div className="nd-kind">{KIND_LABEL[node.kind]}</div>
          <div className="nd-name">{node.name}</div>
          <div className="nd-meta">
            <span className="mono">{node.id}</span>
            {parent && <><span className="dot-sep">·</span><span>em {parent.name}</span></>}
          </div>
        </div>
        <div className="nd-h-actions">
          {childKind && (
            <button className="btn btn-primary" data-no-toast="true" onClick={onAdd}>
              + {KIND_LABEL[childKind]}
            </button>
          )}
          <button className="btn" data-no-toast="true" onClick={onEdit}>Editar</button>
          {node.kind !== "plant" && (
            <button className="btn" data-no-toast="true" onClick={onDelete}>Excluir</button>
          )}
        </div>
      </div>

      <div className="nd-fields">
        <div className="nd-fields-h">Atributos</div>
        {Object.entries(node.meta || {}).map(([k, v]) => (
          <div key={k} className="nd-field">
            <span className="nd-field-k">{k}</span>
            <span className="nd-field-v">{v || "—"}</span>
          </div>
        ))}
        {(!node.meta || Object.keys(node.meta).length === 0) && (
          <div className="ink-3" style={{ fontSize: 12 }}>Nenhum atributo cadastrado.</div>
        )}
      </div>

      {node.children.length > 0 && (
        <div className="nd-children">
          <div className="nd-fields-h">Filhos diretos · {node.children.length}</div>
          {node.children.map(c => (
            <div key={c.id} className="nd-child" data-kind={c.kind}>
              <span className="tree-kind-icon" data-kind={c.kind}>{KIND_ICON[c.kind]}</span>
              <span className="nd-child-name">{c.name}</span>
              <span className="nd-child-id mono">{c.id}</span>
              <span className="nd-child-count ink-3">
                {c.children.length > 0 ? `${c.children.length} item${c.children.length > 1 ? "s" : ""}` : "—"}
              </span>
            </div>
          ))}
        </div>
      )}

      {node.kind === "equipment" && (
        <div className="nd-quick">
          <div className="nd-fields-h">Ações rápidas</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn"
                    onClick={() => window.dispatchEvent(new CustomEvent("__open_new_wo", { detail: { equipamento: node.id, titulo: `${node.name} — ` } }))}>
              + Abrir OS para este ativo
            </button>
            <button className="btn"
                    onClick={() => window.dispatchEvent(new CustomEvent("__open_asset", { detail: node.id }))}>
              Detalhes & saúde
            </button>
            <button className="btn" onClick={onJumpMap}>Ver no mapa</button>
          </div>
        </div>
      )}
    </>
  );
}

function NodeEditModal({ editing, tree, onClose, onSave }) {
  const initial = editing.mode === "edit"
    ? { name: editing.node.name, ...editing.node.meta }
    : {};
  const kind = editing.mode === "add" ? editing.kind : editing.node.kind;
  const [form, setForm] = React.useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Campos por tipo
  const fields = {
    area: [
      { k: "code", l: "Código", req: true },
      { k: "supervisor", l: "Supervisor responsável" },
    ],
    line: [
      { k: "code", l: "Código", req: true },
      { k: "capacity", l: "Capacidade" },
    ],
    equipment: [
      { k: "tag", l: "Tag (identificador)", req: true, hint: "Ex.: EX-01" },
      { k: "model", l: "Modelo / fabricante" },
      { k: "year", l: "Ano de instalação", type: "number" },
      { k: "criticality", l: "Criticidade", type: "select", options: ["A", "B", "C"] },
    ],
    component: [
      { k: "tag", l: "Tag", req: true },
      { k: "manufacturer", l: "Fabricante" },
    ],
  }[kind] || [];

  const valid = form.name && fields.filter(f => f.req).every(f => form[f.k]);

  return (
    <div className="modal-backdrop" onClick={onClose} data-no-toast-zone>
      <div className="modal" style={{ width: 540 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-h">
          <div>
            <div className="modal-title">
              {editing.mode === "add" ? `Novo(a) ${KIND_LABEL[kind]}` : `Editar ${KIND_LABEL[kind]}`}
            </div>
            <div className="modal-sub">
              {editing.mode === "add"
                ? `Será adicionado em: ${findNode(tree, editing.parentId)?.name}`
                : "Atualizar atributos do ativo"}
            </div>
          </div>
          <button className="icon-btn" data-no-toast="true" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <label className="form-label">Nome *</label>
            <input className="form-input" autoFocus
                   value={form.name || ""}
                   onChange={(e) => set("name", e.target.value)}
                   placeholder={`Nome do(a) ${KIND_LABEL[kind].toLowerCase()}`} />
          </div>
          {fields.map(f => (
            <div key={f.k} className="form-row">
              <label className="form-label">{f.l}{f.req && " *"}</label>
              {f.type === "select" ? (
                <select className="form-input" value={form[f.k] || ""}
                        onChange={(e) => set(f.k, e.target.value)}>
                  <option value="">—</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input className="form-input" type={f.type || "text"}
                       value={form[f.k] || ""}
                       onChange={(e) => set(f.k, e.target.value)}
                       placeholder={f.hint} />
              )}
            </div>
          ))}
        </div>

        <div className="modal-foot">
          <span style={{ fontSize: 11, color: "var(--ink-3)" }}>* campos obrigatórios</span>
          <div className="modal-foot-r">
            <button className="btn" data-no-toast="true" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" data-no-toast="true"
                    disabled={!valid}
                    onClick={() => onSave(form)}>
              {editing.mode === "add" ? "Cadastrar" : "Salvar alterações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.AssetTree = AssetTree;
