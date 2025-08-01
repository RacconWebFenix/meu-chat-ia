// utils/parseSelectedRows.ts

/**
 * Recebe um valor (string JSON ou objeto) e retorna um array de objetos para a InfoTable.
 * Garante que sempre retorna um array ou null se inválido.
 */
export function parseSelectedRows(
  valor:
    | string
    | Record<string, string | number | boolean | null>
    | Record<string, string | number | boolean | null>[]
): Record<string, string>[] | null {
  try {
    const parsed = typeof valor === "string" ? JSON.parse(valor) : valor;
    if (Array.isArray(parsed)) {
      return parsed.map((row) =>
        Object.fromEntries(
          Object.entries(row).map(([k, v]) => [k, v == null ? "" : String(v)])
        )
      );
    } else if (parsed && typeof parsed === "object") {
      return [
        Object.fromEntries(
          Object.entries(parsed).map(([k, v]) => [
            k,
            v == null ? "" : String(v),
          ])
        ),
      ];
    }
    return null;
  } catch {
    return null;
  }
}
