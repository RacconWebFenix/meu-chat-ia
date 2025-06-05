import ChatPDMView from "./ChatPDMView/ChatPDMView";
import { useChatPDM } from "./Hooks/useChatPDM";


export default function ChatPDM() {
  const chat = useChatPDM();
  return <ChatPDMView {...chat} />;
}
