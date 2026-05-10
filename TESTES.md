# CHECKLIST DE TESTES - Sistema v3.0

Execute TODOS os testes abaixo na ordem:

## 1. LOGIN E AUTENTICAÇÃO
- [ ] Abrir https://andersonmoreyra.github.io/andalore/
- [ ] Login com anderson@marvi.com / admin123
- [ ] Verificar se redireciona para Dashboard
- [ ] Logout funciona
- [ ] Login novamente

## 2. NOVA ORDEM DE SERVIÇO
- [ ] Ir em "Ordens de Serviço"
- [ ] Clicar "+ Nova OS"
- [ ] Preencher: Título "Teste OS 01", Equipamento "EX-01"
- [ ] Tipo: Corretiva, Prioridade: Alta
- [ ] Continuar →
- [ ] Selecionar técnico Diego Araújo
- [ ] Criar ordem
- [ ] OS aparece na lista?
- [ ] Clicar na OS criada
- [ ] Dados estão corretos?

## 3. EDITAR ORDEM
- [ ] Com uma OS selecionada, clicar "Editar"
- [ ] Mudar título para "Teste OS 01 - Editado"
- [ ] Mudar prioridade para Crítica
- [ ] Salvar
- [ ] Título mudou na lista?

## 4. DELETAR ORDEM
- [ ] Editar uma OS
- [ ] Clicar "Excluir OS"
- [ ] Confirmar
- [ ] OS sumiu da lista?

## 5. CHECKLIST
- [ ] Configurações → Templates de Checklist
- [ ] Criar novo template "Preventiva Extrusora"
- [ ] Adicionar item "Verificar temperatura" (checkbox, obrigatório)
- [ ] Adicionar item "Temperatura medida" (número)
- [ ] Criar template
- [ ] Template aparece na lista?

## 6. EXECUTAR CHECKLIST EM OS
- [ ] Criar uma nova OS
- [ ] Clicar na OS criada
- [ ] Clicar botão "Checklist"
- [ ] Selecionar o template criado
- [ ] Marcar checkbox
- [ ] Preencher número
- [ ] Concluir checklist
- [ ] Mensagem de sucesso?

## 7. GESTÃO DE TÉCNICOS
- [ ] Configurações → Equipe
- [ ] Clicar "Adicionar técnico"
- [ ] Nome: "José Santos"
- [ ] Especialidade: Eletricista
- [ ] Turno: B
- [ ] Escolher cor do avatar
- [ ] Adicionar
- [ ] Técnico aparece no grid?

## 8. EDITAR TÉCNICO
- [ ] Clicar editar no técnico José
- [ ] Mudar para "José Santos Silva"
- [ ] Salvar
- [ ] Nome mudou?

## 9. SOLICITAÇÕES
- [ ] Ir em "Solicitações"
- [ ] Criar nova solicitação
- [ ] Título: "Vazamento hidráulico"
- [ ] Equipamento: IM-01
- [ ] Prioridade: Alta
- [ ] Criar
- [ ] Solicitação aparece com status "pendente"?

## 10. CONVERTER SOLICITAÇÃO EM OS
- [ ] Na solicitação criada, clicar "Converter em OS"
- [ ] Confirmar
- [ ] Status muda para "convertida"?
- [ ] Ir em Ordens → Nova OS foi criada?

## 11. GESTÃO DE PEÇAS
- [ ] Estoque → Peças
- [ ] Nova peça
- [ ] Código: "ROL-001"
- [ ] Nome: "Rolamento 6205"
- [ ] Estoque: 3
- [ ] Mínimo: 5
- [ ] Adicionar
- [ ] Peça aparece com status "Baixo"?

## 12. GESTÃO DE ATIVOS
- [ ] Estoque → Equipamentos
- [ ] Novo ativo
- [ ] Código: "TST-01"
- [ ] Nome: "Equipamento Teste"
- [ ] Área: Produção
- [ ] Adicionar
- [ ] Ativo aparece no grid?

## 13. EXPORTAÇÕES
- [ ] Configurações → Backup
- [ ] Clicar "📋 Ordens de Serviço" (Excel)
- [ ] Arquivo CSV baixado?
- [ ] Abrir no Excel → dados corretos?
- [ ] Clicar "📋 Relatório de OS" (PDF)
- [ ] Janela abre com relatório?
- [ ] Imprimir funciona?

## 14. BACKUP
- [ ] Configurações → Backup
- [ ] Clicar "⬇️ Exportar Backup Completo"
- [ ] Arquivo JSON baixado?
- [ ] Abrir JSON → tem dados?

## 15. DASHBOARD
- [ ] Ir para Dashboard
- [ ] KPIs mostram números corretos?
- [ ] Lista de ordens ativas mostra as OS criadas?
- [ ] Timeline mostra atividades?

---

## BUGS ENCONTRADOS:

(Anotar aqui qualquer erro ou comportamento estranho)

1. 
2. 
3. 

---

## RESULTADO:
- [ ] TODOS OS TESTES PASSARAM
- [ ] ALGUNS TESTES FALHARAM (detalhar acima)
