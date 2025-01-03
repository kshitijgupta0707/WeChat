import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X , Loader2 } from "lucide-react";
import { useAIStore } from "../store/useAIStore";
import toast from "react-hot-toast";

const AIChatInput = () => {
  const [text, setText] = useState("");
  const {sendMessageToAi  , isAIMessagesSending} = useAIStore();
  const handleSendMessageToAi = async (e) => {
    console.log("handle send message to ai")
    e.preventDefault();
    if (!text.trim()) return;
    console.log("handle")
    try {
      await sendMessageToAi({
        text: text.trim(),
    
      });
        console.log("ho")
      // Clear form
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      <form onSubmit={handleSendMessageToAi} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-md sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() }
        >
          {
isAIMessagesSending ?  
<Loader2 className="h-5 w-5 animate-spin" />
: (
  <Send size={22} />

)
          }
        </button>
      </form>
    </div>
  );
};
export default AIChatInput;

