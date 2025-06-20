// components/ChatBoot.tsx

import ChatMessegeList from "./ChatMessegeList/ChatMessageList";
import FeedbackForm from "../FeedbackForm/FeedbackForm";
import EquivalenceForm from "./EquivalenceForm/EquivalenceForm";
import styles from "./ChatBoot.module.scss";
import ChatLoading from "../shared/ChatLoading/ChatLoading";
import { useChatBoot } from "./Hooks/useChatBoot";

export default function ChatBoot() {
  const {
    messages,
    setPrompt: setPromptRaw,
    loading,
    feedbackSent,
    userInputHeaders,
    userInputRow,
    sendFeedback,
    handleSend,
    currentFeedbackId,
  } = useChatBoot();

  // Função adaptadora para o EquivalenceForm
  const setPrompt = (v: any) => {
    setPromptRaw(JSON.stringify(v));
  };

  // Função adaptadora para onSend
  const handleSendEquivalence = (
    prompt: any,
    userInputHeaders: string[],
    userInputRow: (string | undefined)[],
    quantidadeEquivalentes: number
  ) => {
    handleSend(JSON.stringify(prompt), userInputHeaders, userInputRow);
  };

  return (
    <div className={styles.chatBootContainer}>
      <ChatMessegeList
        messages={messages}
        userInputHeaders={userInputHeaders}
        userInputRow={userInputRow}
      />
      {loading && <ChatLoading />}

      {currentFeedbackId && !feedbackSent && (
        <FeedbackForm onSendFeedback={sendFeedback} />
      )}

      <EquivalenceForm
        setPrompt={setPrompt}
        onSend={handleSendEquivalence}
        disabled={loading}
      />
    </div>
  );
}
