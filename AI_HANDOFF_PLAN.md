# 🤖 PLANEJAMENTO PARA IA SUCESSORA - SISTEMA PDM

## 📋 BRIEFING INICIAL

### 🎯 MISSÃO
Você está assumindo a manutenção e evolução do **Sistema PDM (Product Data Management)** - um fluxo completo de padronização e busca de equivalências de produtos implementado em React/TypeScript.

### 📚 DOCUMENTAÇÃO OBRIGATÓRIA
1. **LEIA PRIMEIRO**: `FLUXO_PDM_DOCUMENTATION.md` - Documentação completa do sistema
2. **ANALISE**: Estrutura de pastas em `src/features/pdm/`
3. **COMPREENDA**: Fluxo de 3 etapas: Entrada → Revisão → Equivalências

## 🚨 PROTOCOLOS CRÍTICOS

### ⛔ NUNCA FAÇA:
- ❌ **NEVER CLICK "KEEP"** no VS Code Copilot (causa corrupção de componentes)
- ❌ Criar múltiplos scrolls verticais (mantém scroll único)
- ❌ Elementos fixos que interferem no layout
- ❌ Alterar tipos sem validação TypeScript

### ✅ SEMPRE FAÇA:
- ✅ Commit antes de mudanças grandes
- ✅ Execute `npx tsc --noEmit --skipLibCheck` após alterações
- ✅ Mantenha layout vertical em coluna única
- ✅ Preserve funcionalidade dos cards editáveis

## 🔍 ANÁLISE INICIAL OBRIGATÓRIA

### 1️⃣ PRIMEIRO PASSO - Verificação do Estado Atual
```bash
# Verifique se compila sem erros
npx tsc --noEmit --skipLibCheck

# Analise estrutura de arquivos
ls -la src/features/pdm/components/
ls -la src/features/pdm/types/
```

### 2️⃣ SEGUNDO PASSO - Leia os Arquivos Principais
```bash
# Arquivos críticos para entender
src/features/pdm/components/FieldSelection.tsx  # Interface principal
src/features/pdm/components/PDMFlow.tsx         # Orquestrador
src/features/pdm/types/enrichment.types.ts     # Estrutura de dados
src/components/ChatPDM/ChatPDM.tsx             # Container pai
```

### 3️⃣ TERCEIRO PASSO - Execute e Teste
```bash
npm run dev
# Acesse: http://localhost:3000/search
# Teste o fluxo PDM completo
```

## 🗺️ MAPA DE NAVEGAÇÃO DO CÓDIGO

### 📁 Hierarquia de Componentes
```
MainLayout (src/components/MainLayout/)
└── search/page.tsx
    ├── TabsSwitcher (Equivalência/PDM)
    └── FadeSwitch
        └── ChatPDM
            ├── Botões (PDM/Chat)
            └── PDMFlow
                ├── Stepper (3 etapas)
                └── [FieldSelection | EntryForm | N8NResults]
```

### 🎯 Componente Focal: FieldSelection.tsx
**LAYOUT ATUAL** (preservar):
```
┌─────────────────────────────┐
│    SEÇÃO 1: Resumo PDM      │ ← 100% width, texto corrido + IMAGENS
│    [Texto expansível]       │ ← Com até 5 imagens do produto
│    [🖼️ Imagem Grid]         │ ← Grid responsivo com fonte indicada
└─────────────────────────────┘
┌─────────────────────────────┐
│    SEÇÃO 2: Características │ ← 100% width, grid de cards
│    [Card] [Card] [Card]     │
│    [+ Adicionar]            │
└─────────────────────────────┘
┌─────────────────────────────┐
│    SEÇÃO 3: Dados Produto   │ ← 100% width, formulário
│    [Campos] [Preview]       │
│    [Voltar] [Continuar]     │
└─────────────────────────────┘
```

## 📊 DADOS E TIPOS IMPORTANTES

### 🏷️ Estrutura de Dados Principal
```typescript
// BaseProductInfo - Entrada do usuário
{ informacoes: string }

// EnrichedProductData - Dados enriquecidos pela IA
{
  categoria: string;
  marcaFabricante?: string;
  especificacoesTecnicas: {
    resumoPDM?: string;              // ← SEÇÃO 1
    especificacoesTecnicas: Record<string, unknown>; // ← SEÇÃO 2
  };
  // ... outros campos
}
```

## 🔄 CENÁRIOS DE MANUTENÇÃO

### 🐛 Cenário 1: Bug Report
1. **Reproduza o problema** no ambiente local
2. **Identifique o componente** afetado
3. **Verifique logs** no console do navegador
4. **Corrija mantendo** a estrutura de layout vertical
5. **Valide** com TypeScript antes do commit

### ✨ Cenário 2: Nova Funcionalidade
1. **Analise** onde se encaixa no fluxo de 3 etapas
2. **Considere** impacto no layout de coluna única
3. **Mantenha** compatibilidade com tipos existentes
4. **Teste** integração com serviços (IA + N8N)

### 🎨 Cenário 3: Mudança de Layout
1. **CUIDADO**: Layout atual funciona bem (scroll único)
2. **Preserve** estrutura de 3 seções verticais
3. **Teste** responsividade em diferentes telas
4. **Valide** que não criou múltiplos scrolls

## 🛠️ FERRAMENTAS E COMANDOS ÚTEIS

### 🔧 Debugging
```bash
# Buscar por referências
grep -r "FieldSelection" src/ --include="*.tsx"
grep -r "PDMFlow" src/ --include="*.tsx"
grep -r "resumoPDM" src/ --include="*.ts" --include="*.tsx"

# Verificar imports quebrados
grep -r "import.*PDM" src/ --include="*.tsx"
```

### 📝 Análise de Estado
```bash
# Buscar hooks de estado
grep -r "useState" src/features/pdm/ --include="*.tsx"
grep -r "usePDMFlow" src/ --include="*.tsx"
```

### 🎯 Teste de Funcionalidades
```bash
# Buscar implementações específicas
grep -r "CheckboxSpecCard" src/ --include="*.tsx"
grep -r "AddNewSpecDialog" src/ --include="*.tsx"
```

## 🚀 ROADMAP DE EVOLUÇÃO

### 🔥 PRIORIDADE ALTA
- [ ] **Performance**: Otimizar re-renders dos cards
- [ ] **UX**: Feedback visual durante processamento
- [ ] **Validação**: Melhorar validação de campos obrigatórios

### 🔧 PRIORIDADE MÉDIA
- [ ] **Testes**: Implementar testes automatizados
- [ ] **Cache**: Sistema de cache para dados enriquecidos
- [ ] **Acessibilidade**: Melhorar ARIA labels

### � PRIORIDADE ALTA
- [ ] **Performance**: Otimizar re-renders dos cards
- [ ] **UX**: Feedback visual durante processamento
- [ ] **Validação**: Melhorar validação de campos obrigatórios

### 🔧 PRIORIDADE MÉDIA
- [ ] **Testes**: Implementar testes automatizados
- [ ] **Cache**: Sistema de cache para dados enriquecidos
- [ ] **Acessibilidade**: Melhorar ARIA labels

### 💡 PRIORIDADE BAIXA
- [x] **Export**: Funcionalidade de exportar dados (IMPLEMENTADO)
- [ ] **Temas**: Sistema de temas customizáveis
- [ ] **Analytics**: Métricas de uso do sistema

## 📞 COMUNICAÇÃO E HANDOFF

### 💬 Como Pedir Ajuda
Se precisar de esclarecimentos:
1. **Especifique** qual arquivo está analisando
2. **Descreva** o comportamento atual vs esperado
3. **Inclua** mensagens de erro se houver
4. **Mencione** qual browser/device está testando

### 📝 Como Reportar Progresso
1. **Liste** arquivos modificados
2. **Descreva** mudanças implementadas
3. **Confirme** que TypeScript compila sem erros
4. **Teste** o fluxo completo funcionando

### 🎯 Métricas de Sucesso
- ✅ **Funcional**: Fluxo de 3 etapas funciona end-to-end
- ✅ **Performance**: Sem travamentos ou lentidão
- ✅ **UX**: Interface responsiva e intuitiva
- ✅ **Code Quality**: Zero erros TypeScript
- ✅ **Export**: Sistema de exportação XLSX/CSV/PDF/ODT funcionando
- ✅ **Images**: Correção de distribuição de imagens entre equivalências

## 🏁 CHECKLIST DE HANDOFF

Antes de reportar trabalho concluído:

- [ ] ✅ Sistema compila sem erros TypeScript
- [ ] ✅ Fluxo completo (Entrada → Revisão → Equivalências) funciona
- [ ] ✅ Layout em coluna única preservado
- [ ] ✅ Scroll único (sem múltiplos scrolls)
- [ ] ✅ Cards de características editáveis funcionando
- [ ] ✅ Botões de navegação respondem corretamente
- [ ] ✅ Dados persistem entre etapas
- [ ] ✅ Interface responsiva em mobile/desktop
- [ ] ✅ Documentação atualizada se necessário

---

**🎯 MISSÃO**: Manter e evoluir o sistema PDM mantendo qualidade e funcionalidade  
**📚 RECURSO**: Use `FLUXO_PDM_DOCUMENTATION.md` como referência técnica completa  
**🚨 LEMBRETE**: NEVER CLICK "KEEP" - SEMPRE faça commit antes de mudanças grandes  
**📅 ÚLTIMA ATUALIZAÇÃO**: 29 de Agosto de 2025  
**🚀 STATUS ATUAL**: Sistema PDM 100% Funcional com Validação + Imagens + Exportação + Correção de Imagens  

**🤖 BOA SORTE! O sistema está bem estruturado e documentado. Você tem tudo para ter sucesso!**
