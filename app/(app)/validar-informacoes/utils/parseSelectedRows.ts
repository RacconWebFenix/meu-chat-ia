// utils/parseSelectedRows.ts

/**
 * Recebe um valor (string JSON ou objeto) e retorna um array de objetos para a InfoTable.
 * Garante que sempre retorna um array ou null se inválido.
 */
export function parseSelectedRows(
  valor: unknown
): Record<string, string>[] | null {
  try {
    const parsed = typeof valor === "string" ? JSON.parse(valor) : valor;
    if (Array.isArray(parsed)) {
      return parsed;
    } else if (parsed && typeof parsed === "object") {
      return [parsed as Record<string, string>];
    }
    return null;
  } catch {
    return null;
  }
}
