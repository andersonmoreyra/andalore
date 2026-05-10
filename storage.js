// ═══════════════════════════════════════════════════════════════════════════
// STORAGE.JS - Sistema de Gerenciamento de Dados LocalStorage
// Sistema de Gestão de Manutenção - Marvi Alimentos
// ═══════════════════════════════════════════════════════════════════════════

const Storage = {
  
  // ─── Configuração ──────────────────────────────────────────────────────────
  
  KEYS: {
    USERS: 'manutencao_usuarios',
    TECHNICIANS: 'manutencao_tecnicos',
    WORK_ORDERS: 'manutencao_ordens',
    ASSETS: 'manutencao_ativos',
    PARTS: 'manutencao_pecas',
    REQUESTS: 'manutencao_solicitacoes',
    CHECKLISTS: 'manutencao_checklists',
    CHECKLIST_TEMPLATES: 'manutencao_checklist_templates',
    SCHEDULE: 'manutencao_agenda',
    SETTINGS: 'manutencao_configuracoes',
    CURRENT_USER: 'manutencao_usuario_atual',
    ACTIVITY_LOG: 'manutencao_atividades'
  },

  // ─── Métodos Genéricos ─────────────────────────────────────────────────────

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Erro ao ler ${key}:`, error);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error);
      return false;
    }
  },

  clear() {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // ─── Inicialização com dados padrão ────────────────────────────────────────

  initializeDefaultData() {
    // Usuários padrão
    if (!this.get(this.KEYS.USERS)) {
      this.set(this.KEYS.USERS, [
        {
          id: 'U001',
          nome: 'Anderson Moreira',
          email: 'anderson@marvi.com',
          senha: 'admin123', // Em produção, usar hash!
          nivel: 'admin',
          ativo: true,
          avatar: 'AM'
        },
        {
          id: 'U002',
          nome: 'Fábio',
          email: 'fabio@marvi.com',
          senha: 'coord123',
          nivel: 'coordenador',
          ativo: true,
          avatar: 'FB'
        }
      ]);
    }

    // Técnicos padrão
    if (!this.get(this.KEYS.TECHNICIANS)) {
      this.set(this.KEYS.TECHNICIANS, [
        { id: "T01", nome: "Rafael Mendes", initials: "RM", especialidade: "Mecânico Sr", turno: "A", status: "disponível", carga: 0.45, color: "#7c9cff" },
        { id: "T02", nome: "Camila Souza", initials: "CS", especialidade: "Eletricista", turno: "A", status: "disponível", carga: 0.30, color: "#a78bfa" },
        { id: "T03", nome: "Diego Araújo", initials: "DA", especialidade: "Mecânico Pl", turno: "A", status: "disponível", carga: 0.60, color: "#34d399" },
        { id: "T04", nome: "Larissa Pinto", initials: "LP", especialidade: "Instrumentista", turno: "A", status: "disponível", carga: 0.30, color: "#fbbf24" },
        { id: "T05", nome: "Bruno Caldas", initials: "BC", especialidade: "Mecânico Sr", turno: "B", status: "disponível", carga: 0.55, color: "#fb7185" },
        { id: "T06", nome: "Helena Vargas", initials: "HV", especialidade: "Eletricista", turno: "B", status: "disponível", carga: 0.40, color: "#22d3ee" },
        { id: "T07", nome: "Igor Ferreira", initials: "IF", especialidade: "Aux. Manut.", turno: "A", status: "disponível", carga: 0.70, color: "#f472b6" },
        { id: "T08", nome: "Marina Lopes", initials: "ML", especialidade: "Instrumentista", turno: "B", status: "disponível", carga: 0.40, color: "#94a3b8" }
      ]);
    }

    // Ativos padrão
    if (!this.get(this.KEYS.ASSETS)) {
      this.set(this.KEYS.ASSETS, [
        { id: "EX-01", codigo: "EX-01", nome: "Extrusora 01", area: "Extrusão", fabricante: "Davis-Standard", modelo: "DSX-120", numeroSerie: "SN-EX01-2019", criticidade: "A", saude: 0.62, mtbf: 412, runtime: 84 },
        { id: "EX-02", codigo: "EX-02", nome: "Extrusora 02", area: "Extrusão", fabricante: "Davis-Standard", modelo: "DSX-120", numeroSerie: "SN-EX02-2020", criticidade: "A", saude: 0.91, mtbf: 720, runtime: 96 },
        { id: "EX-03", codigo: "EX-03", nome: "Extrusora 03", area: "Extrusão", fabricante: "Battenfeld", modelo: "EX-90", numeroSerie: "SN-EX03-2021", criticidade: "B", saude: 0.78, mtbf: 540, runtime: 88 },
        { id: "IM-01", codigo: "IM-01", nome: "Impressora Flexo 1", area: "Impressão", fabricante: "Comexi", modelo: "F4", numeroSerie: "SN-IM01-2018", criticidade: "A", saude: 0.45, mtbf: 280, runtime: 72 },
        { id: "IM-02", codigo: "IM-02", nome: "Impressora Flexo 2", area: "Impressão", fabricante: "Comexi", modelo: "F4", numeroSerie: "SN-IM02-2020", criticidade: "A", saude: 0.83, mtbf: 610, runtime: 92 },
        { id: "CT-01", codigo: "CT-01", nome: "Cortadeira 01", area: "Acabamento", fabricante: "Atlas", modelo: "CW-800", numeroSerie: "SN-CT01-2019", criticidade: "B", saude: 0.55, mtbf: 380, runtime: 80 },
        { id: "CT-02", codigo: "CT-02", nome: "Cortadeira 02", area: "Acabamento", fabricante: "Atlas", modelo: "CW-800", numeroSerie: "SN-CT02-2021", criticidade: "B", saude: 0.88, mtbf: 660, runtime: 94 },
        { id: "RB-01", codigo: "RB-01", nome: "Rebobinadeira 01", area: "Acabamento", fabricante: "Goebel", modelo: "R-700", numeroSerie: "SN-RB01-2022", criticidade: "C", saude: 0.94, mtbf: 800, runtime: 98 },
        { id: "CP-01", codigo: "CP-01", nome: "Compressor Central", area: "Utilidades", fabricante: "Atlas Copco", modelo: "GA75", numeroSerie: "SN-CP01-2017", criticidade: "A", saude: 0.71, mtbf: 1200, runtime: 99 },
        { id: "CL-01", codigo: "CL-01", nome: "Chiller 01", area: "Utilidades", fabricante: "Trane", modelo: "CGAM", numeroSerie: "SN-CL01-2019", criticidade: "B", saude: 0.86, mtbf: 950, runtime: 97 },
        { id: "PT-01", codigo: "PT-01", nome: "Paletizadora", area: "Expedição", fabricante: "Kuka", modelo: "KR-PAL", numeroSerie: "SN-PT01-2021", criticidade: "C", saude: 0.92, mtbf: 720, runtime: 90 }
      ]);
    }

    // Peças padrão
    if (!this.get(this.KEYS.PARTS)) {
      this.set(this.KEYS.PARTS, [
        { id: "P001", codigo: "ROL-6308", nome: "Rolamento SKF 6308", estoque: 5, estoqueMinimo: 2, localizacao: "Prateleira A3", fornecedor: "SKF Distribuidor", preco: 145.00 },
        { id: "P002", codigo: "CIL-FX-340", nome: "Cilindro Flexo 340mm", estoque: 1, estoqueMinimo: 1, localizacao: "Prateleira B1", fornecedor: "Flexo Parts", preco: 2800.00 },
        { id: "P003", codigo: "LUB-EP2", nome: "Graxa EP-2 (kg)", estoque: 18, estoqueMinimo: 5, localizacao: "Almoxarifado", fornecedor: "Lubrax", preco: 35.00 },
        { id: "P004", codigo: "CTR-LC1", nome: "Contator LC1-D32", estoque: 3, estoqueMinimo: 2, localizacao: "Elétrica - E2", fornecedor: "Schneider", preco: 280.00 },
        { id: "P005", codigo: "FLT-CL-22", nome: "Filtro Chiller G4", estoque: 12, estoqueMinimo: 4, localizacao: "Utilidades", fornecedor: "Filtros Brasil", preco: 95.00 },
        { id: "P006", codigo: "RET-BHD-50", nome: "Retentor BHD-50", estoque: 0, estoqueMinimo: 2, localizacao: "Prateleira A5", fornecedor: "Vedatec", preco: 68.00 },
        { id: "P007", codigo: "CRR-PT-2400", nome: "Correia 2400mm", estoque: 0, estoqueMinimo: 1, localizacao: "Prateleira C2", fornecedor: "Correias Oeste", preco: 420.00 }
      ]);
    }

    // Templates de Checklist padrão
    if (!this.get(this.KEYS.CHECKLIST_TEMPLATES)) {
      this.set(this.KEYS.CHECKLIST_TEMPLATES, [
        {
          id: "TPL001",
          nome: "Manutenção Preventiva - Extrusora",
          tipo: "preventiva",
          itens: [
            { id: 1, texto: "Verificar nível de óleo lubrificante", tipo: "checkbox", obrigatorio: true },
            { id: 2, texto: "Inspecionar correias e polias", tipo: "checkbox", obrigatorio: true },
            { id: 3, texto: "Temperatura dos mancais (°C)", tipo: "numero", obrigatorio: true, unidade: "°C" },
            { id: 4, texto: "Verificar vazamentos hidráulicos", tipo: "checkbox", obrigatorio: true },
            { id: 5, texto: "Testar sistema de emergência", tipo: "checkbox", obrigatorio: true },
            { id: 6, texto: "Observações gerais", tipo: "texto", obrigatorio: false }
          ],
          criador: "U001",
          dataCriacao: new Date().toISOString()
        },
        {
          id: "TPL002",
          nome: "Inspeção Elétrica",
          tipo: "preventiva",
          itens: [
            { id: 1, texto: "Verificar aperto de conexões", tipo: "checkbox", obrigatorio: true },
            { id: 2, texto: "Medir isolamento (MΩ)", tipo: "numero", obrigatorio: true, unidade: "MΩ" },
            { id: 3, texto: "Termografia de painéis", tipo: "checkbox", obrigatorio: true },
            { id: 4, texto: "Testar disjuntores", tipo: "checkbox", obrigatorio: true },
            { id: 5, texto: "Limpar painéis elétricos", tipo: "checkbox", obrigatorio: true },
            { id: 6, texto: "Anomalias encontradas", tipo: "texto", obrigatorio: false }
          ],
          criador: "U001",
          dataCriacao: new Date().toISOString()
        },
        {
          id: "TPL003",
          nome: "Troca de Óleo",
          tipo: "preventiva",
          itens: [
            { id: 1, texto: "Drenar óleo usado", tipo: "checkbox", obrigatorio: true },
            { id: 2, texto: "Limpar cárter", tipo: "checkbox", obrigatorio: true },
            { id: 3, texto: "Substituir filtro de óleo", tipo: "checkbox", obrigatorio: true },
            { id: 4, texto: "Abastecer com óleo novo", tipo: "checkbox", obrigatorio: true },
            { id: 5, texto: "Volume abastecido (L)", tipo: "numero", obrigatorio: true, unidade: "L" },
            { id: 6, texto: "Tipo de óleo utilizado", tipo: "texto", obrigatorio: true },
            { id: 7, texto: "Verificar nível após funcionamento", tipo: "checkbox", obrigatorio: true }
          ],
          criador: "U001",
          dataCriacao: new Date().toISOString()
        }
      ]);
    }

    // Ordens de Serviço padrão (exemplo)
    if (!this.get(this.KEYS.WORK_ORDERS)) {
      this.set(this.KEYS.WORK_ORDERS, []);
    }

    // Solicitações padrão
    if (!this.get(this.KEYS.REQUESTS)) {
      this.set(this.KEYS.REQUESTS, []);
    }

    // Configurações padrão
    if (!this.get(this.KEYS.SETTINGS)) {
      this.set(this.KEYS.SETTINGS, {
        nomeEmpresa: "Marvi Alimentos",
        nomeUnidade: "Planta Ourinhos",
        turnos: [
          { id: "A", nome: "Turno A", inicio: "06:00", fim: "14:00" },
          { id: "B", nome: "Turno B", inicio: "14:00", fim: "22:00" },
          { id: "C", nome: "Turno C", inicio: "22:00", fim: "06:00" }
        ],
        niveisAcesso: [
          { id: "admin", nome: "Administrador", permissoes: ["all"] },
          { id: "coordenador", nome: "Coordenador", permissoes: ["view", "create", "edit", "assign"] },
          { id: "tecnico", nome: "Técnico", permissoes: ["view", "execute"] },
          { id: "visualizador", nome: "Visualizador", permissoes: ["view"] }
        ]
      });
    }

    // Log de atividades
    if (!this.get(this.KEYS.ACTIVITY_LOG)) {
      this.set(this.KEYS.ACTIVITY_LOG, []);
    }
  },

  // ─── Métodos específicos ───────────────────────────────────────────────────

  // USUÁRIOS
  getUsers() {
    return this.get(this.KEYS.USERS) || [];
  },

  addUser(user) {
    const users = this.getUsers();
    user.id = `U${String(users.length + 1).padStart(3, '0')}`;
    users.push(user);
    this.set(this.KEYS.USERS, users);
    this.logActivity('create', 'user', user.id, `Usuário ${user.nome} criado`);
    return user;
  },

  updateUser(userId, updates) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.set(this.KEYS.USERS, users);
      this.logActivity('update', 'user', userId, `Usuário atualizado`);
      return users[index];
    }
    return null;
  },

  deleteUser(userId) {
    const users = this.getUsers().filter(u => u.id !== userId);
    this.set(this.KEYS.USERS, users);
    this.logActivity('delete', 'user', userId, `Usuário removido`);
  },

  // AUTENTICAÇÃO
  login(email, senha) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.senha === senha && u.ativo);
    if (user) {
      const userSession = { ...user };
      delete userSession.senha; // Não guardar senha na sessão
      this.set(this.KEYS.CURRENT_USER, userSession);
      this.logActivity('login', 'auth', user.id, `Login realizado`);
      return userSession;
    }
    return null;
  },

  logout() {
    const user = this.getCurrentUser();
    if (user) {
      this.logActivity('logout', 'auth', user.id, `Logout realizado`);
    }
    this.remove(this.KEYS.CURRENT_USER);
  },

  getCurrentUser() {
    return this.get(this.KEYS.CURRENT_USER);
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const settings = this.get(this.KEYS.SETTINGS);
    const nivel = settings.niveisAcesso.find(n => n.id === user.nivel);
    
    if (!nivel) return false;
    if (nivel.permissoes.includes('all')) return true;
    return nivel.permissoes.includes(permission);
  },

  // TÉCNICOS
  getTechnicians() {
    return this.get(this.KEYS.TECHNICIANS) || [];
  },

  addTechnician(tech) {
    const techs = this.getTechnicians();
    const maxId = Math.max(...techs.map(t => parseInt(t.id.substring(1))), 0);
    tech.id = `T${String(maxId + 1).padStart(2, '0')}`;
    tech.initials = tech.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    techs.push(tech);
    this.set(this.KEYS.TECHNICIANS, techs);
    this.logActivity('create', 'technician', tech.id, `Técnico ${tech.nome} cadastrado`);
    return tech;
  },

  updateTechnician(techId, updates) {
    const techs = this.getTechnicians();
    const index = techs.findIndex(t => t.id === techId);
    if (index !== -1) {
      techs[index] = { ...techs[index], ...updates };
      this.set(this.KEYS.TECHNICIANS, techs);
      this.logActivity('update', 'technician', techId, `Técnico atualizado`);
      return techs[index];
    }
    return null;
  },

  deleteTechnician(techId) {
    const techs = this.getTechnicians().filter(t => t.id !== techId);
    this.set(this.KEYS.TECHNICIANS, techs);
    this.logActivity('delete', 'technician', techId, `Técnico removido`);
  },

  // ORDENS DE SERVIÇO
  getWorkOrders() {
    return this.get(this.KEYS.WORK_ORDERS) || [];
  },

  addWorkOrder(wo) {
    const orders = this.getWorkOrders();
    const maxId = Math.max(...orders.map(o => parseInt(o.id.split('-')[1])), 2800);
    wo.id = `OS-${maxId + 1}`;
    wo.dataAbertura = wo.dataAbertura || new Date().toISOString();
    wo.status = wo.status || 'aberta';
    orders.push(wo);
    this.set(this.KEYS.WORK_ORDERS, orders);
    this.logActivity('create', 'workorder', wo.id, `OS ${wo.id} criada: ${wo.titulo}`);
    return wo;
  },

  updateWorkOrder(woId, updates) {
    const orders = this.getWorkOrders();
    const index = orders.findIndex(o => o.id === woId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      this.set(this.KEYS.WORK_ORDERS, orders);
      this.logActivity('update', 'workorder', woId, `OS ${woId} atualizada`);
      return orders[index];
    }
    return null;
  },

  deleteWorkOrder(woId) {
    const orders = this.getWorkOrders().filter(o => o.id !== woId);
    this.set(this.KEYS.WORK_ORDERS, orders);
    this.logActivity('delete', 'workorder', woId, `OS ${woId} removida`);
  },

  // ATIVOS
  getAssets() {
    return this.get(this.KEYS.ASSETS) || [];
  },

  addAsset(asset) {
    const assets = this.getAssets();
    const id = `A${String(assets.length + 1).padStart(2, '0')}`;
    const newAsset = { id, ...asset };
    assets.push(newAsset);
    this.set(this.KEYS.ASSETS, assets);
    this.logActivity('create', 'asset', newAsset.id, `Ativo ${newAsset.nome} cadastrado`);
    return newAsset;
  },

  updateAsset(assetId, updates) {
    const assets = this.getAssets();
    const index = assets.findIndex(a => a.id === assetId);
    if (index !== -1) {
      assets[index] = { ...assets[index], ...updates };
      this.set(this.KEYS.ASSETS, assets);
      this.logActivity('update', 'asset', assetId, `Ativo atualizado`);
      return assets[index];
    }
    return null;
  },

  deleteAsset(assetId) {
    const assets = this.getAssets().filter(a => a.id !== assetId);
    this.set(this.KEYS.ASSETS, assets);
    this.logActivity('delete', 'asset', assetId, `Ativo removido`);
  },

  // PEÇAS
  getParts() {
    return this.get(this.KEYS.PARTS) || [];
  },

  addPart(part) {
    const parts = this.getParts();
    const maxId = Math.max(...parts.map(p => parseInt(p.id.substring(1))), 0);
    part.id = `P${String(maxId + 1).padStart(3, '0')}`;
    parts.push(part);
    this.set(this.KEYS.PARTS, parts);
    this.logActivity('create', 'part', part.id, `Peça ${part.nome} cadastrada`);
    return part;
  },

  updatePart(partId, updates) {
    const parts = this.getParts();
    const index = parts.findIndex(p => p.id === partId);
    if (index !== -1) {
      parts[index] = { ...parts[index], ...updates };
      this.set(this.KEYS.PARTS, parts);
      this.logActivity('update', 'part', partId, `Peça atualizada`);
      return parts[index];
    }
    return null;
  },

  deletePart(partId) {
    const parts = this.getParts().filter(p => p.id !== partId);
    this.set(this.KEYS.PARTS, parts);
    this.logActivity('delete', 'part', partId, `Peça removida`);
  },

  // SOLICITAÇÕES
  getRequests() {
    return this.get(this.KEYS.REQUESTS) || [];
  },

  addRequest(request) {
    const requests = this.getRequests();
    const maxId = Math.max(...requests.map(r => parseInt(r.id.split('-')[1])), 100);
    request.id = `SR-${maxId + 1}`;
    request.dataAbertura = request.dataAbertura || new Date().toISOString();
    request.status = request.status || 'pendente';
    requests.push(request);
    this.set(this.KEYS.REQUESTS, requests);
    this.logActivity('create', 'request', request.id, `Solicitação ${request.id} criada`);
    return request;
  },

  updateRequest(requestId, updates) {
    const requests = this.getRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
      requests[index] = { ...requests[index], ...updates };
      this.set(this.KEYS.REQUESTS, requests);
      this.logActivity('update', 'request', requestId, `Solicitação atualizada`);
      return requests[index];
    }
    return null;
  },

  deleteRequest(requestId) {
    const requests = this.getRequests().filter(r => r.id !== requestId);
    this.set(this.KEYS.REQUESTS, requests);
    this.logActivity('delete', 'request', requestId, `Solicitação removida`);
  },

  convertRequestToWorkOrder(requestId) {
    const request = this.getRequests().find(r => r.id === requestId);
    if (!request) return null;

    const wo = {
      titulo: request.titulo,
      descricao: request.descricao || '',
      equipamento: request.equipamento,
      equipamentoNome: request.equipamentoNome,
      area: request.area,
      prioridade: request.prioridade,
      tipo: 'corretiva',
      solicitante: request.solicitante,
      origemSolicitacao: requestId
    };

    const workOrder = this.addWorkOrder(wo);
    this.updateRequest(requestId, { status: 'convertida', osGerada: workOrder.id });
    
    return workOrder;
  },

  // TEMPLATES DE CHECKLIST
  getChecklistTemplates() {
    return this.get(this.KEYS.CHECKLIST_TEMPLATES) || [];
  },

  addChecklistTemplate(template) {
    const templates = this.getChecklistTemplates();
    const maxId = Math.max(...templates.map(t => parseInt(t.id.substring(3))), 0);
    template.id = `TPL${String(maxId + 1).padStart(3, '0')}`;
    template.dataCriacao = new Date().toISOString();
    templates.push(template);
    this.set(this.KEYS.CHECKLIST_TEMPLATES, templates);
    this.logActivity('create', 'checklist_template', template.id, `Template ${template.nome} criado`);
    return template;
  },

  updateChecklistTemplate(templateId, updates) {
    const templates = this.getChecklistTemplates();
    const index = templates.findIndex(t => t.id === templateId);
    if (index !== -1) {
      templates[index] = { ...templates[index], ...updates };
      this.set(this.KEYS.CHECKLIST_TEMPLATES, templates);
      this.logActivity('update', 'checklist_template', templateId, `Template atualizado`);
      return templates[index];
    }
    return null;
  },

  deleteChecklistTemplate(templateId) {
    const templates = this.getChecklistTemplates().filter(t => t.id !== templateId);
    this.set(this.KEYS.CHECKLIST_TEMPLATES, templates);
    this.logActivity('delete', 'checklist_template', templateId, `Template removido`);
  },

  // EXECUÇÕES DE CHECKLIST
  getChecklists() {
    return this.get(this.KEYS.CHECKLISTS) || [];
  },

  addChecklist(checklist) {
    const checklists = this.getChecklists();
    const maxId = checklists.length;
    checklist.id = `CHK${String(maxId + 1).padStart(4, '0')}`;
    checklist.dataInicio = checklist.dataInicio || new Date().toISOString();
    checklist.status = checklist.status || 'em_andamento';
    checklists.push(checklist);
    this.set(this.KEYS.CHECKLISTS, checklists);
    this.logActivity('create', 'checklist', checklist.id, `Checklist iniciado`);
    return checklist;
  },

  updateChecklist(checklistId, updates) {
    const checklists = this.getChecklists();
    const index = checklists.findIndex(c => c.id === checklistId);
    if (index !== -1) {
      checklists[index] = { ...checklists[index], ...updates };
      this.set(this.KEYS.CHECKLISTS, checklists);
      this.logActivity('update', 'checklist', checklistId, `Checklist atualizado`);
      return checklists[index];
    }
    return null;
  },

  // LOG DE ATIVIDADES
  logActivity(action, type, itemId, description) {
    const user = this.getCurrentUser();
    const activities = this.get(this.KEYS.ACTIVITY_LOG) || [];
    
    activities.unshift({
      id: `ACT${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user?.id || 'SYSTEM',
      userName: user?.nome || 'Sistema',
      action,
      type,
      itemId,
      description
    });

    // Manter apenas últimas 1000 atividades
    if (activities.length > 1000) {
      activities.length = 1000;
    }

    this.set(this.KEYS.ACTIVITY_LOG, activities);
  },

  getActivities(limit = 50) {
    const activities = this.get(this.KEYS.ACTIVITY_LOG) || [];
    return activities.slice(0, limit);
  },

  // UTILITÁRIOS
  exportData() {
    const data = {};
    Object.entries(this.KEYS).forEach(([key, storageKey]) => {
      data[key] = this.get(storageKey);
    });
    return data;
  },

  importData(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (this.KEYS[key]) {
        this.set(this.KEYS[key], value);
      }
    });
  },

  // CONFIGURAÇÕES
  getSettings() {
    return this.get(this.KEYS.SETTINGS);
  },

  updateSettings(updates) {
    const settings = this.getSettings();
    const newSettings = { ...settings, ...updates };
    this.set(this.KEYS.SETTINGS, newSettings);
    this.logActivity('update', 'settings', 'SETTINGS', 'Configurações atualizadas');
    return newSettings;
  }
};

// Inicializar dados padrão na primeira vez
if (!Storage.get(Storage.KEYS.SETTINGS)) {
  Storage.initializeDefaultData();
  
}

// Exportar para uso global
window.Storage = Storage;
