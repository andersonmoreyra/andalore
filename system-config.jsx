// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM-CONFIG.JSX - Configurações do Sistema
// Sistema de Gestão de Manutenção - Marvi Alimentos
// ═══════════════════════════════════════════════════════════════════════════

function SystemConfig() {
  const [tab, setTab] = React.useState('checklists');

  return (
    <div className="screen-content">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Gerenciamento do Sistema</h1>
          <p className="screen-subtitle">Templates, equipe e backup de dados</p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'checklists' ? 'active' : ''}`} onClick={() => setTab('checklists')}>
          📋 Templates de Checklist
        </button>
        <button className={`tab ${tab === 'technicians' ? 'active' : ''}`} onClick={() => setTab('technicians')}>
          👥 Equipe
        </button>
        <button className={`tab ${tab === 'backup' ? 'active' : ''}`} onClick={() => setTab('backup')}>
          💾 Backup
        </button>
      </div>

      <div style={{ marginTop: '24px' }}>
        {tab === 'checklists' && <ChecklistManager />}
        {tab === 'technicians' && <TechnicianManager />}
        {tab === 'backup' && <BackupManager />}
      </div>
    </div>
  );
}

function BackupManager() {
  const handleExport = () => {
    const data = Storage.exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marvi-manutencao-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.showToast?.('Backup exportado com sucesso!', 'good');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (confirm('⚠️ ATENÇÃO\n\nIsso irá SUBSTITUIR todos os dados atuais!\n\nDeseja continuar?')) {
            Storage.importData(data);
            window.showToast?.('Dados importados com sucesso!', 'good');
            setTimeout(() => window.location.reload(), 1500);
          }
        } catch (error) {
          alert('❌ Erro ao importar arquivo:\n\n' + error.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClear = () => {
    if (!confirm('⚠️ ZONA DE PERIGO\n\nIsso irá APAGAR TODOS os dados do sistema!\n\nDeseja realmente continuar?')) return;
    if (!confirm('⚠️ ÚLTIMA CONFIRMAÇÃO\n\nTodos os dados serão perdidos PERMANENTEMENTE!\n\nContinuar?')) return;
    
    Storage.clear();
    Storage.initializeDefaultData();
    window.showToast?.('Sistema resetado', 'neutral');
    setTimeout(() => window.location.reload(), 1000);
  };

  const stats = {
    os: Storage.getWorkOrders().length,
    tecnicos: Storage.getTechnicians().length,
    ativos: Storage.getAssets().length,
    pecas: Storage.getParts().length,
    templates: Storage.getChecklistTemplates().length
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>📊 Estatísticas do Sistema</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center', padding: '12px', background: 'var(--accent-subtle)', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent)' }}>{stats.os}</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Ordens de Serviço</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', background: 'var(--info-bg)', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--info-fg)' }}>{stats.tecnicos}</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Técnicos</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', background: 'var(--good-bg)', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--good-fg)' }}>{stats.ativos}</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Equipamentos</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', background: 'var(--warn-bg)', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--warn-fg)' }}>{stats.pecas}</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Peças</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', background: 'var(--pred-bg)', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--pred-fg)' }}>{stats.templates}</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Checklists</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>📥 Exportar para Excel (CSV)</h3>
        <p style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '16px' }}>
          Exporte dados em formato CSV compatível com Excel, Google Sheets e LibreOffice.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => ExportTools.exportWorkOrders()}>
            📋 Ordens de Serviço
          </button>
          <button className="btn btn-primary" onClick={() => ExportTools.exportTechnicians()}>
            👥 Equipe
          </button>
          <button className="btn btn-primary" onClick={() => ExportTools.exportParts()}>
            📦 Peças/Estoque
          </button>
          <button className="btn btn-primary" onClick={() => ExportTools.exportAssets()}>
            ⚙️ Equipamentos
          </button>
          <button className="btn btn-primary" onClick={() => ExportTools.exportRequests()}>
            📝 Solicitações
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>📄 Relatórios PDF</h3>
        <p style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '16px' }}>
          Gere relatórios formatados para impressão ou salvamento em PDF.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <button className="btn" onClick={() => ExportTools.reportWorkOrdersPDF()}>
            📋 Relatório de OS
          </button>
          <button className="btn" onClick={() => ExportTools.reportTeamPDF()}>
            👥 Relatório de Equipe
          </button>
          <button className="btn" onClick={() => ExportTools.reportInventoryPDF()}>
            📦 Relatório de Estoque
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>💾 Backup Completo (JSON)</h3>
        <p style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '16px' }}>
          Exporte seus dados para fazer backup ou importe dados de um backup anterior.
          Os dados são salvos em formato JSON e podem ser restaurados a qualquer momento.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleExport}>
            ⬇️ <span>Exportar Backup</span>
          </button>
          <button className="btn" onClick={handleImport}>
            ⬆️ <span>Importar Backup</span>
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px', borderColor: 'var(--crit)', borderWidth: '2px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--crit)' }}>
          ⚠️ Zona de Perigo
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '16px' }}>
          <strong>ATENÇÃO:</strong> Esta ação irá apagar <strong>TODOS</strong> os dados do sistema 
          (ordens, técnicos, equipamentos, peças, checklists) e reiniciar com dados padrão de exemplo.
          <br/><br/>
          <strong>Esta ação não pode ser desfeita!</strong> Faça um backup antes se necessário.
        </p>
        <button 
          className="btn" 
          onClick={handleClear} 
          style={{ 
            color: 'var(--crit)', 
            borderColor: 'var(--crit)',
            fontWeight: '600'
          }}
        >
          🗑️ <span>Limpar Todos os Dados</span>
        </button>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>ℹ️ Sobre o Sistema</h3>
        <dl style={{ fontSize: '13px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', alignItems: 'start' }}>
          <dt style={{ color: 'var(--ink-3)', fontWeight: '600' }}>Versão:</dt>
          <dd>3.0 - Sistema Completo</dd>
          
          <dt style={{ color: 'var(--ink-3)', fontWeight: '600' }}>Armazenamento:</dt>
          <dd>LocalStorage (dados salvos no navegador)</dd>
          
          <dt style={{ color: 'var(--ink-3)', fontWeight: '600' }}>Desenvolvido para:</dt>
          <dd>Marvi Alimentos - Planta Ourinhos/SP</dd>
          
          <dt style={{ color: 'var(--ink-3)', fontWeight: '600' }}>Funcionalidades:</dt>
          <dd>
            • Gestão de Ordens de Serviço<br/>
            • Controle de Equipe<br/>
            • Templates de Checklist<br/>
            • Controle de Ativos<br/>
            • Gestão de Estoque<br/>
            • Backup e Restauração
          </dd>
        </dl>
      </div>
    </div>
  );
}

window.SystemConfig = SystemConfig;
