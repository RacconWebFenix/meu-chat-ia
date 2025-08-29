# 🧪 EXEMPLOS E PAYLOADS PARA TESTES - SISTEMA PDM

## 🎯 Payloads de Teste para o Fluxo PDM

### 📝 Entrada de Dados (PDMStep.ENTRY)

#### Exemplo 1: Rolamento SKF
```json
{
  "informacoes": "Rolamento SKF 6205-2RS1/C3"
}
```

#### Exemplo 2: Caneca Cerâmica
```json
{
  "informacoes": "Caneca de Cerâmica Esmaltada 350ml Branca"
}
```

#### Exemplo 3: Motor Elétrico
```json
{
  "informacoes": "Motor elétrico trifásico 5cv 1750rpm 220/380V"
}
```

### 🔄 Resposta do Enriquecimento (EnrichmentResponse)

#### Exemplo: Rolamento SKF
```json
{
  "original": {
    "informacoes": "Rolamento SKF 6205-2RS1/C3"
  },
  "enriched": {
    "categoria": "Elementos de Máquinas",
    "subcategoria": "Rolamentos",
    "marcaFabricante": "SKF",
    "informacoes": "Rolamento SKF 6205-2RS1/C3",
    "especificacoesTecnicas": {
      "resumoPDM": "Modelo de PDM para Rolamento\n1. Identificação e Classificação do Produto\n- Nome do Produto: Rolamento de Esferas, Rolamento Axial\n- Código/SKU do Fabricante: 6205, NJ 205, 32006 X\n- Tipo: Radial de Esferas, Autocompensador de Rolos, de Rolos Cônicos\n2. Dados Geométricos e de Dimensão\n- Diâmetro Interno: 25 mm, 30 mm, 35 mm\n- Diâmetro Externo: 52 mm, 62 mm, 72 mm\n- Largura: 15 mm, 16 mm, 17 mm\n3. Dados de Desempenho e Operação\n- Capacidade de Carga Dinâmica: 14.8 kN, 19.5 kN, 29.5 kN\n- Capacidade de Carga Estática: 6.55 kN, 11.2 kN, 20.0 kN\n- Velocidade Máxima Permitida: 19000 rpm, 17000 rpm, 15000 rpm\n4. Materiais e Componentes\n- Material Principal: Aço cromo, Aço inoxidável, Cerâmica\n- Tipo de Lubrificação: Graxa, Óleo, Lubrificação sólida\n- Vedação: Aberto, Vedado (2RS), Blindado (2Z)\n5. Dados Adicionais e Documentação\n- Data Sheet (Folha de Dados): Documento técnico com especificações detalhadas\n- Normas Aplicáveis: ISO 15, DIN 625, ABMA standards\n- Certificações: ISO 9001, TS 16949",
      "especificacoesTecnicas": {
        "Fabricante": "SKF",
        "Referencia Encontrada": "6205-2RS1/C3",
        "N (cm)": "84821000",
        "Unidade Medida": "mm",
        "Material": "Aço cromo",
        "Tipo Rolamento": "Radial de Esferas",
        "Capacidade Carga": "14.8 kN",
        "Diametro Interno (mm)": "25 mm",
        "Diametro Externo (mm)": "52 mm",
        "Largura (mm)": "15 mm",
        "Velocidade Maxima Permitida": "19000 rpm"
      }
    },
    "aplicacao": "Máquinas industriais, motores elétricos, bombas",
    "normas": ["ISO 15", "DIN 625", "ABMA"],
    "pdmPadronizado": "ROLAMENTO-ESFERAS-6205-2RS1-C3-SKF",
    "observacoes": ["Vedação dupla", "Folga interna C3"]
  },
  "metrics": {
    "confidence": 0.95,
    "processingTime": 1200,
    "dataCompleteness": 0.88
  },
  "suggestions": [
    {
      "field": "aplicacao",
      "suggestion": "Considere adicionar aplicações específicas",
      "confidence": 0.7
    }
  ],
  "warnings": []
}
```

#### Exemplo: Caneca Cerâmica
```json
{
  "original": {
    "informacoes": "Caneca de Cerâmica Esmaltada 350ml Branca"
  },
  "enriched": {
    "categoria": "Utensílios Domésticos",
    "subcategoria": "Canecas e Xícaras",
    "marcaFabricante": "Tramontina",
    "informacoes": "Caneca de Cerâmica Esmaltada 350ml Branca",
    "especificacoesTecnicas": {
      "resumoPDM": "Modelo de PDM para Caneca\n1. Identificação e Classificação do Produto\n- Nome do Produto: Caneca, Caneca de Cerâmica, Caneca Térmica\n- Código/SKU do Fabricante: 12345, CMK-001, CAN-2023\n- Tipo: Caneca com Alça, Caneca Térmica, Caneca Personalizada\n2. Dados Geométricos e de Dimensão\n- Capacidade: 250 ml, 350 ml, 450 ml\n- Altura: 9 cm, 10 cm, 12 cm\n- Diâmetro: 7 cm, 8 cm, 9 cm\n3. Dados de Desempenho e Operação\n- Resistência ao Calor: Até 100°C, Até 120°C, Resistente a micro-ondas\n- Compatibilidade: Uso doméstico, Uso comercial, Uso em micro-ondas\n4. Materiais e Componentes\n- Material Principal: Cerâmica, Porcelana, Aço Inoxidável\n- Tipo de Alça: Alça integrada, Alça em C, Alça ergonômica\n- Acabamento: Esmaltado, Fosco, Brilhante\n5. Lubrificação\n- Não aplicável para canecas\n6. Dados Adicionais e Documentação\n- Data Sheet (Folha de Dados): Documento técnico com especificações detalhadas do motor, incluindo curvas de desempenho\n- Modelos 3D e 2D: Arquivos CAD para integração em projetos de engenharia",
      "especificacoesTecnicas": {
        "Fabricante": "Tramontina",
        "Referencia Encontrada": "25299/010",
        "N (cm)": "6912.00.00",
        "Unidade Medida": "unidade",
        "Material": "Cerâmica esmaltada",
        "Capacidade Ml": "350 ml",
        "Altura (cm)": "9.5 cm",
        "Diametro (cm)": "8 cm",
        "Tipo Alca": "Alça em C",
        "Cor": "Branca com detalhes azuis",
        "Peso G": "320 g",
        "Acabamento": "Esmaltado brilhante"
      }
    },
    "aplicacao": "Uso doméstico, restaurantes, escritórios",
    "normas": ["INMETRO", "ISO 12875"],
    "pdmPadronizado": "CANECA-CERAMICA-350ML-BRANCA-TRAMONTINA",
    "observacoes": ["Resistente ao micro-ondas", "Não indicado para lava-louças"]
  },
  "metrics": {
    "confidence": 0.87,
    "processingTime": 950,
    "dataCompleteness": 0.92
  },
  "suggestions": [],
  "warnings": ["Verificar compatibilidade com lava-louças"]
}
```

## 🧪 Cenários de Teste

### ✅ Cenário 1: Fluxo Completo Sucesso
1. **Entrada**: Dados válidos de produto conhecido
2. **Enriquecimento**: Retorna dados estruturados
3. **Revisão**: Usuário edita algumas especificações
4. **Equivalências**: Sistema encontra produtos similares

### ⚠️ Cenário 2: Dados Incompletos
1. **Entrada**: Informações muito vagas
2. **Enriquecimento**: Retorna com baixa confiança
3. **Revisão**: Usuário precisa completar campos obrigatórios
4. **Equivalências**: Busca com critérios expandidos

### ❌ Cenário 3: Erro de Serviço
1. **Entrada**: Dados válidos
2. **Enriquecimento**: Falha de conectividade/timeout
3. **Revisão**: Interface mostra estado de erro
4. **Equivalências**: Opção de tentar novamente

## 🎛️ Estados dos Componentes

### usePDMFlow States
```typescript
// Estado Inicial
{
  currentStep: PDMStep.ENTRY,
  status: ProcessingStatus.IDLE,
  error: null
}

// Durante Processamento
{
  currentStep: PDMStep.ENTRY,
  status: ProcessingStatus.PROCESSING,
  error: null
}

// Após Enriquecimento
{
  currentStep: PDMStep.FIELD_SELECTION,
  status: ProcessingStatus.COMPLETED,
  error: null
}

// Em Caso de Erro
{
  currentStep: PDMStep.ENTRY,
  status: ProcessingStatus.ERROR,
  error: "Falha na comunicação com o serviço"
}
```

### FieldSelection EditableData
```typescript
// Estado Inicial (após enriquecimento)
{
  categoria: "Elementos de Máquinas",
  aplicacao: "Máquinas industriais",
  informacoes: "Rolamento SKF 6205-2RS1/C3",
  marca: "SKF",
  especificacoesTecnicas: [
    {
      id: "uuid-1",
      key: "Fabricante",
      value: "SKF",
      checked: true
    },
    {
      id: "uuid-2", 
      key: "Referencia Encontrada",
      value: "6205-2RS1/C3",
      checked: true
    }
    // ... mais especificações
  ]
}

// Após Edições do Usuário
{
  categoria: "Elementos de Máquinas", // mantido
  aplicacao: "Máquinas industriais, bombas", // editado
  informacoes: "Rolamento SKF 6205-2RS1/C3", // mantido
  marca: "SKF", // mantido
  especificacoesTecnicas: [
    {
      id: "uuid-1",
      key: "Fabricante",
      value: "SKF",
      checked: true // mantido selecionado
    },
    {
      id: "uuid-2",
      key: "Referencia Encontrada", 
      value: "6205-2RS1/C3",
      checked: false // usuário desmarcou
    },
    {
      id: "uuid-3",
      key: "Aplicacao Especifica", // usuário adicionou
      value: "Motor elétrico 5cv",
      checked: true
    }
  ]
}
```

## 🔧 Comandos para Debug

### 🐛 Debug de Estado
```javascript
// No console do navegador
// Verificar estado do PDMFlow
console.log("PDM State:", window.React._currentOwner?.state);

// Verificar dados do FieldSelection
console.log("Editable Data:", document.querySelector('[data-testid="field-selection"]'));

// Verificar especificações técnicas
console.log("Specs:", localStorage.getItem('pdm-specs'));
```

### 🔍 Debug de Rede
```bash
# Monitorar chamadas para serviços
# Abrir DevTools > Network > filtrar por "enrichment" ou "n8n"

# Verificar payloads de requisição
# Headers: Content-Type: application/json
# Body: {"productInfo": {"informacoes": "..."}}

# Verificar respostas
# Status: 200 OK
# Body: {"original": {...}, "enriched": {...}}
```

## 📊 Métricas de Performance

### ⏱️ Tempos Esperados
- **Enriquecimento**: 1-3 segundos
- **Busca N8N**: 2-5 segundos  
- **Navegação entre etapas**: < 100ms
- **Edição de cards**: < 50ms

### 📏 Tamanhos de Payload
- **Request Enriquecimento**: < 1KB
- **Response Enriquecimento**: 5-15KB
- **Request N8N**: < 2KB
- **Response N8N**: 10-50KB

## 🎯 Testes de Aceitação

### ✅ Checklist Funcional
- [ ] Formulário de entrada aceita texto livre
- [ ] Validação impede envio com campo vazio
- [ ] Loading state visível durante processamento
- [ ] Dados enriquecidos aparecem na tela de revisão
- [ ] Cards de especificações são editáveis
- [ ] Checkbox funciona para marcar/desmarcar
- [ ] Botão "Adicionar" cria nova especificação
- [ ] Campo "Marca" é obrigatório para continuar
- [ ] Navegação "Voltar" preserva dados
- [ ] Resultados de equivalência são exibidos
- [ ] Interface responsiva em mobile/tablet

### ✅ Checklist de Layout
- [ ] Layout em coluna única vertical
- [ ] Scroll único sem múltiplos scrolls internos
- [ ] Seções claramente separadas
- [ ] Cards com tamanho mínimo de 180px
- [ ] Botões de ação sempre visíveis
- [ ] Typography consistente e legível
- [ ] Espaçamentos uniformes entre elementos

---

**🎯 OBJETIVO**: Facilitar testes e debug do sistema PDM  
**📋 USO**: Copie os payloads para testes manuais ou automatizados  
**🔧 DEBUG**: Use os comandos para investigar problemas  
**✅ VALIDAÇÃO**: Siga os checklists para garantir qualidade
