export function parseMarkdownTable(markdown: string): { columns: string[]; data: string[][] } | null {
  const lines = markdown.trim().split("\n");
  if (lines.length < 2) return null;
  const columns = lines[0].split("|").map((h) => h.trim()).filter(Boolean);
  const data: string[][] = [];
  for (let i = 2; i < lines.length; i++) {
    const row = lines[i].split("|").map((cell) => cell.trim()).filter(Boolean);
    if (row.length) data.push(row);
  }
  return { columns, data };
}