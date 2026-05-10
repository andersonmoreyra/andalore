const ExportTools={
  csv(name,rows){if(!rows.length){alert('Sem dados para exportar.');return}const headers=Object.keys(rows[0]);const csv=[headers.join(';'),...rows.map(r=>headers.map(h=>`"${String(r[h]??'').replaceAll('"','""')}"`).join(';'))].join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name+'.csv';a.click();URL.revokeObjectURL(a.href)},
  exportWorkOrders(){this.csv('ordens-servico',Storage.getWorkOrders())},exportTechnicians(){this.csv('tecnicos',Storage.getTechnicians())},exportParts(){this.csv('pecas',Storage.getParts())},exportAssets(){this.csv('ativos',Storage.getAssets())},exportRequests(){this.csv('solicitacoes',Storage.getRequests())},
  reportWorkOrdersPDF(){window.print()},reportTeamPDF(){window.print()},reportInventoryPDF(){window.print()}
}; window.ExportTools=ExportTools;
