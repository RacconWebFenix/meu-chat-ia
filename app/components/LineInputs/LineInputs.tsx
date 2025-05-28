import React from "react";
import { AutomotivaFields, IndustrialFields } from "../SelectLine/SelectLine";
import styles from "./LineInputs.module.scss";

interface LineInputsProps {
  linha: "automotiva" | "industrial";
  automotiva: AutomotivaFields;
  setAutomotiva: React.Dispatch<React.SetStateAction<AutomotivaFields>>;
  industrial: IndustrialFields;
  setIndustrial: React.Dispatch<React.SetStateAction<IndustrialFields>>;
  disabled?: boolean;
}

export default function LineInputs({
  linha,
  automotiva,
  setAutomotiva,
  industrial,
  setIndustrial,
  disabled,
}: LineInputsProps) {
  if (linha === "automotiva") {
    return (
      <div className={styles.inputsAutomotiva}>
        <input
          className={styles.inputField}
          placeholder="Nome"
          value={automotiva.nome}
          onChange={(e) =>
            setAutomotiva({ ...automotiva, nome: e.target.value })
          }
          disabled={disabled}
        />
        <input
          className={styles.inputField}
          placeholder="Características físicas"
          value={automotiva.caracteristicas}
          onChange={(e) =>
            setAutomotiva({ ...automotiva, caracteristicas: e.target.value })
          }
          disabled={disabled}
        />
        <input
          className={styles.inputField}
          placeholder="Referência"
          value={automotiva.referenciaAutomotiva}
          onChange={(e) =>
            setAutomotiva({
              ...automotiva,
              referenciaAutomotiva: e.target.value,
            })
          }
          disabled={disabled}
        />
        <input
          className={styles.inputField}
          placeholder="Marca/Fabricante"
          value={automotiva.marcaFabricante}
          onChange={(e) =>
            setAutomotiva({ ...automotiva, marcaFabricante: e.target.value })
          }
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <div className={styles.inputsIndustrial}>
      <input
        className={styles.inputField}
        placeholder="Nome da Peça ou Componente"
        value={industrial.nomePeca}
        onChange={(e) =>
          setIndustrial({ ...industrial, nomePeca: e.target.value })
        }
        disabled={disabled}
      />
      <input
        className={styles.inputField}
        placeholder="Características físicas"
        value={industrial.caracteristicasInd}
        onChange={(e) =>
          setIndustrial({
            ...industrial,
            caracteristicasInd: e.target.value,
          })
        }
        disabled={disabled}
      />
      <input
        className={styles.inputField}
        placeholder="Referência da Marca ou Fabricante"
        value={industrial.referenciaInd}
        onChange={(e) =>
          setIndustrial({ ...industrial, referenciaInd: e.target.value })
        }
        disabled={disabled}
      />
      <input
        className={styles.inputField}
        placeholder="Marca ou Fabricante"
        value={industrial.marcaInd}
        onChange={(e) =>
          setIndustrial({ ...industrial, marcaInd: e.target.value })
        }
        disabled={disabled}
      />
      <input
        className={styles.inputField}
        placeholder="Norma Aplicável"
        value={industrial.norma}
        onChange={(e) =>
          setIndustrial({ ...industrial, norma: e.target.value })
        }
        disabled={disabled}
      />
      <input
        className={styles.inputField}
        placeholder="Aplicação"
        value={industrial.aplicacao}
        onChange={(e) =>
          setIndustrial({ ...industrial, aplicacao: e.target.value })
        }
        disabled={disabled}
      />
    </div>
  );
}
