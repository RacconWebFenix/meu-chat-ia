import { useState } from "react";
import { formatCurrency, formatPrecoEnvio } from "@/app/Utils/utils";
import ChatLoading from "../shared/ChatLoading/ChatLoading";
import SearchPriceResult from "./SearchPriceResult/SearchPriceResult";
import { useSearchPrice } from "./hooks/useSearchPrice";
import { SearchPricePayload } from "./types";
import SearchPriceForm from "./SearchPriceForm/SearchPriceForm";

export default function SearchPrice() {
  const [searchPrice, setSearchPrice] = useState({
    descricao: "",
    marca: "",
    referencia: "",
    preco: "",
    ddd: "",
  });

  const { loading, result, search } = useSearchPrice();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "preco") {
      setSearchPrice((prev) => ({
        ...prev,
        preco: formatCurrency(value),
      }));
    } else {
      setSearchPrice((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: SearchPricePayload = {
      ...searchPrice,
      preco: Number(formatPrecoEnvio(searchPrice.preco)),
    };
    search(payload);
  };
  console.log(result);
  return (
    <>
      {loading && (
        <div style={{ marginBottom: "1rem" }}>
          <ChatLoading />
        </div>
      )}
      {result && (
        <div style={{ marginBottom: "1rem" }}>
          <SearchPriceResult
            result={{
              ...result,
              userValue: searchPrice.preco,
            }}
            loading={false}
            error={null}
          />
        </div>
      )}
      <SearchPriceForm
        values={searchPrice}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </>
  );
}
