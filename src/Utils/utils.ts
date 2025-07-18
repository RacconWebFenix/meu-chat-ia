export function formatCurrency(value: string) {
  const numeric = value.replace(/\D/g, "");
  const float = Number(numeric) / 100;
  return float.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatPrecoEnvio(preco: string) {
  return preco
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
}
export function getSiteName(url: string) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}