import MessageItem from "../MessageItem/MessageItem";
import { Message } from "../ChatBoot/ChatBoot";
import styles from "./MessageList.module.scss";

interface Props {
  messages: Message[];
  userInputHeaders?: string[];
  userInputRow?: (string | undefined)[];
}

export default function MessageList({
  messages,
  userInputHeaders,
  userInputRow,
}: Props) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div>
      <div className={styles.messageListContainer}>
        {messages.map((msg, i) => (
          <MessageItem
            key={i}
            message={msg}
            citations={msg.citations}
            userInputHeaders={userInputHeaders}
            userInputRow={userInputRow}
          />
        ))}
      </div>
    </div>
  );
}
