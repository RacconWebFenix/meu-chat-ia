import React from "react";

interface MessageInputProps {
  descricao: string;
  setDescricao: (value: string) => void;
  referencia: string;
  setReferencia: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function MessageInput({
  descricao,
  setDescricao,
  referencia,
  setReferencia,
  onSend,
  disabled,
}: MessageInputProps) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={e => setDescricao(e.target.value)}
        disabled={disabled}
        style={{ flex: 2, padding: 8 }}
      />
      <input
        type="text"
        placeholder="Fabricante/Marca/Referência"
        value={referencia}
        onChange={e => setReferencia(e.target.value)}
        disabled={disabled}
        style={{ flex: 2, padding: 8 }}
      />
      <button
        onClick={onSend}
        disabled={disabled}
        style={{ padding: "8px 16px" }}
      >
        Enviar
      </button>
    </div>
  );
}
