// components/ChatBoot.tsx

import ChatMessegeList from "./ChatMessegeList/ChatMessageList";
// import FeedbackForm from "../FeedbackForm/FeedbackForm";
import EquivalenceForm from "./EquivalenceForm/EquivalenceForm";
import styles from "./ChatBoot.module.scss";
import { ChatLoading } from "../shared";
import { useChatBoot } from "@/features/chat/hooks";
import { IndustrialFields, RamoFields } from "@/features/chat/types";
import UserSearchTable from "../shared/UserSearchTable/UserSearchTable";

export default function ChatBoot() {
  const {
    messages,
    setPrompt: setPromptRaw,
    loading,
    // feedbackSent,
    userInputHeaders,
    userInputRow,
    // sendFeedback,
    handleSend,
    // currentFeedbackId,
  } = useChatBoot();

  // Função adaptadora para o EquivalenceForm
  const setPrompt = (v: RamoFields | IndustrialFields) => {
    setPromptRaw(JSON.stringify(v));
  };

  // Função adaptadora para onSend
  function handleEquivalenceSend(
    prompt: RamoFields | IndustrialFields,
    userInputHeaders: string[],
    userInputRow: string[]
  ) {
    // Converta o prompt para string (ajuste conforme sua lógica)
    const promptString = JSON.stringify(prompt);
    handleSend(promptString, userInputHeaders, userInputRow);
  }

  return (
    <div className={styles.chatBootContainer}>
      {loading ? (
        <ChatLoading />
      ) : (
        <>
          {userInputHeaders.length > 0 && userInputRow.length > 0 && (
            <UserSearchTable
              inputHeaders={userInputHeaders}
              inputRows={userInputRow}
            />
          )}
          <ChatMessegeList
            messages={messages}
            userInputHeaders={userInputHeaders}
            userInputRow={userInputRow}
          />
          <EquivalenceForm
            setPrompt={setPrompt}
            onSend={handleEquivalenceSend}
            disabled={loading}
          />
        </>
      )}

      {/* {currentFeedbackId && !feedbackSent && (
        <FeedbackForm onSendFeedback={sendFeedback} />
      )} */}
    </div>
  );
}
