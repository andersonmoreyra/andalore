// ═══════════════════════════════════════════════════════════════════════════
// EXPORT-TOOLS.JSX - Ferramentas de Exportação
// ═══════════════════════════════════════════════════════════════════════════

const ExportTools = {
  
  // EXPORTAR EXCEL (CSV compatível)
  exportToExcel(data, filename, sheetName = 'Sheet1') {
    if (!data || data.length === 0) {
      alert('Nenhum dado para exportar');
      return;
    }

    // Converter para CSV
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          let value = row[header] || '';
          // Escapar vírgulas e aspas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Adicionar BOM para UTF-8
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { tipo: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    window.showToast?.(`${filename}.csv exportado`, 'good');
  },

  // EXPORTAR ORDENS DE SERVIÇO
  exportWorkOrders() {
    const orders = Storage.getWorkOrders();
    const data = orders.map(wo => ({
      'ID': wo.id,
      'Título': wo.titulo,
      'Equipamento': wo.equipamentoNome,
      'Área': wo.area,
      'Tipo': wo.tipo,
      'Prioridade': wo.prioridade,
      'Status': wo.status,
      'Técnico': wo.tecnicoNome || 'Não atribuído',
      'Data Abertura': new Date(wo.dataAbertura).toLocaleDateString('pt-BR'),
      'Estimativa (min)': wo.estimativa || 0,
      'Solicitante': wo.solicitante || ''
    }));

    this.exportToExcel(data, `ordens-servico-${new Date().toISOString().split('T')[0]}`);
  },

  // EXPORTAR TÉCNICOS
  exportTechnicians() {
    const techs = Storage.getTechnicians();
    const data = techs.map(t => ({
      'ID': t.id,
      'Nome': t.nome,
      'Especialidade': t.especialidade,
      'Turno': t.turno,
      'Status': t.status,
      'Carga': t.carga || 0
    }));

    this.exportToExcel(data, `tecnicos-${new Date().toISOString().split('T')[0]}`);
  },

  // EXPORTAR PEÇAS
  exportParts() {
    const parts = Storage.getParts();
    const data = parts.map(p => ({
      'Código': p.codigo,
      'Nome': p.nome,
      'Estoque': p.estoque,
      'Mínimo': p.estoqueMinimo,
      'Localização': p.localizacao || '',
      'Fornecedor': p.fornecedor || '',
      'Preço': p.preco || 0
    }));

    this.exportToExcel(data, `pecas-estoque-${new Date().toISOString().split('T')[0]}`);
  },

  // EXPORTAR ATIVOS
  exportAssets() {
    const assets = Storage.getAssets();
    const data = assets.map(a => ({
      'ID': a.id,
      'Código': a.codigo,
      'Nome': a.nome,
      'Área': a.area,
      'Fabricante': a.fabricante || '',
      'Modelo': a.modelo || '',
      'Número Série': a.numeroSerie || ''
    }));

    this.exportToExcel(data, `ativos-${new Date().toISOString().split('T')[0]}`);
  },

  // EXPORTAR SOLICITAÇÕES
  exportRequests() {
    const requests = Storage.getRequests();
    const data = requests.map(r => ({
      'ID': r.id,
      'Título': r.titulo,
      'Equipamento': r.equipamentoNome,
      'Área': r.area,
      'Prioridade': r.prioridade,
      'Status': r.status,
      'Solicitante': r.solicitante,
      'Data': new Date(r.dataAbertura).toLocaleDateString('pt-BR'),
      'OS Gerada': r.osGerada || ''
    }));

    this.exportToExcel(data, `solicitacoes-${new Date().toISOString().split('T')[0]}`);
  },

  // GERAR RELATÓRIO PDF (usando HTML2PDF simulado via print)
  exportToPDF(title, content) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            color: #333;
            border-bottom: 3px solid #ff6b35;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background: #ff6b35;
            color: white;
          }
          tr:nth-child(even) {
            background: #f9f9f9;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
          }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${content}
        <div class="footer">
          <p>Marvi Alimentos - Sistema de Gestão de Manutenção</p>
          <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
        </div>
        <button onclick="window.print()" style="margin: 20px 0; padding: 10px 20px; background: #ff6b35; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Imprimir / Salvar PDF
        </button>
      </body>
      </html>
    `);
    printWindow.document.close();
  },

  // RELATÓRIO DE ORDENS EM PDF
  reportWorkOrdersPDF() {
    const orders = Storage.getWorkOrders();
    const tableRows = orders.map(wo => `
      <tr>
        <td>${wo.id}</td>
        <td>${wo.titulo}</td>
        <td>${wo.equipamentoNome}</td>
        <td>${wo.tipo}</td>
        <td>${wo.prioridade}</td>
        <td>${wo.status}</td>
        <td>${wo.tecnicoNome || '-'}</td>
      </tr>
    `).join('');

    const content = `
      <p>Total de ordens: <strong>${orders.length}</strong></p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Equipamento</th>
            <th>Tipo</th>
            <th>Prioridade</th>
            <th>Status</th>
            <th>Técnico</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    this.exportToPDF('Relatório de Ordens de Serviço', content);
  },

  // RELATÓRIO DE EQUIPE EM PDF
  reportTeamPDF() {
    const techs = Storage.getTechnicians();
    const tableRows = techs.map(t => `
      <tr>
        <td>${t.id}</td>
        <td>${t.nome}</td>
        <td>${t.especialidade}</td>
        <td>${t.turno}</td>
        <td>${t.status}</td>
      </tr>
    `).join('');

    const content = `
      <p>Total de técnicos: <strong>${techs.length}</strong></p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Especialidade</th>
            <th>Turno</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    this.exportToPDF('Relatório da Equipe de Manutenção', content);
  },

  // RELATÓRIO DE ESTOQUE EM PDF
  reportInventoryPDF() {
    const parts = Storage.getParts();
    const baixoEstoque = parts.filter(p => p.estoque <= p.estoqueMinimo);
    
    const tableRows = parts.map(p => {
      const baixo = p.estoque <= p.estoqueMinimo;
      return `
        <tr style="${baixo ? 'background: #ffebee;' : ''}">
          <td>${p.codigo}</td>
          <td>${p.nome}</td>
          <td>${p.estoque}</td>
          <td>${p.estoqueMinimo}</td>
          <td>${baixo ? '⚠️ BAIXO' : '✓ OK'}</td>
          <td>${p.localizacao || '-'}</td>
        </tr>
      `;
    }).join('');

    const content = `
      <p>Total de peças: <strong>${parts.length}</strong></p>
      <p style="color: #d32f2f;">⚠️ Peças com estoque baixo: <strong>${baixoEstoque.length}</strong></p>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Estoque</th>
            <th>Mínimo</th>
            <th>Status</th>
            <th>Localização</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    this.exportToPDF('Relatório de Estoque', content);
  }
};

window.ExportTools = ExportTools;
