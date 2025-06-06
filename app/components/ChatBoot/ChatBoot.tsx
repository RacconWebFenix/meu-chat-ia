// components/ChatBoot.tsx

import ChatMessegeList from "./ChatMessegeList/ChatMessageList";
import FeedbackForm from "../FeedbackForm/FeedbackForm";
import SelectLine from "./EquivalenceForm/EquivalenceForm";
import styles from "./ChatBoot.module.scss";
import ChatLoading from "../shared/ChatLoading/ChatLoading";
import { useChatBoot } from "./Hooks/useChatBoot";

export default function ChatBoot() {
  const {
    messages,
    linha,
    setLinha,
    setPrompt,
    loading,
    currentFeedbackId,
    feedbackSent,
    userInputHeaders,
    userInputRow,
    sendFeedback,
    handleSend,
  } = useChatBoot();

  return (
    <div className={styles.chatBootContainer}>
      <ChatMessegeList
        messages={messages}
        userInputHeaders={userInputHeaders}
        userInputRow={userInputRow}
      />
      {loading && <ChatLoading />}

      {currentFeedbackId && !feedbackSent && messages.length > 0 && (
        <FeedbackForm onSendFeedback={sendFeedback} />
      )}

      <SelectLine
        linha={linha}
        setLinha={setLinha}
        setPrompt={setPrompt}
        onSend={handleSend}
        disabled={loading}
      />
    </div>
  );
}
