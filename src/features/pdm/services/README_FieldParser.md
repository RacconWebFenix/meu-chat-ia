# Dynamic Field Parser

O **Dynamic Field Parser** é um serviço inteligente para mapear campos técnicos dinâmicos para labels amigáveis ao usuário. Ele segue os princípios SOLID e oferece aprendizado incremental para melhorar a precisão ao longo do tempo.

## Funcionalidades

### 🧠 **Inteligência Adaptativa**
- **Mapeamentos conhecidos**: Campos frequentemente usados têm mapeamentos pré-definidos
- **Padrões dinâmicos**: Reconhece padrões como unidades (mm, kg, kN) e tipos
- **Aprendizado incremental**: Aprende com novos campos encontrados
- **Categorização**: Mapeamentos específicos por categoria de produto

### 🎯 **Precisão Alta**
- **Sistema de confiança**: Cada mapeamento tem nível de confiança (0-1)
- **Fallback inteligente**: Para campos desconhecidos, usa formatação camelCase
- **Fonte rastreável**: Sabe a origem de cada mapeamento (conhecido/padrão/fallback)

### 🔧 **Configurável**
- **Mapeamentos customizados**: Adicione seus próprios mapeamentos
- **Por categoria**: Configure mapeamentos específicos para tipos de produto
- **Export/Import**: Salve e restaure configurações
- **Estatísticas**: Monitore uso e eficácia

## Como Usar

### Importação Básica

```typescript
import { dynamicFieldParser } from '../services';
```

### Parse de Campo Único

```typescript
const parsed = dynamicFieldParser.parseField('diametroInternoMm', 'rolamentos');
console.log(parsed.friendlyLabel); // "Diâmetro Interno (mm)"
console.log(parsed.confidence);    // 1.0 (mapeamento conhecido)
```

### Parse de Múltiplos Campos

```typescript
const techSpecs = {
  nomeProduto: 'Rolamento 6205',
  fabricante: 'SKF',
  diametroInternoMm: 25,
  capacidadeCargaDinamicaKn: 14.8
};

const parsedFields = dynamicFieldParser.parseFields(techSpecs, 'rolamentos');
```

### Adicionar Mapeamento Customizado

```typescript
dynamicFieldParser.addCustomMapping('codigoInterno', 'Código Interno', 'sistema');
```

### Mapeamento por Categoria

```typescript
dynamicFieldParser.addCategoryMapping('motores', 'potenciaHp', 'Potência (HP)');
const motorField = dynamicFieldParser.parseField('potenciaHp', 'motores');
```

## Mapeamentos Pré-definidos

### Campos Gerais
- `nomeProduto` → "Nome do Produto"
- `fabricante` → "Fabricante"
- `referenciaEncontrada` → "Referência"
- `ncm` → "NCM"

### Dimensões
- `diametroInternoMm` → "Diâmetro Interno (mm)"
- `diametroExternoMm` → "Diâmetro Externo (mm)"
- `larguraMm` → "Largura (mm)"
- `alturaMm` → "Altura (mm)"

### Capacidades
- `capacidadeCargaDinamicaKn` → "Capacidade de Carga Dinâmica (kN)"
- `capacidadeCargaEstaticaKn` → "Capacidade de Carga Estática (kN)"

### Velocidades
- `velocidadeMaximaRpm` → "Velocidade Máxima (RPM)"
- `velocidadeMinimaRpm` → "Velocidade Mínima (RPM)"

## Padrões Dinâmicos

O parser reconhece automaticamente estes padrões:

### Unidades
- `alturaMm` → "Altura (mm)"
- `pesoKg` → "Peso (kg)"
- `pressaoBar` → "Pressão (bar)"
- `temperaturaCelsius` → "Temperatura Celsius"

### Tipos
- `tipoVedacao` → "Tipo de Vedação"
- `materialGaiola` → "Material Gaiola"

### CamelCase
- `compatibilidadeVeiculos` → "Compatibilidade Veiculos"

## Sistema de Confiança

- **1.0**: Mapeamento conhecido específico
- **0.9**: Mapeamento por categoria
- **0.7**: Padrão dinâmico reconhecido
- **0.3**: Fallback camelCase

## Integração com PDM

O parser se integra automaticamente com dados enriquecidos do PDM:

```typescript
const pdmParsed = dynamicFieldParser.parseEnrichedData(enrichedData);
```

## Monitoramento

### Estatísticas de Uso

```typescript
const stats = dynamicFieldParser.getStats();
console.log('Total de campos:', stats.totalFields);
console.log('Mapeamentos conhecidos:', stats.knownMappings);
console.log('Por categoria:', stats.categories);
```

### Campos Frequentes

O parser identifica automaticamente campos que aparecem frequentemente e podem ser candidatos a mapeamentos conhecidos.

## Persistência

### Exportar Configuração

```typescript
const config = dynamicFieldParser.exportConfig();
// Salvar em localStorage, arquivo, etc.
```

### Importar Configuração

```typescript
const config = loadConfigFromStorage();
dynamicFieldParser.importConfig(config);
```

## Benefícios

### Para Desenvolvedores
- ✅ **Manutenibilidade**: Centraliza lógica de mapeamento
- ✅ **Extensibilidade**: Fácil adicionar novos mapeamentos
- ✅ **Testabilidade**: Lógica isolada e testável
- ✅ **Reutilização**: Usado em múltiplos componentes

### Para Usuários
- ✅ **Consistência**: Labels padronizados em toda aplicação
- ✅ **Inteligência**: Reconhecimento automático de padrões
- ✅ **Adaptabilidade**: Aprende com novos tipos de produto
- ✅ **Precisão**: Sistema de confiança evita erros

## Arquitetura

O parser segue os princípios SOLID:

- **Single Responsibility**: Uma classe, uma responsabilidade
- **Open/Closed**: Extensível sem modificar código existente
- **Liskov Substitution**: Interfaces consistentes
- **Interface Segregation**: Interfaces específicas
- **Dependency Inversion**: Injeção de dependências

## Casos de Uso

1. **Identificação de Materiais**: Parse de especificações técnicas
2. **PDM Integration**: Mapeamento de dados do sistema PDM
3. **Formulários Dinâmicos**: Labels amigáveis em tempo real
4. **Relatórios**: Consistência em exportações
5. **APIs**: Normalização de dados de diferentes fontes
