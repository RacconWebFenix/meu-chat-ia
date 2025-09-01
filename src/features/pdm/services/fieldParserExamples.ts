/**
 * Dynamic Field Parser - Usage Examples
 * Este arquivo demonstra como usar o parser dinâmico de campos
 */

import { dynamicFieldParser, createDynamicFieldParser } from "../services";

// Exemplo 1: Parse básico de um campo
console.log("=== Exemplo 1: Parse básico ===");
const parsedField = dynamicFieldParser.parseField(
  "diametroInternoMm",
  "rolamentos"
);
console.log("Campo original:", parsedField.originalKey);
console.log("Label amigável:", parsedField.friendlyLabel);
console.log("Categoria:", parsedField.category);
console.log("Confiança:", parsedField.confidence);
console.log("Fonte:", parsedField.source);

// Exemplo 2: Parse de múltiplos campos
console.log("\n=== Exemplo 2: Parse de múltiplos campos ===");
const techSpecs = {
  nomeProduto: "Rolamento 6205",
  fabricante: "SKF",
  diametroInternoMm: 25,
  diametroExternoMm: 52,
  larguraMm: 15,
  capacidadeCargaDinamicaKn: 14.8,
  velocidadeMaximaRpm: 12000,
  materialGaiola: "Aço",
  tipoVedacao: "RS",
  campoDesconhecido: "valor desconhecido",
};

const parsedFields = dynamicFieldParser.parseFields(techSpecs, "rolamentos");
Object.entries(parsedFields).forEach(([key, parsed]) => {
  console.log(
    `${key} -> ${parsed.friendlyLabel} (confiança: ${parsed.confidence})`
  );
});

// Exemplo 3: Adicionar mapeamento personalizado
console.log("\n=== Exemplo 3: Mapeamento personalizado ===");
dynamicFieldParser.addCustomMapping(
  "codigoInterno",
  "Código Interno",
  "sistema"
);
const customParsed = dynamicFieldParser.parseField("codigoInterno");
console.log("Campo personalizado:", customParsed.friendlyLabel);

// Exemplo 4: Mapeamento por categoria
console.log("\n=== Exemplo 4: Mapeamento por categoria ===");
dynamicFieldParser.addCategoryMapping("motores", "potenciaHp", "Potência (HP)");
const motorField = dynamicFieldParser.parseField("potenciaHp", "motores");
console.log("Campo de motor:", motorField.friendlyLabel);

// Exemplo 5: Estatísticas do parser
console.log("\n=== Exemplo 5: Estatísticas ===");
const stats = dynamicFieldParser.getStats();
console.log("Estatísticas do parser:", stats);

// Exemplo 6: Campos com padrões dinâmicos
console.log("\n=== Exemplo 6: Padrões dinâmicos ===");
const dynamicExamples = [
  "alturaCm",
  "pesoKg",
  "pressaoBar",
  "temperaturaCelsius",
  "tipoMotor",
  "materialBase",
];

dynamicExamples.forEach((field) => {
  const parsed = dynamicFieldParser.parseField(field);
  console.log(`${field} -> ${parsed.friendlyLabel} (${parsed.source})`);
});

// Exemplo 7: Export/Import de configuração
console.log("\n=== Exemplo 7: Export/Import de configuração ===");
const config = dynamicFieldParser.exportConfig();
console.log(
  "Configuração exportada com",
  Object.keys(config.knownMappings).length,
  "mapeamentos conhecidos"
);

// Criar nova instância e importar configuração
const newParser = createDynamicFieldParser();
newParser.importConfig(config);
console.log("Configuração importada com sucesso");

// Exemplo 8: Parse de dados enriquecidos do PDM
console.log("\n=== Exemplo 8: Parse de dados PDM ===");
const mockEnrichedData = {
  categoria: "rolamentos",
  especificacoesTecnicas: {
    resumoPDM:
      "Nome do Produto: Rolamento 6305\nFabricante: FAG\nReferência: 6305-2RS",
    especificacoesTecnicas: {
      diametroInternoMm: 25,
      diametroExternoMm: 62,
      larguraMm: 17,
      capacidadeCargaDinamicaKn: 22.5,
      velocidadeMaximaRpm: 9500,
    },
  },
};

const pdmParsed = dynamicFieldParser.parseEnrichedData(mockEnrichedData);
console.log("Campos PDM parseados:");
Object.entries(pdmParsed).forEach(([key, parsed]) => {
  console.log(`  ${key}: ${parsed.friendlyLabel}`);
});

export {};
