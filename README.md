# 🚀 CIB2B Chat - AI Assistant

> Sistema de chat inteligente com integração a múltiplas APIs de IA, dashboard de dados e funcionalidades avançadas.

## 📊 **Status do Projeto**

- ✅ **Frontend**: Next.js 14 + TypeScript + MUI
- ✅ **Backend**: API Routes + NextAuth
- ✅ **Database**: Prisma + PostgreSQL  
- ✅ **AI Integration**: OpenAI + Perplexity APIs
- ✅ **Dashboard**: Sistema de tabelas com dados reais
- ✅ **Clean Code**: Implementado padrão de componentização

---

## 🎛️ **Dashboard & Tabelas**

### **Funcionalidades do Dashboard**
- ✅ **Visualização de Tabelas**: Interface para visualizar dados do banco
- ✅ **Processo de Serviço**: Tabela principal com informações completas
- ✅ **Queries Customizadas**: Sistema de queries SQL via N8N
- ✅ **Nomes Reais**: Exibição de nomes de clientes e fornecedores (não apenas IDs)
- ✅ **Paginação**: Sistema de paginação para grandes volumes de dados
- ✅ **Filtros**: Interface de filtros para busca específica

### **Tabela Processo de Serviço**
```typescript
// Campos exibidos com nomes reais:
- Cliente: COALESCE(customer."NAME", customer."FANTASY_NAME")
- Fornecedor: COALESCE(provider."NAME", provider."FANTASY_NAME") 
- Responsável: ID_BUYER (apenas ID)
- Dados do Processo: Código, número, status, valores, etc.
```

### **Arquitetura de Dados**
```
src/features/dashboard/
├── config/
│   └── tableQueries.ts      # Configurações de queries SQL
├── data/
│   └── tables.ts            # Definições de colunas e displays
└── components/
    └── DataTable/           # Componente de tabela reutilizável
```

### **Como Adicionar Nova Tabela**

#### **1. Configurar Query SQL**
```typescript
// src/features/dashboard/config/tableQueries.ts
{
  tableName: "NOVA_TABELA",
  displayName: "Nova Tabela",
  useN8N: true,
  query: `
    SELECT 
      nt.*,
      COALESCE(related."NAME", related."FANTASY_NAME") as related_name
    FROM "NOVA_TABELA" nt
    LEFT JOIN "RELATED_TABLE" related ON nt."ID_RELATED" = related."ID"
    ORDER BY nt."CREATED_AT" DESC
  `
}
```

#### **2. Definir Estrutura da Tabela**
```typescript
// src/app/(app)/dashboard/data/tables.ts
"NOVA_TABELA": {
  name: "NOVA_TABELA",
  displayName: "Nova Tabela",
  columns: [
    { id: "id", displayName: "ID", width: 80 },
    { id: "name", displayName: "Nome", width: 200 },
    { id: "related_name", displayName: "Relacionado", width: 150 }
  ]
}
```

#### **3. Query Guidelines**
- ✅ Use `LEFT JOIN` para dados opcionais
- ✅ Use `COALESCE()` para fallback entre campos
- ✅ Evite comentários SQL (incompatível com N8N)
- ✅ Use `||` em vez de `CONCAT()` (PostgreSQL)
- ✅ Trate valores NULL adequadamente

---

## 📁 **Arquitetura & Padrões**

### 🎯 **Estrutura de Componentes (Clean Code)**

#### **✅ Componentes Simples (1 arquivo)**
```
src/components/shared/
├── index.ts              # Barrel export principal
├── CustomButton.tsx      # Componente direto
├── CustomInput.tsx       # Componente direto
└── AuthCard.tsx         # Componente direto
```

#### **✅ Componentes Complexos (pasta + arquivos)**
```
src/components/shared/
├── index.ts              # Barrel export principal
├── ChatLoading/          # Pasta para componente complexo
│   └── ChatLoading.tsx   # Sem index.ts individual
└── DataGrid/             # Pasta para componente complexo
    ├── DataGrid.tsx      # Componente principal
    └── utils.ts          # Utilitários relacionados
```

### 🚀 **Regras de Barrel Exports**

#### **1. Index Principal por Categoria**
- ✅ `src/components/index.ts` - Todos os componentes
- ✅ `src/components/shared/index.ts` - Componentes compartilhados  
- ✅ `src/app/forms/index.ts` - Formulários (se necessário)

#### **2. SEM Index Individual**
- ❌ `src/components/shared/Button/index.ts` 
- ❌ `src/components/shared/Input/index.ts`
- ❌ `src/components/shared/Card/index.ts`

#### **3. Imports Limpos**
```typescript
// ✅ Bom - via barrel export
import { CustomButton, CustomInput, AuthCard } from "@/components/shared";

// ❌ Evitar - paths individuais
import CustomButton from "@/components/shared/Button/CustomButton";
import CustomInput from "@/components/shared/Input/CustomInput";
```

---

## 🎨 **Componentes Customizados**

### **CustomButton**
```typescript
// Variantes de cor disponíveis
<CustomButton colorType="primary">Confirmar</CustomButton>
<CustomButton colorType="secondary">Cancelar</CustomButton>
<CustomButton colorType="cancel">Voltar</CustomButton>
<CustomButton colorType="delete">Excluir</CustomButton>
```

### **CustomInput**
```typescript
// TextField customizado com tema
<CustomInput 
  label="Usuário" 
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  fullWidth
  margin="normal"
/>
```

### **AuthCard**
```typescript
// Card centralizado para autenticação
<AuthCard 
  title="Acesse sua conta"
  logo={<Image src="/logo.png" />}
>
  <LoginForm />
</AuthCard>
```

---

## 📋 **Checklist de Implementação**

### **Refatoração Clean Code** ✅
- ✅ Movidos componentes simples para raiz das pastas
- ✅ Removidas pastas individuais desnecessárias  
- ✅ Criado barrel export principal (`/components/index.ts`)
- ✅ Mantido barrel export compartilhado (`/shared/index.ts`)
- ✅ Imports atualizados para usar barrel exports
- ✅ Estrutura otimizada para clean code

### **Componentes Customizados** ✅
- ✅ CustomInput (MUI TextField customizado)
- ✅ CustomButton (MUI Button com variantes)
- ✅ AuthCard (Card centralizado para auth)
- ✅ Eliminação de CSS/SCSS antigos
- ✅ Uso consistente do sistema de tema MUI

### **Formulários de Autenticação** ✅
- ✅ LoginForm - Formulário específico para login
- ✅ RegisterForm - Formulário específico para cadastro
- ✅ Formulários completamente distintos
- ✅ Lógica separada e encapsulada
- ✅ Visual consistente com AuthCard

---

## 🎨 **Benefícios da Arquitetura**

1. **Menos Nesting**: Estrutura mais plana e simples
2. **Imports Limpos**: Uma linha para múltiplos componentes
3. **Manutenibilidade**: Fácil de reorganizar e refatorar
4. **Performance**: Menor quantidade de arquivos index.ts
5. **DX**: Melhor experience de desenvolvimento
6. **Consistência**: Padrão único em todo o projeto
7. **Reutilização**: Componentes altamente reutilizáveis

---

## 🚀 **Como Executar**

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npx prisma migrate dev

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

---

## ⚙️ **Configurações de Desenvolvimento**

### **Variáveis de Ambiente (.env)**
```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# APIs
OPENAI_API_KEY="sk-..."
PERPLEXITY_API_KEY="pplx-..."

# N8N Integration
N8N_WEBHOOK_URL="http://localhost:5678/webhook/..."
```

### **Troubleshooting Dashboard**

#### **Erro 500 nas Tabelas**
- ✅ Verificar se o N8N está rodando
- ✅ Confirmar conexão com PostgreSQL
- ✅ Validar sintaxe das queries SQL
- ✅ Checar se não há comentários SQL na query

#### **Campos com IDs em vez de Nomes**
- ✅ Confirmar JOINs nas tabelas relacionadas
- ✅ Verificar se campos NAME/FANTASY_NAME existem
- ✅ Usar COALESCE para fallback entre campos

#### **Erro de Sintaxe PostgreSQL**
- ✅ Usar `||` em vez de `CONCAT()`
- ✅ Usar `CAST()` para conversão de tipos
- ✅ Tratar valores NULL e strings vazias

---

## 📝 **Notas Importantes**

### **Últimas Atualizações (Janeiro 2025)**
- ✅ **Dashboard Funcional**: Sistema de tabelas totalmente implementado
- ✅ **Queries Otimizadas**: Nomes reais para cliente e fornecedor
- ✅ **Compatibilidade PostgreSQL**: Sintaxe SQL corrigida
- ✅ **Responsável Simplificado**: Campo revertido para ID apenas (evita erros)
- ✅ **N8N Integration**: Queries sem comentários para compatibilidade
- ✅ **Error Handling**: Tratamento robusto de dados ausentes

### **Arquitetura Consolidada**
- Todas as referências 'perplexity' foram renomeadas para 'openai'
- Padrão de clean code implementado em toda a base
- Documentação consolidada neste README único
- Sistema de queries SQL configurável via config files

### **Performance & Manutenibilidade**
- Estrutura de componentes otimizada para reutilização
- Barrel exports para imports limpos
- Separação clara entre dados, UI e lógica de negócio
- Queries SQL modulares e facilmente extensíveis
