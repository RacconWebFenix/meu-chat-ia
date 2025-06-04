import { ddds } from "@/app/mocks/ddds";
import styles from "./SearchPrice.module.scss";
import { useState } from "react";
import { formatCurrency, formatPrecoEnvio } from "@/app/Utils/utils";
import ChatLoading from "../ChatLoading/ChatLoading";
import SearchPriceResult from "./SearchPriceResult/SearchPriceResult";
import { searchPriceMock } from "@/app/mocks/searchPriceMock"; // importe seu mock
import { SearchPriceResultData } from "./types";

export default function SearchPrice() {
  const [searchPrice, setSearchPrice] = useState({
    descricao: "",
    marca: "",
    referencia: "",
    preco: "",
    ddd: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchPriceResultData | null>(null);

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
    setLoading(true);
    setResult(null);

    // Monta o objeto de envio com preco convertido para double
    const payload = {
      ...searchPrice,
      preco: formatPrecoEnvio(searchPrice.preco),
    };

    console.log("Enviando dados:", payload);

    // Simulação de chamada à API usando o mock
    setTimeout(() => {
      setResult(searchPriceMock); // sempre retorna o mock
      setLoading(false);
    }, 1800);
  };

  return (
    <>
      {loading && (
        <div style={{ marginBottom: "1rem" }}>
          <ChatLoading />
        </div>
      )}
      {result && (
        <div style={{ marginBottom: "1rem" }}>
          <SearchPriceResult result={result} loading={false} error={null} />
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.container}>
        <div>
          <select
            name="ddd"
            value={searchPrice.ddd}
            onChange={handleChange}
            className={styles.selectDdd}
          >
            {ddds.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.inputsSearchPrice}>
          <input
            type="text"
            name="descricao"
            placeholder="Descrição"
            value={searchPrice.descricao}
            onChange={handleChange}
            className={styles.inputField}
          />
          <input
            type="text"
            name="marca"
            placeholder="Marca"
            value={searchPrice.marca}
            onChange={handleChange}
            className={styles.inputField}
          />
          <input
            type="text"
            name="referencia"
            placeholder="Referência"
            value={searchPrice.referencia}
            onChange={handleChange}
            className={styles.inputField}
          />
          <input
            type="text"
            name="preco"
            placeholder="Preço Unitário"
            value={searchPrice.preco}
            onChange={handleChange}
            className={styles.inputField}
            inputMode="numeric"
          />
        </div>
        <div>
          <button
            type="submit"
            className={styles.sendButton}
            disabled={
              !searchPrice.descricao ||
              !searchPrice.marca ||
              !searchPrice.referencia ||
              !searchPrice.preco ||
              !searchPrice.ddd ||
              loading
            }
          >
            Enviar
          </button>
        </div>
      </form>
    </>
  );
}
