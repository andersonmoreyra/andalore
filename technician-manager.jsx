// ═══════════════════════════════════════════════════════════════════════════
// TECHNICIAN-MANAGER.JSX - Gerenciador de Técnicos
// Sistema de Gestão de Manutenção - Marvi Alimentos
// ═══════════════════════════════════════════════════════════════════════════

function TechnicianManager() {
  const [technicians, setTechnicians] = React.useState([]);
  const [editing, setEditing] = React.useState(null);
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    loadTechnicians();
  }, []);

  const loadTechnicians = () => {
    setTechnicians(Storage.getTechnicians());
  };

  const handleDelete = (id) => {
    if (confirm('Deseja realmente remover este técnico?\n\nOBS: Ordens já atribuídas não serão afetadas.')) {
      Storage.deleteTechnician(id);
      loadTechnicians();
      window.showToast?.('Técnico removido', 'neutral');
    }
  };

  const colors = ['#7c9cff', '#a78bfa', '#34d399', '#fbbf24', '#fb7185', '#22d3ee', '#f472b6', '#94a3b8', '#f97316', '#8b5cf6'];

  return (
    <div className="screen-content">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Equipe de Manutenção</h1>
          <p className="screen-subtitle">Gerencie os técnicos e suas especialidades</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          {I.plus}<span>Adicionar técnico</span>
        </button>
      </div>

      <div className="tech-grid">
        {technicians.map(tech => (
          <div key={tech.id} className="tech-card-manager">
            <div className="tech-avatar-large" style={{ background: tech.color }}>
              {tech.initials}
            </div>
            <div className="tech-info-manager">
              <h3 className="tech-name-manager">{tech.nome}</h3>
              <p className="tech-role-manager">{tech.especialidade}</p>
              <div className="tech-meta-manager">
                <span className="mono">{tech.id}</span>
                <span>·</span>
                <span>Turno {tech.turno}</span>
                <span>·</span>
                <span className={`status-${tech.status}`}>{tech.status}</span>
              </div>
            </div>
            <div className="tech-actions">
              <button className="btn-icon" onClick={() => setEditing(tech)} title="Editar">
                {I.edit}
              </button>
              <button className="btn-icon" onClick={() => handleDelete(tech.id)} title="Remover">
                {I.trash}
              </button>
            </div>
          </div>
        ))}

        {technicians.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '48px', opacity: 0.3 }}>👥</div>
            <div style={{ fontSize: '14px', marginBottom: '16px' }}>Nenhum técnico cadastrado</div>
            <button className="btn btn-primary" onClick={() => setCreating(true)}>
              {I.plus}<span>Adicionar primeiro técnico</span>
            </button>
          </div>
        )}
      </div>

      {(creating || editing) && (
        <TechnicianEditor
          technician={editing}
          colors={colors}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={() => {
            loadTechnicians();
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function TechnicianEditor({ technician, colors, onClose, onSave }) {
  const [form, setForm] = React.useState(technician || {
    nome: '',
    especialidade: 'Mecânico',
    turno: 'A',
    status: 'disponível',
    color: colors[Math.floor(Math.random() * colors.length)],
    carga: 0
  });

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.nome.trim()) {
      alert('Por favor, informe o nome do técnico');
      return;
    }

    if (technician) {
      Storage.updateTechnician(technician.id, form);
      window.showToast?.('Técnico atualizado!', 'good');
    } else {
      Storage.addTechnician(form);
      window.showToast?.('Técnico adicionado!', 'good');
    }
    
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{technician ? 'Editar' : 'Adicionar'} técnico</h2>
          </div>
          <button className="btn-icon" onClick={onClose}>{I.x}</button>
        </div>

        <div className="modal-body scroll">
          <div className="form-row">
            <label className="form-label">Nome completo *</label>
            <input 
              className="form-input" 
              value={form.nome} 
              onChange={(e) => set('nome', e.target.value)}
              placeholder="Ex: João Silva"
            />
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Especialidade *</label>
              <select className="form-input" value={form.especialidade} onChange={(e) => set('especialidade', e.target.value)}>
                <option value="Mecânico Sr">Mecânico Sr</option>
                <option value="Mecânico Pl">Mecânico Pl</option>
                <option value="Mecânico Jr">Mecânico Jr</option>
                <option value="Eletricista">Eletricista</option>
                <option value="Instrumentista">Instrumentista</option>
                <option value="Aux. Manut.">Aux. Manutenção</option>
                <option value="Soldador">Soldador</option>
                <option value="Torneiro">Torneiro</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Turno *</label>
              <select className="form-input" value={form.turno} onChange={(e) => set('turno', e.target.value)}>
                <option value="A">Turno A (06:00 - 14:00)</option>
                <option value="B">Turno B (14:00 - 22:00)</option>
                <option value="C">Turno C (22:00 - 06:00)</option>
                <option value="ADM">Administrativo</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Status atual</label>
            <select className="form-input" value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="disponível">Disponível</option>
              <option value="executando">Executando OS</option>
              <option value="deslocando">Deslocando</option>
              <option value="pausa">Em pausa</option>
              <option value="ausente">Ausente</option>
            </select>
          </div>

          <div className="form-row">
            <label className="form-label">Cor do avatar</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => set('color', color)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: color,
                    border: form.color === color ? '3px solid var(--ink-1)' : '2px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Prévia</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--accent-subtle)', borderRadius: '8px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: form.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600' }}>
                {form.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??'}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{form.nome || 'Nome do técnico'}</div>
                <div style={{ fontSize: '13px', color: 'var(--ink-3)' }}>{form.especialidade} · Turno {form.turno}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {technician ? 'Salvar alterações' : 'Adicionar técnico'}
          </button>
        </div>
      </div>
    </div>
  );
}

window.TechnicianManager = TechnicianManager;
