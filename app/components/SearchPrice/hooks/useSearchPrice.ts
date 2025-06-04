import { useState } from "react";
import { SearchPricePayload, SearchPriceResultData } from "../types";
import { API_BASE_URL } from "@/app/config/api";

export function useSearchPrice() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchPriceResultData | null>(null);

  // Monta o payload no formato desejado
  function buildPayload(values: SearchPricePayload): { text: string } {
    // Exemplo: "rolamento esfera skf 6205z ddd: 16"
    const prompt = `${values.descricao} ${values.marca} ${values.referencia} ddd: ${values.ddd}`;
    return { text: prompt };
  }

  async function search(values: SearchPricePayload) {
    setLoading(true);
    setResult(null);

    const payload = buildPayload(values);

    const response = await fetch(`${API_BASE_URL}/price-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setResult(data);
    setLoading(false);

    // console.log("Payload enviado:", payload);
  }

  return { loading, result, search };
}
