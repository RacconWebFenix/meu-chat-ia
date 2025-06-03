import { ddds } from "@/app/mocks/ddds";
import styles from "./SearchPrice.module.scss";
import { useState } from "react";

export default function SearchPrice() {
  const [searchPrice, setSearchPrice] = useState({
    descricao: "",
    marca: "",
    referencia: "",
    preco: "",
    ddd: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchPrice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode chamar a função de pesquisa ou API
    console.log(searchPrice);
  };

  return (
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
      <div>
        <input
          type="text"
          name="descricao"
          placeholder="Descrição"
          value={searchPrice.descricao}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="marca"
          placeholder="Marca"
          value={searchPrice.marca}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="referencia"
          placeholder="Referência"
          value={searchPrice.referencia}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="preco"
          placeholder="Preço Unitário"
          value={searchPrice.preco}
          onChange={handleChange}
          className={styles.input}
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
            !searchPrice.ddd
          }
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
