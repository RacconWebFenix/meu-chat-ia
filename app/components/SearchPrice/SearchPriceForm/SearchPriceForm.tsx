import React from "react";
import { ddds } from "@/app/mocks/ddds";
import styles from "./SearchPriceForm.module.scss";

interface Props {
  values: {
    descricao: string;
    marca: string;
    referencia: string;
    preco: string;
    ddd: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function SearchPriceForm({
  values,
  onChange,
  onSubmit,
  loading,
}: Props) {
  return (
    <form onSubmit={onSubmit} className={styles.container}>
      <div>
        <select
          name="ddd"
          value={values.ddd}
          onChange={onChange}
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
          value={values.descricao}
          onChange={onChange}
          className={styles.inputField}
        />
        <input
          type="text"
          name="marca"
          placeholder="Marca"
          value={values.marca}
          onChange={onChange}
          className={styles.inputField}
        />
        <input
          type="text"
          name="referencia"
          placeholder="Referência"
          value={values.referencia}
          onChange={onChange}
          className={styles.inputField}
        />
        <input
          type="text"
          name="preco"
          placeholder="Preço Unitário"
          value={values.preco}
          onChange={onChange}
          className={styles.inputField}
          inputMode="numeric"
        />
      </div>
      <div>
        <button
          type="submit"
          className={styles.sendButton}
          disabled={
            !values.descricao ||
            !values.marca ||
            !values.referencia ||
            !values.preco ||
            !values.ddd ||
            loading
          }
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
