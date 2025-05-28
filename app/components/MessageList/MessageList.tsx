import MessageItem from "../MessageItem/MessageItem";
import { Message } from "../ChatBoot/ChatBoot";
import styles from "./MessageList.module.scss";

interface Props {
  messages: Message[];
}

export default function MessageList({ messages }: Props) {
  if (messages.length === 0) {
    return (
      <p className={styles.emptyMessage}>
        Olá! Sou sua assistente virtual especializada em cadastro e busca de
        materiais. Como posso ajudar você hoje?
      </p>
    );
  }

  return (
    <div>
      <div className={styles.messageListContainer}>
        {messages.map((msg, i) => (
          <MessageItem key={i} message={msg} citations={msg.citations} />
        ))}
      </div>
    </div>
  );
}
