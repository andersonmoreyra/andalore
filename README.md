# 🏭 Sistema de Gestão de Manutenção - Marvi Alimentos v3.0

Sistema completo de gestão de manutenção industrial desenvolvido para a Marvi Alimentos - Planta Ourinhos/SP.

---

## ✅ FUNCIONALIDADES IMPLEMENTADAS

### 🔐 **Autenticação e Segurança**
- Sistema de login completo
- Níveis de acesso (Admin, Coordenador, Técnico, Visualizador)
- Controle de permissões
- Sessão persistente

### 📋 **Gestão de Ordens de Serviço**
- ✅ Criar nova OS
- ✅ Editar OS existente
- ✅ Excluir OS
- ✅ Atribuir/reatribuir técnico
- ✅ Mudar status (aberta, executando, aguardando peça, concluída, cancelada)
- ✅ Filtros funcionais (Todas, Em execução, Abertas, Atrasadas)
- ✅ Busca por OS, equipamento ou técnico
- ✅ Visualização detalhada

### ✓ **Templates de Checklist**
- ✅ Criar templates personalizados
- ✅ Editar templates
- ✅ Excluir templates
- ✅ Itens com tipos: checkbox, texto livre, número/medição
- ✅ Itens obrigatórios e opcionais
- ✅ Reordenar itens (arrastar)
- ✅ Templates por tipo de manutenção

### 👥 **Gestão de Equipe**
- ✅ Cadastrar técnicos
- ✅ Editar dados do técnico
- ✅ Remover técnicos
- ✅ Especialidades (Mecânico, Eletricista, Instrumentista, etc)
- ✅ Turnos (A, B, C, ADM)
- ✅ Status em tempo real
- ✅ Avatar personalizado com cores

### 💾 **Backup e Restauração**
- ✅ Exportar todos os dados (JSON)
- ✅ Importar dados de backup
- ✅ Limpar sistema (reset)
- ✅ Estatísticas do sistema

### 📊 **Dashboard e Visualizações**
- KPIs em tempo real
- Timeline do turno
- Lista de ordens ativas
- Atividades recentes
- Status da equipe

---

## 🚀 COMO USAR

### **Login**
Use uma das contas de demonstração:

**Administrador:**
- Email: `anderson@marvi.com`
- Senha: `admin123`

**Coordenador:**
- Email: `fabio@marvi.com`
- Senha: `coord123`

### **Criar Nova OS**
1. Vá em "Ordens de Serviço"
2. Clique em "+ Nova OS"
3. Preencha os dados
4. Selecione técnico
5. Crie a ordem

### **Editar OS**
1. Clique em uma OS na lista
2. Clique em "Editar"
3. Modifique os dados
4. Salve as alterações

### **Gerenciar Checklists**
1. Vá em "Configurações" (menu lateral)
2. Aba "📋 Templates de Checklist"
3. Crie ou edite templates

### **Gerenciar Equipe**
1. Vá em "Configurações"
2. Aba "👥 Equipe"
3. Adicione ou edite técnicos

### **Fazer Backup**
1. Vá em "Configurações"
2. Aba "💾 Backup"
3. Clique em "⬇️ Exportar Backup"
4. Arquivo JSON será baixado

---

## ⚙️ TECNOLOGIAS

- **Frontend:** React 18 (via Babel standalone)
- **Armazenamento:** LocalStorage (navegador)
- **Estilo:** CSS customizado
- **Hospedagem:** GitHub Pages

---

## 📦 ESTRUTURA DE DADOS

Todos os dados são salvos no LocalStorage:

- `manutencao_usuarios` - Usuários e login
- `manutencao_tecnicos` - Técnicos da equipe
- `manutencao_ordens` - Ordens de serviço
- `manutencao_ativos` - Equipamentos
- `manutencao_pecas` - Peças e materiais
- `manutencao_checklist_templates` - Templates de checklist
- `manutencao_configuracoes` - Configurações do sistema

---

## ⚠️ IMPORTANTE

### **Dados no Navegador**
- Os dados ficam salvos **apenas no seu navegador**
- **Não limpe o cache** ou perderá os dados
- Use **sempre o mesmo navegador**
- Faça **backups regulares**

### **Migração Futura**
Para uso em produção, recomenda-se migrar para:
- **Supabase** (PostgreSQL grátis até 500MB)
- **Firebase** (Google)
- Servidor próprio com banco de dados

---

## 🔄 ATUALIZAÇÕES

**v3.0** (atual)
- ✅ Sistema completo de OS
- ✅ Templates de checklist editáveis
- ✅ Gestão de equipe
- ✅ Backup e restauração
- ✅ Edição e exclusão de OS

**v2.0**
- ✅ Sistema de login
- ✅ Nova OS funcional
- ✅ Autenticação

**v1.0**
- ✅ Interface inicial
- ✅ Visualização de dados

---

## 📞 SUPORTE

Desenvolvido para **Marvi Alimentos**
Coordenação de Manutenção - Planta Ourinhos/SP

---

**🎉 Sistema 100% funcional e pronto para uso!**
