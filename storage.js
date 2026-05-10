(function(){
  const KEY_PREFIX = 'marviops_v4_';
  const Storage = {
    KEYS:{TECHNICIANS:KEY_PREFIX+'technicians',WORK_ORDERS:KEY_PREFIX+'work_orders',ASSETS:KEY_PREFIX+'assets',PARTS:KEY_PREFIX+'parts',CHECKLIST_TEMPLATES:KEY_PREFIX+'checklist_templates',CHECKLISTS:KEY_PREFIX+'checklists',REQUESTS:KEY_PREFIX+'requests',SESSION:KEY_PREFIX+'session',THEME:KEY_PREFIX+'theme'},
    get(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}},
    set(key,value){localStorage.setItem(key,JSON.stringify(value));return value},
    uid(prefix){return prefix+'-'+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,5).toUpperCase()},
    normalizePart(p){return {...p,estoque:Number(p.estoque ?? p.quantidade ?? 0),estoqueMinimo:Number(p.estoqueMinimo ?? p.minimo ?? 0),preco:Number(p.preco ?? p.valor ?? 0)}},
    normalizeAsset(a){return {...a,codigo:a.codigo||a.id||this.uid('AT'),nome:a.nome||'',area:a.area||'',fabricante:a.fabricante||'',modelo:a.modelo||'',numeroSerie:a.numeroSerie||''}},
    normalizeWO(o){return {...o,titulo:o.titulo||'',equipamento:o.equipamento||'',equipamentoNome:o.equipamentoNome||'',area:o.area||'',tipo:o.tipo||'corretiva',prioridade:o.prioridade||'media',status:o.status||'aberta',tecnico:o.tecnico||'',tecnicoNome:o.tecnicoNome||'',estimativa:Number(o.estimativa||0),decorrido:Number(o.decorrido||0),dataAbertura:o.dataAbertura||new Date().toISOString(),solicitante:o.solicitante||'Produção'}},
    dispatchWO(){window.dispatchEvent(new CustomEvent('__refresh_work_orders'))},
    initializeDefaultData(){
      if(!this.get(this.KEYS.TECHNICIANS)) this.set(this.KEYS.TECHNICIANS,[
        {id:'T01',nome:'Israel Gomes',especialidade:'Mecânico',turno:'A',status:'disponível',carga:42,color:'#2563eb',initials:'IG'},
        {id:'T02',nome:'Fábio Santos',especialidade:'Eletricista',turno:'A',status:'em OS',carga:68,color:'#7c3aed',initials:'FS'},
        {id:'T03',nome:'Rafael Mendes',especialidade:'Mecânico Sr',turno:'B',status:'disponível',carga:35,color:'#059669',initials:'RM'},
        {id:'T04',nome:'Camila Souza',especialidade:'Instrumentista',turno:'A',status:'disponível',carga:28,color:'#d97706',initials:'CS'},
        {id:'T05',nome:'Bruno Caldas',especialidade:'Soldador',turno:'B',status:'ausente',carga:0,color:'#dc2626',initials:'BC'},
        {id:'T06',nome:'Larissa Pinto',especialidade:'PCM',turno:'Comercial',status:'disponível',carga:54,color:'#0891b2',initials:'LP'},
        {id:'T07',nome:'Diego Araújo',especialidade:'Lubrificador',turno:'C',status:'em OS',carga:73,color:'#65a30d',initials:'DA'},
        {id:'T08',nome:'Marina Lopes',especialidade:'Técnica utilidades',turno:'B',status:'disponível',carga:31,color:'#db2777',initials:'ML'}]);
      if(!this.get(this.KEYS.ASSETS)) this.set(this.KEYS.ASSETS,[
        {id:'A01',codigo:'EXT-001',nome:'Extrusora 01',area:'Extrusão',fabricante:'Carnevalli',modelo:'CE-120',numeroSerie:'EXT120-001',criticidade:'A'},
        {id:'A02',codigo:'EXT-002',nome:'Extrusora 02',area:'Extrusão',fabricante:'Carnevalli',modelo:'CE-140',numeroSerie:'EXT140-002',criticidade:'A'},
        {id:'A03',codigo:'IMP-001',nome:'Impressora Flexográfica 01',area:'Impressão',fabricante:'FlexoTech',modelo:'FX-8C',numeroSerie:'FX8-4589',criticidade:'A'},
        {id:'A04',codigo:'LAM-001',nome:'Laminadora 01',area:'Laminação',fabricante:'Nordmeccanica',modelo:'SuperSimplex',numeroSerie:'LM-2021',criticidade:'A'},
        {id:'A05',codigo:'COR-001',nome:'Cortadeira 01',area:'Corte',fabricante:'Atlas',modelo:'CW-800',numeroSerie:'CT-8001',criticidade:'B'},
        {id:'A06',codigo:'REB-001',nome:'Rebobinadeira 01',area:'Acabamento',fabricante:'Bimec',modelo:'STB',numeroSerie:'RB-774',criticidade:'B'},
        {id:'A07',codigo:'CMP-001',nome:'Compressor Central',area:'Utilidades',fabricante:'Atlas Copco',modelo:'GA75',numeroSerie:'GA75-2020',criticidade:'A'},
        {id:'A08',codigo:'CHI-001',nome:'Chiller 01',area:'Utilidades',fabricante:'Carrier',modelo:'AquaSnap',numeroSerie:'CH-334',criticidade:'B'},
        {id:'A09',codigo:'TOR-001',nome:'Torre de Resfriamento',area:'Utilidades',fabricante:'Alpina',modelo:'TR-50',numeroSerie:'TR-501',criticidade:'B'},
        {id:'A10',codigo:'PAL-001',nome:'Paletizadora',area:'Expedição',fabricante:'Kuka',modelo:'KR-180',numeroSerie:'KR180-55',criticidade:'C'},
        {id:'A11',codigo:'EMP-001',nome:'Empacotadora Automática',area:'Embalagem',fabricante:'Indumak',modelo:'SmartBag',numeroSerie:'EMP-112',criticidade:'B'}]);
      if(!this.get(this.KEYS.PARTS)) this.set(this.KEYS.PARTS,[
        {id:'P001',codigo:'ROL-6308',nome:'Rolamento SKF 6308',estoque:5,estoqueMinimo:2,localizacao:'A3-02',fornecedor:'SKF',preco:145.9},
        {id:'P002',codigo:'CTR-LC1D32',nome:'Contator LC1-D32',estoque:3,estoqueMinimo:2,localizacao:'E2-04',fornecedor:'Schneider',preco:286},
        {id:'P003',codigo:'LUB-EP2',nome:'Graxa EP2 1kg',estoque:18,estoqueMinimo:5,localizacao:'LUB-01',fornecedor:'Mobil',preco:38.5},
        {id:'P004',codigo:'RET-50',nome:'Retentor 50mm',estoque:1,estoqueMinimo:4,localizacao:'A5-01',fornecedor:'Vedabras',preco:42},
        {id:'P005',codigo:'COR-2400',nome:'Correia 2400mm',estoque:0,estoqueMinimo:1,localizacao:'C2-03',fornecedor:'Gates',preco:430},
        {id:'P006',codigo:'SEN-PNP',nome:'Sensor indutivo PNP',estoque:8,estoqueMinimo:3,localizacao:'E1-07',fornecedor:'IFM',preco:210},
        {id:'P007',codigo:'FLT-G4',nome:'Filtro G4 Chiller',estoque:12,estoqueMinimo:4,localizacao:'U1-02',fornecedor:'Tecfil',preco:95}]);
      if(!this.get(this.KEYS.CHECKLIST_TEMPLATES)) this.set(this.KEYS.CHECKLIST_TEMPLATES,[
        {id:'TPL001',nome:'Preventiva Mecânica',itens:['Inspecionar proteções','Verificar ruídos/vibração','Checar lubrificação','Apertar fixações']},
        {id:'TPL002',nome:'Preventiva Elétrica',itens:['Apertar bornes','Inspecionar cabos','Testar emergência','Medir corrente']},
        {id:'TPL003',nome:'Utilidades',itens:['Verificar pressão','Verificar temperatura','Inspecionar vazamentos','Registrar horímetro']}]);
      if(!this.get(this.KEYS.WORK_ORDERS)) this.set(this.KEYS.WORK_ORDERS,[
        this.normalizeWO({id:'OS-2801',titulo:'Ruído no mancal lado operador',equipamento:'A01',equipamentoNome:'Extrusora 01',area:'Extrusão',tipo:'corretiva',prioridade:'alta',status:'em execução',tecnico:'T01',tecnicoNome:'Israel Gomes',estimativa:4,decorrido:1.5,solicitante:'Produção'}),
        this.normalizeWO({id:'OS-2802',titulo:'Preventiva elétrica painel principal',equipamento:'A03',equipamentoNome:'Impressora Flexográfica 01',area:'Impressão',tipo:'preventiva',prioridade:'media',status:'aberta',tecnico:'T02',tecnicoNome:'Fábio Santos',estimativa:3,decorrido:0,solicitante:'PCM'}),
        this.normalizeWO({id:'OS-2803',titulo:'Troca filtro do chiller',equipamento:'A08',equipamentoNome:'Chiller 01',area:'Utilidades',tipo:'preventiva',prioridade:'baixa',status:'concluída',tecnico:'T08',tecnicoNome:'Marina Lopes',estimativa:2,decorrido:2,solicitante:'Utilidades'})]);
      if(!this.get(this.KEYS.REQUESTS)) this.set(this.KEYS.REQUESTS,[{id:'SR-101',titulo:'Vazamento de ar próximo à empacotadora',equipamento:'A11',equipamentoNome:'Empacotadora Automática',area:'Embalagem',prioridade:'media',status:'pendente',solicitante:'Operador turno A',dataAbertura:new Date().toISOString(),osGerada:''}]);
      if(!this.get(this.KEYS.CHECKLISTS)) this.set(this.KEYS.CHECKLISTS,[]);
    },
    getTechnicians(){return this.get(this.KEYS.TECHNICIANS)||[]},
    addTechnician(t){const a=this.getTechnicians();const obj={...t,id:t.id||this.uid('T'),initials:t.initials||String(t.nome||'NA').split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()};a.push(obj);this.set(this.KEYS.TECHNICIANS,a);return obj},
    updateTechnician(id,u){const a=this.getTechnicians();const i=a.findIndex(x=>x.id===id);if(i<0)return null;a[i]={...a[i],...u};this.set(this.KEYS.TECHNICIANS,a);return a[i]},
    deleteTechnician(id){this.set(this.KEYS.TECHNICIANS,this.getTechnicians().filter(x=>x.id!==id));return true},
    getWorkOrders(){return (this.get(this.KEYS.WORK_ORDERS)||[]).map(o=>this.normalizeWO(o))},
    addWorkOrder(o){const a=this.getWorkOrders();const nums=a.map(x=>Number(String(x.id||'').replace(/\D/g,''))).filter(Boolean);const id=o.id||'OS-'+(Math.max(2800,...nums)+1);const obj=this.normalizeWO({...o,id});a.push(obj);this.set(this.KEYS.WORK_ORDERS,a);this.dispatchWO();return obj},
    updateWorkOrder(id,u){const a=this.getWorkOrders();const i=a.findIndex(x=>x.id===id);if(i<0)return null;a[i]=this.normalizeWO({...a[i],...u});this.set(this.KEYS.WORK_ORDERS,a);this.dispatchWO();return a[i]},
    deleteWorkOrder(id){this.set(this.KEYS.WORK_ORDERS,this.getWorkOrders().filter(x=>x.id!==id));this.dispatchWO();return true},
    getAssets(){return (this.get(this.KEYS.ASSETS)||[]).map(a=>this.normalizeAsset(a))},
    addAsset(a){const list=this.getAssets();const obj=this.normalizeAsset({...a,id:a.id||this.uid('A')});list.push(obj);this.set(this.KEYS.ASSETS,list);return obj},
    updateAsset(id,u){const a=this.getAssets();const i=a.findIndex(x=>x.id===id);if(i<0)return null;a[i]=this.normalizeAsset({...a[i],...u});this.set(this.KEYS.ASSETS,a);return a[i]},
    deleteAsset(id){this.set(this.KEYS.ASSETS,this.getAssets().filter(x=>x.id!==id));return true},
    getParts(){return (this.get(this.KEYS.PARTS)||[]).map(p=>this.normalizePart(p))},
    addPart(p){const a=this.getParts();const obj=this.normalizePart({...p,id:p.id||this.uid('P')});a.push(obj);this.set(this.KEYS.PARTS,a);return obj},
    updatePart(id,u){const a=this.getParts();const i=a.findIndex(x=>x.id===id);if(i<0)return null;a[i]=this.normalizePart({...a[i],...u});this.set(this.KEYS.PARTS,a);return a[i]},
    deletePart(id){this.set(this.KEYS.PARTS,this.getParts().filter(x=>x.id!==id));return true},
    getChecklistTemplates(){return this.get(this.KEYS.CHECKLIST_TEMPLATES)||[]},
    addChecklistTemplate(t){const a=this.getChecklistTemplates();const obj={...t,id:t.id||this.uid('TPL')};a.push(obj);this.set(this.KEYS.CHECKLIST_TEMPLATES,a);return obj},
    updateChecklistTemplate(id,u){const a=this.getChecklistTemplates();const i=a.findIndex(x=>x.id===id);if(i<0)return null;a[i]={...a[i],...u};this.set(this.KEYS.CHECKLIST_TEMPLATES,a);return a[i]},
    deleteChecklistTemplate(id){this.set(this.KEYS.CHECKLIST_TEMPLATES,this.getChecklistTemplates().filter(x=>x.id!==id));return true},
    getChecklists(){return this.get(this.KEYS.CHECKLISTS)||[]},
    addChecklist(c){const a=this.getChecklists();const obj={...c,id:c.id||this.uid('CHK'),data:new Date().toISOString()};a.push(obj);this.set(this.KEYS.CHECKLISTS,a);return obj},
    updateChecklist(id,u){const a=this.getChecklists();const i=a.findIndex(x=>x.id===id);if(i<0)return null;a[i]={...a[i],...u};this.set(this.KEYS.CHECKLISTS,a);return a[i]},
    getRequests(){return this.get(this.KEYS.REQUESTS)||[]},
    addRequest(r){const a=this.getRequests();const obj={...r,id:r.id||this.uid('SR'),dataAbertura:r.dataAbertura||new Date().toISOString(),status:r.status||'pendente',osGerada:r.osGerada||''};a.push(obj);this.set(this.KEYS.REQUESTS,a);return obj},
    updateRequest(id,u){const a=this.getRequests();const i=a.findIndex(x=>x.id===id);if(i<0)return null;a[i]={...a[i],...u};this.set(this.KEYS.REQUESTS,a);return a[i]},
    convertRequestToWorkOrder(id){const r=this.getRequests().find(x=>x.id===id);if(!r)return null;const wo=this.addWorkOrder({titulo:r.titulo,equipamento:r.equipamento,equipamentoNome:r.equipamentoNome,area:r.area,tipo:'corretiva',prioridade:r.prioridade,status:'aberta',tecnico:'',tecnicoNome:'',estimativa:2,decorrido:0,dataAbertura:new Date().toISOString(),solicitante:r.solicitante});this.updateRequest(id,{status:'convertida',osGerada:wo.id});return wo},
    exportData(){return {technicians:this.getTechnicians(),workOrders:this.getWorkOrders(),assets:this.getAssets(),parts:this.getParts(),checklistTemplates:this.getChecklistTemplates(),checklists:this.getChecklists(),requests:this.getRequests()}},
    importData(data){if(data.technicians)this.set(this.KEYS.TECHNICIANS,data.technicians);if(data.workOrders)this.set(this.KEYS.WORK_ORDERS,data.workOrders);if(data.assets)this.set(this.KEYS.ASSETS,data.assets);if(data.parts)this.set(this.KEYS.PARTS,data.parts);if(data.checklistTemplates)this.set(this.KEYS.CHECKLIST_TEMPLATES,data.checklistTemplates);if(data.checklists)this.set(this.KEYS.CHECKLISTS,data.checklists);if(data.requests)this.set(this.KEYS.REQUESTS,data.requests);this.dispatchWO();return true}
  };
  window.Storage=Storage; Storage.initializeDefaultData();
})();
