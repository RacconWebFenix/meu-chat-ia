import { useState } from "react";
import { SearchPricePayload, SearchPriceResultData } from "../types";
import { searchPriceMock } from "@/app/mocks/searchPriceMock";

export function useSearchPrice() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchPriceResultData | null>(null);

  async function search(payload: SearchPricePayload) {
    setLoading(true);
    setResult(null);

    // Simulação de chamada à API usando o mock
    setTimeout(() => {
      setResult(searchPriceMock); // sempre retorna o mock
      setLoading(false);
    }, 1800);

    // Para chamada real:
    // const response = await fetch("/api/search-price", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // const data = await response.json();
    // setResult(data);
    // setLoading(false);

    console.log(payload);
  }

  return { loading, result, search };
}
