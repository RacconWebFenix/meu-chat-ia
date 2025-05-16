interface Props {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  onSend: () => void;
  disabled: boolean;
}

export default function MessageInput({ input, setInput, onSend, disabled }: Props) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        type="text"
        placeholder="Material, produto ou serviço, Fabricante, Marca de referência"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        disabled={disabled}
      />
      <button
        onClick={onSend}
        disabled={disabled || !input.trim()}
        style={{ padding: "0 16px" }}
      >
        Enviar
      </button>
    </div>
  );
}
