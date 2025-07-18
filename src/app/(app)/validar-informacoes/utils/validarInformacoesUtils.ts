import { parseMarkdownTable } from "@/Utils/parseMarkdownTable";

export function processContent(content: string) {
  const tableRegex = /\|.+\|\n/g;
  const tableMatches = content.match(tableRegex);

  let explanation = content;
  let columns: string[] = [];
  let data: string[][] = [];

  if (tableMatches) {
    tableMatches.forEach((tableMarkdown) => {
      const parsedTable = parseMarkdownTable(tableMarkdown);
      columns = parsedTable?.columns || [];
      data = [...data, ...(parsedTable?.data || [])];

      explanation = explanation.replace(tableMarkdown, "").trim();
    });
  }


  return { explanation, columns, data };
}
