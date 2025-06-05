import { useState, useEffect } from "react";
import { AutomotivaFields, IndustrialFields } from "../EquivalenceForm/types";

export function useFormSelectLine(
  linha: "automotiva" | "industrial",
  setLinha: (v: "automotiva" | "industrial") => void,
  setPrompt: (v: string) => void,
  onSend?: (
    prompt: string,
    userInputHeaders: string[],
    userInputRow: (string | undefined)[],
    quantidadeEquivalentes: number
  ) => void
) {
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

  const [quantidadeEquivalentes, setQuantidadeEquivalentes] = useState(5);

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
  }, [linha]);

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

  return {
    automotiva,
    setAutomotiva,
    industrial,
    setIndustrial,
    quantidadeEquivalentes,
    setQuantidadeEquivalentes,
    handleSubmit,
  };
}
