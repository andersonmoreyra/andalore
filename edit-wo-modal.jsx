// ═══════════════════════════════════════════════════════════════════════════
// EDIT-WO-MODAL.JSX - Modal de Edição de Ordem de Serviço
// Sistema de Gestão de Manutenção - Marvi Alimentos
// ═══════════════════════════════════════════════════════════════════════════

function EditWOModal({ woId, onClose, onSave }) {
  const [wo, setWo] = React.useState(null);
  const [form, setForm] = React.useState({});
  const [saving, setSaving] = React.useState(false);
  const [assets, setAssets] = React.useState([]);
  const [technicians, setTechnicians] = React.useState([]);

  // Carregar dados
  React.useEffect(() => {
    if (woId) {
      const orders = Storage.getWorkOrders();
      const foundWo = orders.find(w => w.id === woId);
      if (foundWo) {
        setWo(foundWo);
        setForm({ ...foundWo });
      }
    }
    setAssets(Storage.getAssets());
    setTechnicians(Storage.getTechnicians());
  }, [woId]);

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const valid = form.titulo?.trim() && form.tipo && form.prioridade && form.status;

  const handleSave = () => {
    if (!valid) {
      window.showToast?.('Preencha todos os campos obrigatórios', 'warn');
      return;
    }
    setSaving(true);
    Storage.updateWorkOrder(woId, form);
    
    setTimeout(() => {
      window.showToast?.(
        `Ordem ${woId} atualizada!`,
        "good",
        "As alterações foram salvas com sucesso"
      );
      onSave?.();
      onClose?.();
    }, 600);
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja EXCLUIR a ordem ${woId}?\n\nEsta ação não pode ser desfeita!`)) {
      Storage.deleteWorkOrder(woId);
      window.showToast?.(
        `Ordem ${woId} excluída`,
        "neutral",
        "A ordem foi removida do sistema"
      );
      window.dispatchEvent(new CustomEvent('__refresh_work_orders'));
      onClose?.();
    }
  };

  if (!wo) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 700 }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Editar ordem de serviço</h2>
            <p className="modal-subtitle">{wo.id}</p>
          </div>
          <button className="btn-icon" onClick={onClose}>{I.x}</button>
        </div>

        <div className="modal-body scroll">
          <div className="form-row">
            <label className="form-label">Título *</label>
            <input 
              className="form-input" 
              value={form.titulo || ''} 
              onChange={(e) => set('titulo', e.target.value)}
            />
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Equipamento *</label>
              <select 
                className="form-input" 
                value={form.equipamento || ''} 
                onChange={(e) => {
                  const asset = assets.find(a => a.id === e.target.value);
                  set('equipamento', e.target.value);
                  set('equipamentoNome', asset?.nome || '');
                  set('area', asset?.area || '');
                }}
              >
                <option value="">Selecione...</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.codigo} · {a.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Status *</label>
              <select 
                className="form-input" 
                value={form.status || 'aberta'} 
                onChange={(e) => set('status', e.target.value)}
              >
                <option value="aberta">Aberta</option>
                <option value="executando">Em execução</option>
                <option value="aguardando peça">Aguardando peça</option>
                <option value="concluída">Concluída</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Tipo *</label>
              <select 
                className="form-input" 
                value={form.tipo || 'corretiva'} 
                onChange={(e) => set('tipo', e.target.value)}
              >
                <option value="corretiva">Corretiva</option>
                <option value="preventiva">Preventiva</option>
                <option value="preditiva">Preditiva</option>
                <option value="melhoria">Melhoria</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Prioridade *</label>
              <select 
                className="form-input" 
                value={form.prioridade || 'média'} 
                onChange={(e) => set('prioridade', e.target.value)}
              >
                <option value="baixa">Baixa</option>
                <option value="média">Média</option>
                <option value="alta">Alta</option>
                <option value="crítica">Crítica</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Responsável</label>
            <select 
              className="form-input" 
              value={form.tecnico || ''} 
              onChange={(e) => {
                const tech = technicians.find(t => t.id === e.target.value);
                set('tecnico', e.target.value);
                set('tecnicoNome', tech?.nome || null);
              }}
            >
              <option value="">Não atribuído</option>
              {technicians.map(t => (
                <option key={t.id} value={t.id}>{t.nome} - {t.especialidade}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label className="form-label">Descrição</label>
            <textarea 
              className="form-input" 
              rows="4"
              value={form.descricao || ''} 
              onChange={(e) => set('descricao', e.target.value)}
              placeholder="Descreva o problema ou tarefa..."
            />
          </div>

          <div className="form-row">
            <label className="form-label">Tempo estimado (minutos)</label>
            <input 
              type="number" 
              className="form-input" 
              value={form.estimativa || 60} 
              onChange={(e) => set('estimativa', parseInt(e.target.value))}
              min="0"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={handleDelete} style={{ marginRight: 'auto', color: 'var(--crit)' }}>
            {I.trash}<span>Excluir OS</span>
          </button>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || !valid}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

window.EditWOModal = EditWOModal;
