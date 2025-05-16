import MessageItem from "./MessageItem";
import { Message } from "./ChatBoot";

interface Props {
  messages: Message[];
}

export default function MessageList({ messages }: Props) {
  if (messages.length === 0) {
    return (
      <p>
        Olá! Sou sua assistente virtual especializada em cadastro e busca de
        materiais. Como posso ajudar você hoje?
      </p>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        minHeight: 300,
        marginBottom: 12,
        overflowY: "auto",
      }}
    >
      {messages.map((msg, i) => (
        <MessageItem key={i} message={msg} />
      ))}
    </div>
  );
}
