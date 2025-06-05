/**
 * Extrai a explicação e a primeira tabela markdown de um texto.
 * @param markdownSource string
 * @returns { explanation: string; table: string }
 */
export function extractExplanationAndTable(markdownSource: string): { explanation: string; table: string } {
  const tableRegex = /\n(\|.*\|.*\n(\|[-:]+.*\n)((?:.*\|.*\n?)+))/;
  const match = markdownSource.match(tableRegex);

  let explanation = markdownSource;
  let table = "";

  if (match) {
    explanation = markdownSource.slice(0, match.index);
    table = match[0];
  }

  return { explanation, table };
}