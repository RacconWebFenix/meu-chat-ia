import ChatPDMView from "./ChatPDMView/ChatPDMView";
import { useChatPDM } from "@/features/chat/hooks";

export default function ChatPDM() {
  const chat = useChatPDM();
  return <ChatPDMView {...chat} />;
}
