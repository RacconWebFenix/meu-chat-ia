import ChatMessage from "../ChatMessage/ChatMessage";
import { Message } from "../Hooks/useChatBoot";
import styles from "./ChatMessageList.module.scss";

interface Props {
  messages: Message[];
  userInputHeaders?: string[];
  userInputRow?: (string | undefined)[];
  type?: string; // Adicionado para receber o tipo de pesquisa
}

export default function ChatMessageList({
  messages,
  userInputHeaders,
  userInputRow,
  type,
}: Props) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className={styles.messageListContainer}>
      {messages.map((msg, i) => (
        <ChatMessage
          key={i}
          message={msg}
          citations={msg.citations}
          userInputHeaders={userInputHeaders}
          userInputRow={userInputRow}
          type={type}
        />
      ))}
    </div>
  );
}
