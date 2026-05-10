// ═══════════════════════════════════════════════════════════════════════════
// REQUESTS-MANAGER.JSX - Gestão de Solicitações
// ═══════════════════════════════════════════════════════════════════════════

function RequestsManager() {
  const [requests, setRequests] = React.useState([]);
  const [filter, setFilter] = React.useState('all');
  const [creating, setCreating] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState(null);

  React.useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    setRequests(Storage.getRequests());
  };

  const filtered = requests.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const handleConvertToWO = (request) => {
    if (!confirm(`Converter solicitação ${request.id} em ordem de serviço?`)) return;
    
    const wo = Storage.convertRequestToWorkOrder(request.id);
    window.showToast?.(`Solicitação convertida em ${wo.id}`, 'good');
    loadRequests();
    window.dispatchEvent(new CustomEvent('__refresh_work_orders'));
  };

  const handleApprove = (request) => {
    Storage.updateRequest(request.id, { status: 'aprovada' });
    window.showToast?.('Solicitação aprovada', 'good');
    loadRequests();
  };

  const handleReject = (request) => {
    const motivo = prompt('Motivo da rejeição:');
    if (!motivo) return;
    
    Storage.updateRequest(request.id, { 
      status: 'rejeitada',
      motivoRejeicao: motivo
    });
    window.showToast?.('Solicitação rejeitada', 'warn');
    loadRequests();
  };

  const handleRequestInfo = (request) => {
    const info = prompt('Que informação adicional você precisa?');
    if (!info) return;
    
    Storage.updateRequest(request.id, {
      status: 'info_solicitada',
      infoSolicitada: info
    });
    window.showToast?.('Informação solicitada', 'info');
    loadRequests();
  };

  return (
    <div className="screen-content">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Solicitações de Manutenção</h1>
          <p className="screen-subtitle">Gerencie solicitações e converta em ordens de serviço</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          {I.plus}<span>Nova solicitação</span>
        </button>
      </div>

      <div className="tabs">
        <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          Todas ({requests.length})
        </button>
        <button className={`tab ${filter === 'pendente' ? 'active' : ''}`} onClick={() => setFilter('pendente')}>
          Pendentes ({requests.filter(r => r.status === 'pendente').length})
        </button>
        <button className={`tab ${filter === 'aprovada' ? 'active' : ''}`} onClick={() => setFilter('aprovada')}>
          Aprovadas ({requests.filter(r => r.status === 'aprovada').length})
        </button>
        <button className={`tab ${filter === 'convertida' ? 'active' : ''}`} onClick={() => setFilter('convertida')}>
          Convertidas ({requests.filter(r => r.status === 'convertida').length})
        </button>
        <button className={`tab ${filter === 'rejeitada' ? 'active' : ''}`} onClick={() => setFilter('rejeitada')}>
          Rejeitadas ({requests.filter(r => r.status === 'rejeitada').length})
        </button>
      </div>

      <div className="requests-list">
        {filtered.map(request => (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <div>
                <span className="mono" style={{ fontSize: '12px', color: 'var(--ink-3)' }}>{request.id}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '4px 0' }}>{request.titulo}</h3>
                <div style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
                  {request.equipamentoNome} · {request.area}
                </div>
              </div>
              <span className={`pill ${request.status === 'pendente' ? 'warn' : request.status === 'convertida' ? 'good' : request.status === 'rejeitada' ? 'crit' : 'info'}`}>
                {request.status}
              </span>
            </div>

            {request.descricao && (
              <p style={{ fontSize: '13px', color: 'var(--ink-2)', margin: '12px 0' }}>
                {request.descricao}
              </p>
            )}

            <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginTop: '12px' }}>
              Solicitante: {request.solicitante} · {new Date(request.dataAbertura).toLocaleDateString('pt-BR')}
            </div>

            {request.status === 'convertida' && request.osGerada && (
              <div style={{ marginTop: '12px', padding: '8px', background: 'var(--good-bg)', borderRadius: '6px', fontSize: '13px', color: 'var(--good-fg)' }}>
                ✓ Convertida em {request.osGerada}
              </div>
            )}

            {request.status === 'rejeitada' && request.motivoRejeicao && (
              <div style={{ marginTop: '12px', padding: '8px', background: 'var(--crit-bg)', borderRadius: '6px', fontSize: '13px', color: 'var(--crit-fg)' }}>
                Motivo: {request.motivoRejeicao}
              </div>
            )}

            {request.status === 'pendente' && (
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => handleConvertToWO(request)}>
                  Converter em OS
                </button>
                <button className="btn" onClick={() => handleApprove(request)}>
                  Aprovar
                </button>
                <button className="btn" onClick={() => handleRequestInfo(request)}>
                  Solicitar info
                </button>
                <button className="btn" onClick={() => handleReject(request)} style={{ color: 'var(--crit)' }}>
                  Rejeitar
                </button>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: '48px', opacity: 0.3 }}>📝</div>
            <div style={{ fontSize: '14px' }}>Nenhuma solicitação encontrada</div>
          </div>
        )}
      </div>

      {creating && (
        <RequestEditor
          onClose={() => setCreating(false)}
          onSave={() => {
            loadRequests();
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function RequestEditor({ onClose, onSave }) {
  const [form, setForm] = React.useState({
    titulo: '',
    equipamento: '',
    prioridade: 'média',
    descricao: '',
    solicitante: Storage.getCurrentUser()?.nome || 'Operador'
  });
  const [assets, setAssets] = React.useState([]);

  React.useEffect(() => {
    setAssets(Storage.getAssets());
  }, []);

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.titulo || !form.equipamento) {
      alert('Preencha título e equipamento');
      return;
    }

    const asset = assets.find(a => a.id === form.equipamento);
    
    const request = {
      ...form,
      equipamentoNome: asset?.nome,
      area: asset?.area
    };

    Storage.addRequest(request);
    window.showToast?.('Solicitação criada!', 'good');
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Nova Solicitação</h2>
          <button className="btn-icon" onClick={onClose}>{I.x}</button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <label className="form-label">Título *</label>
            <input
              className="form-input"
              value={form.titulo}
              onChange={e => set('titulo', e.target.value)}
              placeholder="Descreva brevemente o problema"
            />
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Equipamento *</label>
              <select
                className="form-input"
                value={form.equipamento}
                onChange={e => set('equipamento', e.target.value)}
              >
                <option value="">Selecione...</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.codigo} · {a.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Prioridade</label>
              <select
                className="form-input"
                value={form.prioridade}
                onChange={e => set('prioridade', e.target.value)}
              >
                <option value="baixa">Baixa</option>
                <option value="média">Média</option>
                <option value="alta">Alta</option>
                <option value="crítica">Crítica</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Descrição detalhada</label>
            <textarea
              className="form-input"
              rows="4"
              value={form.descricao}
              onChange={e => set('descricao', e.target.value)}
              placeholder="Descreva o problema em detalhes..."
            />
          </div>

          <div className="form-row">
            <label className="form-label">Solicitante</label>
            <input
              className="form-input"
              value={form.solicitante}
              onChange={e => set('solicitante', e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>
            Criar solicitação
          </button>
        </div>
      </div>
    </div>
  );
}

window.RequestsManager = RequestsManager;
