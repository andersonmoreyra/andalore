// ─── Tela: Configurações (cadastro de pessoas, papéis, permissões) ──────────

const ROLES_INITIAL = [
  { id: "admin", name: "Administrador", color: "var(--crit)",
    description: "Acesso completo. Gerencia usuários, papéis e configurações do sistema.",
    perms: { dashboard: "edit", ordens: "edit", agenda: "edit", ativos: "edit", equipe: "edit",
             solicitacoes: "edit", estoque: "edit", relatorios: "edit", configuracoes: "edit" },
    builtin: true },
  { id: "coord", name: "Coordenador de manutenção", color: "var(--accent)",
    description: "Planeja, programa e monitora todas as ordens. Aprova requisições.",
    perms: { dashboard: "edit", ordens: "edit", agenda: "edit", ativos: "edit", equipe: "edit",
             solicitacoes: "edit", estoque: "edit", relatorios: "view", configuracoes: "none" },
    builtin: true },
  { id: "planejador", name: "Planejador", color: "var(--info)",
    description: "Planeja preventivas, gerencia plano-mestre e cadastro de ativos.",
    perms: { dashboard: "view", ordens: "edit", agenda: "edit", ativos: "edit", equipe: "view",
             solicitacoes: "edit", estoque: "view", relatorios: "view", configuracoes: "none" },
    builtin: true },
  { id: "tecnico", name: "Técnico de manutenção", color: "var(--good)",
    description: "Executa ordens designadas, aponta tempos e registra peças usadas.",
    perms: { dashboard: "view", ordens: "edit-own", agenda: "view", ativos: "view", equipe: "none",
             solicitacoes: "view", estoque: "request", relatorios: "none", configuracoes: "none" },
    builtin: true },
  { id: "almox", name: "Almoxarifado", color: "var(--warn)",
    description: "Gerencia estoque, atende requisições, controla entradas e saídas.",
    perms: { dashboard: "none", ordens: "view", agenda: "none", ativos: "view", equipe: "none",
             solicitacoes: "view", estoque: "edit", relatorios: "view", configuracoes: "none" },
    builtin: true },
  { id: "solicitante", name: "Solicitante de produção", color: "var(--ink-3)",
    description: "Abre solicitações de manutenção e acompanha o andamento.",
    perms: { dashboard: "none", ordens: "view-own", agenda: "none", ativos: "view", equipe: "none",
             solicitacoes: "edit-own", estoque: "none", relatorios: "none", configuracoes: "none" },
    builtin: true },
];

const USERS_INITIAL = [
  { id: "u1", name: "Marina Albuquerque", email: "marina.a@vinhedo.ind.br", phone: "(11) 9 8123-4567",
    role: "coord", department: "Manutenção", shift: "Diurno", active: true, lastAccess: "Há 12 min" },
  { id: "u2", name: "Rafael Souza", email: "rafael.s@vinhedo.ind.br", phone: "(11) 9 8222-1100",
    role: "planejador", department: "Manutenção", shift: "Diurno", active: true, lastAccess: "Há 1 h" },
  { id: "u3", name: "Carlos Mendes", email: "carlos.m@vinhedo.ind.br", phone: "(11) 9 8533-7821",
    role: "tecnico", department: "Manutenção", shift: "Manhã", active: true, lastAccess: "Online" },
  { id: "u4", name: "Júlia Pereira", email: "julia.p@vinhedo.ind.br", phone: "(11) 9 8990-1212",
    role: "tecnico", department: "Manutenção", shift: "Tarde", active: true, lastAccess: "Online" },
  { id: "u5", name: "Pedro Santos", email: "pedro.s@vinhedo.ind.br", phone: "(11) 9 8123-4400",
    role: "tecnico", department: "Manutenção", shift: "Noite", active: true, lastAccess: "Há 6 h" },
  { id: "u6", name: "Ana Lima", email: "ana.l@vinhedo.ind.br", phone: "(11) 9 8744-3320",
    role: "tecnico", department: "Manutenção", shift: "Diurno", active: true, lastAccess: "Há 35 min" },
  { id: "u7", name: "Bruno Carvalho", email: "bruno.c@vinhedo.ind.br", phone: "(11) 9 8333-5511",
    role: "almox", department: "Almoxarifado", shift: "Diurno", active: true, lastAccess: "Há 4 min" },
  { id: "u8", name: "Fernanda Almeida", email: "fernanda.a@vinhedo.ind.br", phone: "(11) 9 8112-9090",
    role: "solicitante", department: "Produção · Extrusão", shift: "Diurno", active: true, lastAccess: "Há 2 dias" },
  { id: "u9", name: "Diego Ribeiro", email: "diego.r@vinhedo.ind.br", phone: "(11) 9 8556-1144",
    role: "solicitante", department: "Produção · Impressão", shift: "Manhã", active: true, lastAccess: "Há 8 h" },
  { id: "u10", name: "Larissa Cavalcante", email: "larissa.c@vinhedo.ind.br", phone: "(11) 9 8990-7755",
    role: "admin", department: "TI Industrial", shift: "Diurno", active: true, lastAccess: "Online" },
  { id: "u11", name: "Marcos Oliveira", email: "marcos.o@vinhedo.ind.br", phone: "(11) 9 8221-3344",
    role: "tecnico", department: "Manutenção", shift: "Noite", active: false, lastAccess: "Há 28 dias" },
];

const MODULES = [
  { id: "dashboard", label: "Sala de controle" },
  { id: "ordens", label: "Ordens de serviço" },
  { id: "agenda", label: "Agenda do turno" },
  { id: "ativos", label: "Ativos & planta" },
  { id: "equipe", label: "Equipe" },
  { id: "solicitacoes", label: "Solicitações" },
  { id: "estoque", label: "Estoque" },
  { id: "relatorios", label: "Relatórios" },
  { id: "configuracoes", label: "Configurações" },
];

const PERM_LEVELS = [
  { v: "none",     label: "Sem acesso",      dot: "var(--ink-3)" },
  { v: "view",     label: "Visualizar",      dot: "var(--info)" },
  { v: "view-own", label: "Visualizar suas", dot: "var(--info)" },
  { v: "request",  label: "Solicitar",       dot: "var(--warn)" },
  { v: "edit-own", label: "Editar suas",     dot: "var(--good)" },
  { v: "edit",     label: "Editar tudo",     dot: "var(--accent)" },
];

const PERM_LABEL = Object.fromEntries(PERM_LEVELS.map(p => [p.v, p]));

function SettingsScreen() {
  const [tab, setTab] = React.useState("users");
  const [users, setUsers] = React.useState(USERS_INITIAL);
  const [roles, setRoles] = React.useState(ROLES_INITIAL);
  const [editUser, setEditUser] = React.useState(null);
  const [editRole, setEditRole] = React.useState(null);
  const [filter, setFilter] = React.useState("");
  const [filterRole, setFilterRole] = React.useState("all");

  const rolesById = Object.fromEntries(roles.map(r => [r.id, r]));

  const saveUser = (u) => {
    if (editUser.mode === "add") {
      setUsers(us => [...us, { ...u, id: `u${Date.now()}`, lastAccess: "Nunca acessou", active: true }]);
      window.showToast?.(`Pessoa "${u.name}" cadastrada`, "good", `Papel: ${rolesById[u.role].name}`);
    } else {
      setUsers(us => us.map(x => x.id === editUser.user.id ? { ...x, ...u } : x));
      window.showToast?.(`"${u.name}" atualizado`, "good");
    }
    setEditUser(null);
  };

  const toggleUserActive = (u) => {
    setUsers(us => us.map(x => x.id === u.id ? { ...x, active: !x.active } : x));
    window.showToast?.(u.active ? `${u.name} desativado` : `${u.name} reativado`, u.active ? "warn" : "good");
  };

  const deleteUser = (u) => {
    if (!confirm(`Excluir ${u.name}?`)) return;
    setUsers(us => us.filter(x => x.id !== u.id));
    window.showToast?.(`${u.name} removido`, "warn");
  };

  const saveRole = (r) => {
    if (editRole.mode === "add") {
      setRoles(rs => [...rs, { ...r, id: `r-${Date.now()}`, builtin: false }]);
      window.showToast?.(`Papel "${r.name}" criado`, "good");
    } else {
      setRoles(rs => rs.map(x => x.id === editRole.role.id ? { ...x, ...r } : x));
      window.showToast?.(`Papel "${r.name}" atualizado`, "good");
    }
    setEditRole(null);
  };

  const deleteRole = (r) => {
    const usingCount = users.filter(u => u.role === r.id).length;
    if (usingCount > 0) {
      window.showToast?.(`Não é possível excluir`, "crit", `${usingCount} pessoa(s) ainda usam este papel`);
      return;
    }
    if (!confirm(`Excluir o papel "${r.name}"?`)) return;
    setRoles(rs => rs.filter(x => x.id !== r.id));
    window.showToast?.(`Papel "${r.name}" excluído`, "warn");
  };

  const filteredUsers = users.filter(u => {
    if (filterRole !== "all" && u.role !== filterRole) return false;
    if (!filter) return true;
    const f = filter.toLowerCase();
    return u.name.toLowerCase().includes(f) || u.email.toLowerCase().includes(f) || u.department.toLowerCase().includes(f);
  });

  return (
    <div className="screen-pad" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Configurações</h1>
          <p className="screen-sub">Pessoas, papéis e permissões de acesso</p>
        </div>
      </div>

      <div className="cfg-tabs">
        <button className="cfg-tab" data-active={tab === "users"} data-no-toast="true" onClick={() => setTab("users")}>
          Pessoas <span className="cfg-tab-count">{users.length}</span>
        </button>
        <button className="cfg-tab" data-active={tab === "roles"} data-no-toast="true" onClick={() => setTab("roles")}>
          Papéis <span className="cfg-tab-count">{roles.length}</span>
        </button>
        <button className="cfg-tab" data-active={tab === "perms"} data-no-toast="true" onClick={() => setTab("perms")}>
          Matriz de permissões
        </button>
        <button className="cfg-tab" data-active={tab === "general"} data-no-toast="true" onClick={() => setTab("general")}>
          Geral
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        {tab === "users" && (
          <UsersTab users={filteredUsers} totalUsers={users.length} roles={roles} rolesById={rolesById}
                    filter={filter} setFilter={setFilter}
                    filterRole={filterRole} setFilterRole={setFilterRole}
                    onAdd={() => setEditUser({ mode: "add" })}
                    onEdit={(u) => setEditUser({ mode: "edit", user: u })}
                    onToggle={toggleUserActive}
                    onDelete={deleteUser} />
        )}
        {tab === "roles" && (
          <RolesTab roles={roles} users={users}
                    onAdd={() => setEditRole({ mode: "add" })}
                    onEdit={(r) => setEditRole({ mode: "edit", role: r })}
                    onDelete={deleteRole} />
        )}
        {tab === "perms" && <PermissionMatrix roles={roles} />}
        {tab === "general" && <GeneralSettings />}
      </div>

      {editUser && <UserEditModal editing={editUser} roles={roles} onClose={() => setEditUser(null)} onSave={saveUser} />}
      {editRole && <RoleEditModal editing={editRole} onClose={() => setEditRole(null)} onSave={saveRole} />}
    </div>
  );
}

function UsersTab({ users, totalUsers, roles, rolesById, filter, setFilter, filterRole, setFilterRole, onAdd, onEdit, onToggle, onDelete }) {
  return (
    <>
      <div className="cfg-toolbar">
        <input className="form-input" style={{ flex: 1, maxWidth: 320 }}
               placeholder="Buscar pessoa, e-mail ou setor…"
               value={filter} onChange={(e) => setFilter(e.target.value)} />
        <select className="form-input" style={{ width: 220 }}
                value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="all">Todos os papéis</option>
          {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <span className="ink-3" style={{ fontSize: 11.5 }}>
          {users.length} de {totalUsers} pessoa(s)
        </span>
        <button className="btn btn-primary" data-no-toast="true" style={{ marginLeft: "auto" }} onClick={onAdd}>
          + Cadastrar pessoa
        </button>
      </div>

      <div className="users-table">
        <div className="ut-row ut-head">
          <span>Pessoa</span>
          <span>Papel</span>
          <span>Setor</span>
          <span>Turno</span>
          <span>Último acesso</span>
          <span style={{ textAlign: "right" }}>Ações</span>
        </div>
        {users.map(u => {
          const role = rolesById[u.role];
          const initials = u.name.split(" ").slice(0, 2).map(p => p[0]).join("");
          return (
            <div key={u.id} className="ut-row" data-inactive={!u.active}>
              <div className="ut-person">
                <div className="ut-avatar" style={{ background: role?.color || "var(--ink-3)" }}>{initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="ut-name">{u.name}{!u.active && <span className="ut-tag">desativado</span>}</div>
                  <div className="ut-mail">{u.email}</div>
                </div>
              </div>
              <div>
                <span className="role-pill" style={{ "--rc": role?.color || "var(--ink-3)" }}>{role?.name || "—"}</span>
              </div>
              <div className="ink-2" style={{ fontSize: 12.5 }}>{u.department}</div>
              <div className="ink-2" style={{ fontSize: 12.5 }}>{u.shift}</div>
              <div className="ink-3" style={{ fontSize: 11.5 }}>
                {u.lastAccess === "Online" && <span className="online-dot" />}
                {u.lastAccess}
              </div>
              <div className="ut-actions">
                <button className="btn-mini" data-no-toast="true" onClick={() => onEdit(u)}>Editar</button>
                <button className="btn-mini" data-no-toast="true" onClick={() => onToggle(u)}>
                  {u.active ? "Desativar" : "Ativar"}
                </button>
                <button className="btn-mini btn-mini-danger" data-no-toast="true" onClick={() => onDelete(u)}>Excluir</button>
              </div>
            </div>
          );
        })}
        {users.length === 0 && (
          <div className="ut-empty">Nenhuma pessoa encontrada com esses filtros.</div>
        )}
      </div>
    </>
  );
}

function RolesTab({ roles, users, onAdd, onEdit, onDelete }) {
  return (
    <>
      <div className="cfg-toolbar">
        <span className="ink-3" style={{ fontSize: 12 }}>
          Papéis definem o que cada pessoa pode acessar. Papéis embutidos não podem ser excluídos.
        </span>
        <button className="btn btn-primary" data-no-toast="true" style={{ marginLeft: "auto" }} onClick={onAdd}>
          + Novo papel
        </button>
      </div>
      <div className="roles-grid">
        {roles.map(r => {
          const useCount = users.filter(u => u.role === r.id).length;
          const summary = MODULES.map(m => r.perms[m.id] || "none");
          const editCount = summary.filter(p => p.startsWith("edit")).length;
          const viewCount = summary.filter(p => p.startsWith("view") || p === "request").length;
          const noneCount = summary.filter(p => p === "none").length;
          return (
            <div key={r.id} className="role-card" style={{ "--rc": r.color }}>
              <div className="role-card-h">
                <span className="role-dot" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="role-card-name">
                    {r.name}
                    {r.builtin && <span className="role-badge">embutido</span>}
                  </div>
                  <div className="role-card-use ink-3">{useCount} pessoa(s) com este papel</div>
                </div>
              </div>
              <p className="role-card-desc">{r.description}</p>
              <div className="role-card-perms">
                <span><b style={{ color: "var(--accent)" }}>{editCount}</b> editar</span>
                <span><b style={{ color: "var(--info)" }}>{viewCount}</b> visualizar</span>
                <span><b className="ink-3">{noneCount}</b> sem acesso</span>
              </div>
              <div className="role-card-actions">
                <button className="btn-mini" data-no-toast="true" onClick={() => onEdit(r)}>
                  {r.builtin ? "Ver permissões" : "Editar"}
                </button>
                {!r.builtin && (
                  <button className="btn-mini btn-mini-danger" data-no-toast="true" onClick={() => onDelete(r)}>Excluir</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function PermissionMatrix({ roles }) {
  return (
    <div className="perm-matrix-wrap">
      <div className="cfg-toolbar">
        <span className="ink-3" style={{ fontSize: 12 }}>
          Visão consolidada: o que cada papel pode fazer em cada módulo.
        </span>
        <div className="perm-legend">
          {PERM_LEVELS.map(p => (
            <span key={p.v} className="perm-leg-item">
              <span className="perm-dot" style={{ background: p.dot }} />{p.label}
            </span>
          ))}
        </div>
      </div>
      <div className="perm-matrix" style={{ gridTemplateColumns: `200px repeat(${roles.length}, minmax(120px, 1fr))` }}>
        <div className="pm-cell pm-corner"></div>
        {roles.map(r => (
          <div key={r.id} className="pm-cell pm-rolehead" style={{ "--rc": r.color }}>
            <span className="role-dot" />
            <span>{r.name}</span>
          </div>
        ))}
        {MODULES.map(m => (
          <React.Fragment key={m.id}>
            <div className="pm-cell pm-modhead">{m.label}</div>
            {roles.map(r => {
              const p = PERM_LABEL[r.perms[m.id] || "none"];
              return (
                <div key={r.id} className="pm-cell pm-perm" data-perm={r.perms[m.id] || "none"}>
                  <span className="perm-dot" style={{ background: p.dot }} />
                  <span>{p.label}</span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="general-grid">
      <div className="card cfg-card">
        <div className="cfg-card-h">Política de senhas</div>
        <div className="cfg-row"><span>Tamanho mínimo</span><b>10 caracteres</b></div>
        <div className="cfg-row"><span>Expiração</span><b>90 dias</b></div>
        <div className="cfg-row"><span>Bloqueio após tentativas</span><b>5</b></div>
        <div className="cfg-row"><span>2FA obrigatório (Admin)</span><b style={{ color: "var(--good)" }}>Ativo</b></div>
      </div>
      <div className="card cfg-card">
        <div className="cfg-card-h">Notificações</div>
        <div className="cfg-row"><span>E-mail (SMTP)</span><b>smtp.vinhedo.ind.br</b></div>
        <div className="cfg-row"><span>WhatsApp Business</span><b style={{ color: "var(--good)" }}>Conectado</b></div>
        <div className="cfg-row"><span>Push (app móvel)</span><b style={{ color: "var(--good)" }}>Ativo</b></div>
        <div className="cfg-row"><span>Resumo diário às</span><b>07:00</b></div>
      </div>
      <div className="card cfg-card">
        <div className="cfg-card-h">Integrações</div>
        <div className="cfg-row"><span>ERP — TOTVS Protheus</span><b style={{ color: "var(--good)" }}>Sincronizado</b></div>
        <div className="cfg-row"><span>Sensores IoT (MQTT)</span><b style={{ color: "var(--good)" }}>Ativo · 47 sensores</b></div>
        <div className="cfg-row"><span>SSO Microsoft Entra</span><b style={{ color: "var(--warn)" }}>Pendente teste</b></div>
        <div className="cfg-row"><span>Power BI</span><b style={{ color: "var(--ink-3)" }}>Não conectado</b></div>
      </div>
      <div className="card cfg-card">
        <div className="cfg-card-h">Auditoria</div>
        <div className="cfg-row"><span>Retenção de logs</span><b>365 dias</b></div>
        <div className="cfg-row"><span>Logs hoje</span><b>1 248 eventos</b></div>
        <div className="cfg-row"><span>Última exportação</span><b>Há 2 dias</b></div>
        <div className="cfg-row"><span>LGPD — DPO</span><b>Larissa Cavalcante</b></div>
      </div>
    </div>
  );
}

// ─── Modais ─────────────────────────────────────────────────────────────────
function UserEditModal({ editing, roles, onClose, onSave }) {
  const initial = editing.mode === "edit" ? editing.user : { name: "", email: "", phone: "", role: "tecnico", department: "", shift: "Diurno" };
  const [form, setForm] = React.useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name && form.email && form.role;
  const role = roles.find(r => r.id === form.role);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ width: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-h">
          <div>
            <div className="modal-title">
              {editing.mode === "add" ? "Cadastrar pessoa" : "Editar pessoa"}
            </div>
            <div className="modal-sub">
              {editing.mode === "add" ? "Nova pessoa terá acesso conforme o papel atribuído" : "Atualizar dados e papel"}
            </div>
          </div>
          <button className="icon-btn" data-no-toast="true" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <label className="form-label">Nome completo *</label>
            <input className="form-input" autoFocus value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex.: Maria da Silva" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-row">
              <label className="form-label">E-mail *</label>
              <input className="form-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="pessoa@empresa.br" />
            </div>
            <div className="form-row">
              <label className="form-label">Telefone</label>
              <input className="form-input" value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholder="(11) 9 0000-0000" />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">Papel de acesso *</label>
            <select className="form-input" value={form.role} onChange={(e) => set("role", e.target.value)}>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            {role && <div className="form-hint">{role.description}</div>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <div className="form-row">
              <label className="form-label">Setor / departamento</label>
              <input className="form-input" value={form.department || ""} onChange={(e) => set("department", e.target.value)} placeholder="Ex.: Manutenção" />
            </div>
            <div className="form-row">
              <label className="form-label">Turno</label>
              <select className="form-input" value={form.shift || "Diurno"} onChange={(e) => set("shift", e.target.value)}>
                <option>Diurno</option><option>Manhã</option><option>Tarde</option><option>Noite</option><option>Administrativo</option>
              </select>
            </div>
          </div>
          {editing.mode === "add" && (
            <div className="form-hint" style={{ background: "var(--bg-2)", padding: 10, borderRadius: 5, marginTop: 6 }}>
              Um e-mail será enviado para <b>{form.email || "—"}</b> com instruções para definir a senha.
            </div>
          )}
        </div>
        <div className="modal-foot">
          <span style={{ fontSize: 11, color: "var(--ink-3)" }}>* obrigatórios</span>
          <div className="modal-foot-r">
            <button className="btn" data-no-toast="true" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" data-no-toast="true" disabled={!valid} onClick={() => onSave(form)}>
              {editing.mode === "add" ? "Cadastrar e enviar convite" : "Salvar alterações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleEditModal({ editing, onClose, onSave }) {
  const initial = editing.mode === "edit" ? editing.role : {
    name: "", description: "", color: "var(--info)",
    perms: Object.fromEntries(MODULES.map(m => [m.id, "none"])),
  };
  const [form, setForm] = React.useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setPerm = (mod, lvl) => setForm(f => ({ ...f, perms: { ...f.perms, [mod]: lvl } }));
  const valid = form.name;
  const readonly = editing.mode === "edit" && editing.role.builtin;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ width: 720, maxHeight: "85vh" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-h">
          <div>
            <div className="modal-title">
              {editing.mode === "add" ? "Novo papel" : (readonly ? "Permissões do papel" : "Editar papel")}
            </div>
            <div className="modal-sub">
              {readonly ? "Papel embutido — visualização somente leitura" : "Defina o que pessoas com este papel podem fazer em cada módulo"}
            </div>
          </div>
          <button className="icon-btn" data-no-toast="true" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ overflow: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <div className="form-row">
              <label className="form-label">Nome do papel *</label>
              <input className="form-input" value={form.name} disabled={readonly}
                     onChange={(e) => set("name", e.target.value)} placeholder="Ex.: Supervisor de turno" />
            </div>
            <div className="form-row">
              <label className="form-label">Cor</label>
              <select className="form-input" value={form.color} disabled={readonly} onChange={(e) => set("color", e.target.value)}>
                <option value="var(--accent)">Laranja (acento)</option>
                <option value="var(--info)">Azul</option>
                <option value="var(--good)">Verde</option>
                <option value="var(--warn)">Amarelo</option>
                <option value="var(--crit)">Vermelho</option>
                <option value="var(--ink-3)">Cinza</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">Descrição</label>
            <textarea className="form-input" rows="2" value={form.description} disabled={readonly}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="Resumo das responsabilidades deste papel"></textarea>
          </div>

          <div className="form-row" style={{ marginTop: 8 }}>
            <label className="form-label">Permissões por módulo</label>
            <div className="perm-editor">
              {MODULES.map(m => (
                <div key={m.id} className="perm-editor-row">
                  <span className="perm-editor-label">{m.label}</span>
                  <div className="perm-editor-opts">
                    {PERM_LEVELS.map(p => (
                      <button key={p.v} type="button"
                              className="perm-opt"
                              data-active={(form.perms[m.id] || "none") === p.v}
                              disabled={readonly}
                              data-no-toast="true"
                              onClick={() => setPerm(m.id, p.v)}>
                        <span className="perm-dot" style={{ background: p.dot }} />
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <span style={{ fontSize: 11, color: "var(--ink-3)" }}>* obrigatórios</span>
          <div className="modal-foot-r">
            <button className="btn" data-no-toast="true" onClick={onClose}>{readonly ? "Fechar" : "Cancelar"}</button>
            {!readonly && (
              <button className="btn btn-primary" data-no-toast="true" disabled={!valid} onClick={() => onSave(form)}>
                {editing.mode === "add" ? "Criar papel" : "Salvar alterações"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

window.SettingsScreen = SettingsScreen;
