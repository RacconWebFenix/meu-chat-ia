/**
 * Extrai a explicação e a primeira tabela markdown de um texto.
 * @param markdownSource string
 * @returns { explanation: string; table: string | null }
 */
export function extractExplanationAndTable(markdownSource: string): {
  explanation: string;
  table: string | null;
} {


  // Regex mais flexível: pega a primeira tabela markdown, com ou sem \n antes
  const tableRegex = /(\|.*\|.*\n\|[-:| ]+\n(?:.*\|.*\n?)*)/;
  const match = markdownSource.match(tableRegex);

  let explanation = markdownSource;
  let table: string | null = null;

  if (match) {
    explanation = markdownSource.slice(0, match.index);
    table = match[0];
  }

  return { explanation, table };
}
