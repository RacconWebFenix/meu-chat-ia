import { SearchPriceJsonInterface } from "../types";

export interface ComparativoValoresResult {
  maiorValor: number;
  valorUsuario: number;
  diffPercent: number;
  textoComparativo: string;
  valoresNumericos: number[];
}

export function getComparativoValores(
  jsonObjects: SearchPriceJsonInterface[],
  userValue?: string | number
): ComparativoValoresResult {
  const valoresNumericos = Array.isArray(jsonObjects)
    ? jsonObjects.map((obj) =>
        parseBRLToNumber(
          typeof obj.valor === "string"
            ? obj.valor
                .replace(/[^\d,.-]/g, "")
                .replace(/\./g, "")
                .replace(",", ".")
            : String(obj.valor)
        )
      )
    : [];

  const maiorValor = Math.max(...valoresNumericos.filter((v) => !isNaN(v)));

  const valorUsuario =
    typeof userValue === "string"
      ? parseBRLToNumber(userValue)
      : Number(userValue);

  let diffPercent = 0;
  if (maiorValor > 0 && !isNaN(valorUsuario)) {
    diffPercent = ((valorUsuario - maiorValor) / maiorValor) * 100;
  }

  let textoComparativo = "";
  if (maiorValor > 0 && !isNaN(valorUsuario)) {
    if (diffPercent > 0) {
      textoComparativo = `O valor informado está ${diffPercent.toFixed(
        2
      )}% acima do maior valor listado.`;
    } else if (diffPercent < 0) {
      textoComparativo = `O valor informado está ${Math.abs(
        diffPercent
      ).toFixed(2)}% abaixo do maior valor listado.`;
    } else {
      textoComparativo = "O valor informado é igual ao maior valor listado.";
    }
  }

  return {
    maiorValor,
    valorUsuario,
    diffPercent,
    textoComparativo,
    valoresNumericos,
  };
}

/**
 * Extrai um array de objetos JSON de um texto que contenha um bloco ```json ... ```
 * @param content string
 * @returns SearchPriceJson[] ou []
 */
export function extractJsonObjectsFromContent(
  content: string
): SearchPriceJsonInterface[] {
  // Regex para pegar o bloco ```json ... ```
  const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
  const jsonMatch = content.match(jsonBlockRegex);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (e) {
       
      console.warn("Falha ao fazer parse do JSON embutido:", e);
      return [];
    }
  }
  return [];
}

/**
 * Calcula a diferença percentual entre o valor do usuário e o maior valor do JSON.
 * @param jsonObjects Array de objetos extraídos do JSON (precisa ter campo 'valor')
 * @param valorUsuario Valor informado pelo usuário (string ou number)
 * @returns { diffPercent: number, textoComparativo: string, maiorValor: number }
 */
export function getDiffPercentFromJson(
  jsonObjects: SearchPriceJsonInterface[],
  valorUsuario: string | number
): { diffPercent: number; textoComparativo: string; maiorValor: number } {
  // Função auxiliar para converter BRL para número
  const parseBRLToNumber = (valor: string) => {
    if (!valor) return NaN;
    const cleaned = valor
      .replace(/[^\d,.-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
    return parseFloat(cleaned);
  };

  // Converte todos os valores do JSON para número
  const valoresNumericos = Array.isArray(jsonObjects)
    ? jsonObjects.map((obj) => parseBRLToNumber(obj.valor))
    : [];

  // Maior valor do JSON
  const maiorValor = Math.max(...valoresNumericos.filter((v) => !isNaN(v)));

  // Valor do usuário convertido
  const valorUsuarioNum =
    typeof valorUsuario === "string"
      ? parseBRLToNumber(valorUsuario)
      : Number(valorUsuario);

  // Diferença percentual
  let diffPercent = 0;
  if (maiorValor > 0 && !isNaN(valorUsuarioNum)) {
    diffPercent = ((valorUsuarioNum - maiorValor) / maiorValor) * 100;
  }

  // Texto explicativo
  let textoComparativo = "";
  if (maiorValor > 0 && !isNaN(valorUsuarioNum)) {
    if (diffPercent > 0) {
      textoComparativo = `O valor informado está ${diffPercent.toFixed(
        2
      )}% acima do maior valor listado.`;
    } else if (diffPercent < 0) {
      textoComparativo = `O valor informado está ${Math.abs(
        diffPercent
      ).toFixed(2)}% abaixo do maior valor listado.`;
    } else {
      textoComparativo = "O valor informado é igual ao maior valor listado.";
    }
  }

  return { diffPercent, textoComparativo, maiorValor };
}

/**
 * Converte um valor monetário brasileiro em string ("R$ 65,45") para number (65.45)
 * Retorna NaN se não for possível converter.
 */
export function parseBRLToNumber(valor: string): number {
  if (!valor) return NaN;
  // Remove "R$", espaços e pontos de milhar, troca vírgula por ponto
  const cleaned = valor
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return parseFloat(cleaned);
}

/**
 * Melhora a legibilidade do markdown:
 * - Adiciona linhas em branco antes/depois de tabelas
 * - Destaca títulos e observações
 */
export function beautifyMarkdown(content: string): string {
  let result = content;

  // Adiciona uma linha em branco antes e depois de cada tabela markdown
  result = result.replace(
    /(\n\|.*\|.*\n(\|[-:]+.*\n)((?:.*\|.*\n?)+))/g,
    "\n\n$1\n\n"
  );

  // Destaca títulos (linhas que começam com texto e dois pontos)
  result = result.replace(/^([A-Z][^\n:]{3,}:)/gm, "\n**$1**");

  // Destaca "Obs." e "Observação"
  result = result.replace(/(Obs\.?:)/gi, "\n**$1**");

  // Remove espaços duplos desnecessários
  result = result.replace(/[ ]{2,}/g, " ");

  return result;
}
