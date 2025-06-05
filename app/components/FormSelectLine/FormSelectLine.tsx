import React, { useState, useEffect } from "react";
import LineInputs from "../LineInputs/LineInputs";
import styles from "./FormSelectLine.module.scss";

// Tipagem para os campos da linha automotiva
export type AutomotivaFields = {
  nome: string;
  caracteristicas: string;
  referenciaAutomotiva: string;
  marcaFabricante: string;
};

// Tipagem para os campos da linha industrial/multiaplicação
export type IndustrialFields = {
  nomePeca: string;
  caracteristicasInd: string;
  referenciaInd: string;
  marcaInd: string;
  norma: string;
  aplicacao: string;
};

interface SelectLineProps {
  linha: "automotiva" | "industrial";
  setLinha: (v: "automotiva" | "industrial") => void;
  setPrompt: (v: string) => void;
  onSend?: (
    prompt: string,
    userInputHeaders: string[],
    userInputRow: (string | undefined)[],
    quantidadeEquivalentes: number // NOVO
  ) => void;
  disabled?: boolean;
}

export default function FormSelectLine({
  linha,
  setLinha,
  setPrompt,
  onSend,
  disabled,
}: SelectLineProps) {
  const [automotiva, setAutomotiva] = useState<AutomotivaFields>({
    nome: "",
    caracteristicas: "",
    referenciaAutomotiva: "",
    marcaFabricante: "",
  });

  const [industrial, setIndustrial] = useState<IndustrialFields>({
    nomePeca: "",
    caracteristicasInd: "",
    referenciaInd: "",
    marcaInd: "",
    norma: "",
    aplicacao: "",
  });

  // Novo state para quantidade de equivalentes
  const [quantidadeEquivalentes, setQuantidadeEquivalentes] = useState(5);

  // Atualiza o prompt sempre que os campos mudam
  useEffect(() => {
    if (linha === "automotiva") {
      setPrompt(
        `Nome: ${automotiva.nome}
Características físicas: ${automotiva.caracteristicas}
Referência: ${automotiva.referenciaAutomotiva}
Marca/Fabricante: ${automotiva.marcaFabricante}
Quantidade de produtos na tabela: ${quantidadeEquivalentes}`
      );
    } else {
      setPrompt(
        `Nome da Peça ou Componente: ${industrial.nomePeca}
Características físicas: ${industrial.caracteristicasInd}
Referência da Marca ou Fabricante: ${industrial.referenciaInd}
Marca ou Fabricante: ${industrial.marcaInd}
Norma Aplicável: ${industrial.norma}
Aplicação: ${industrial.aplicacao}
Quantidade de produtos na tabela: ${quantidadeEquivalentes}`
      );
    }
  }, [linha, automotiva, industrial, setPrompt, quantidadeEquivalentes]);

  // Limpa os campos dos inputs sempre que a linha for trocada
  useEffect(() => {
    if (linha === "automotiva") {
      setAutomotiva({
        nome: "",
        caracteristicas: "",
        referenciaAutomotiva: "",
        marcaFabricante: "",
      });
    } else {
      setIndustrial({
        nomePeca: "",
        caracteristicasInd: "",
        referenciaInd: "",
        marcaInd: "",
        norma: "",
        aplicacao: "",
      });
    }
    // O setPrompt já será atualizado pelo outro useEffect
    // eslint-disable-next-line
  }, [linha]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let prompt = "";
    if (linha === "automotiva") {
      if (
        !automotiva.nome.trim() &&
        !automotiva.caracteristicas.trim() &&
        !automotiva.referenciaAutomotiva.trim() &&
        !automotiva.marcaFabricante.trim()
      ) {
        alert("Preencha pelo menos um campo da linha automotiva.");
        return;
      }
      prompt = `Nome: ${automotiva.nome}
Características físicas: ${automotiva.caracteristicas}
Referência: ${automotiva.referenciaAutomotiva}
Marca/Fabricante: ${automotiva.marcaFabricante}
Quantidade de produtos na tabela: ${quantidadeEquivalentes}`;
    } else {
      if (
        !industrial.nomePeca.trim() &&
        !industrial.caracteristicasInd.trim() &&
        !industrial.referenciaInd.trim() &&
        !industrial.marcaInd.trim() &&
        !industrial.norma.trim() &&
        !industrial.aplicacao.trim()
      ) {
        alert(
          "Preencha pelo menos um campo da linha industrial/multiaplicação."
        );
        return;
      }
      prompt = `Nome da Peça ou Componente: ${industrial.nomePeca}
Características físicas: ${industrial.caracteristicasInd}
Referência da Marca ou Fabricante: ${industrial.referenciaInd}
Marca ou Fabricante: ${industrial.marcaInd}
Norma Aplicável: ${industrial.norma}
Aplicação: ${industrial.aplicacao}
Quantidade de produtos na tabela: ${quantidadeEquivalentes}`;
    }

    if (onSend)
      onSend(prompt, userInputHeaders, userInputRow, quantidadeEquivalentes);
  }

  // Exemplo para ambos os tipos de linha:
  const userInputHeaders =
    linha === "automotiva"
      ? ["Nome", "Características físicas", "Referência", "Marca/Fabricante"]
      : [
          "Nome da Peça ou Componente",
          "Características físicas",
          "Referência da Marca ou Fabricante",
          "Marca ou Fabricante",
          "Norma Aplicável",
          "Aplicação",
        ];

  const userInputRow =
    linha === "automotiva"
      ? [
          automotiva.nome,
          automotiva.caracteristicas,
          automotiva.referenciaAutomotiva,
          automotiva.marcaFabricante,
        ]
      : [
          industrial.nomePeca,
          industrial.caracteristicasInd,
          industrial.referenciaInd,
          industrial.marcaInd,
          industrial.norma,
          industrial.aplicacao,
        ];

  return (
    <form className={styles.selectLineForm} onSubmit={handleSubmit}>
      <div>
        <select
          className={styles.selectLineSelect}
          value={linha}
          onChange={(e) =>
            setLinha(
              e.target.value === "automotiva" ? "automotiva" : "industrial"
            )
          }
          disabled={disabled}
        >
          <option value="automotiva">Linha Automotiva</option>
          <option value="industrial">Linha Industrial / Multiaplicação</option>
        </select>

        {/* NOVO SELECT */}
        <select
          className={styles.selectLineSelect}
          value={quantidadeEquivalentes}
          onChange={(e) => setQuantidadeEquivalentes(Number(e.target.value))}
          disabled={disabled}
          style={{ marginLeft: 8 }}
        >
          <option value={5}>5 produtos equivalentes</option>
          <option value={10}>10 produtos equivalentes</option>
          <option value={20}>20 produtos equivalentes</option>
        </select>

        <LineInputs
          linha={linha}
          automotiva={automotiva}
          setAutomotiva={setAutomotiva}
          industrial={industrial}
          setIndustrial={setIndustrial}
          disabled={disabled}
        />
      </div>

      <button type="submit" className={styles.buttonSubmit} disabled={disabled}>
        Enviar
      </button>
    </form>
  );
}
