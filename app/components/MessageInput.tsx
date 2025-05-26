import React from "react";

interface MessageInputProps {
  descricao: string;
  setDescricao: (value: string) => void;
  referencia: string;
  setReferencia: (value: string) => void;
  fabricante: string;
  setFabricante: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function MessageInput({
  descricao,
  setDescricao,
  referencia,
  setReferencia,
  fabricante,
  setFabricante,
  onSend,
  disabled,
}: MessageInputProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao && !referencia && !fabricante) return; // pelo menos um obrigatório
    onSend();
  }

  return (
    <form
      style={{ display: "flex", gap: 8, marginTop: 16 }}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        disabled={disabled}
        style={{ flex: 2, padding: 8 }}
        required={!referencia && !fabricante}
      />
      <input
        type="text"
        placeholder="Código de Referência"
        value={referencia}
        onChange={(e) => setReferencia(e.target.value)}
        disabled={disabled}
        style={{ flex: 2, padding: 8 }}
        required={!descricao && !fabricante}
      />
      <input
        type="text"
        placeholder="Marca / Fabricante"
        value={fabricante}
        onChange={(e) => setFabricante(e.target.value)}
        disabled={disabled}
        style={{ flex: 2, padding: 8 }}
        required={!descricao && !referencia}
      />
      <button type="submit" disabled={disabled} style={{ padding: "8px 16px" }}>
        Enviar
      </button>
    </form>
  );
}
