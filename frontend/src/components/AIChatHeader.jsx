import { X } from "lucide-react";
import { useEffect } from "react";
import { useSideBarStore } from "../store/useSideBarStore.js";
import { useAIStore } from "../store/useAIStore.js";
const AIChatHeader = () => {
  const {  selectedScreen, setSelectedScreen } = useSideBarStore();
  const {clearChatHistory} = useAIStore()

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={"./aiProfile.jpg"} alt ={"AI"} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{"Chat Assistant "}</h3>
            <p className="text-sm text-base-content/70">
              {"Online"}
            </p>
          </div>
        </div>
           {/* Close button */}
           <div className="flex gap-5" >
           <button onClick={() =>{
              clearChatHistory()
           }}>
            <img src="./delete.png" className="w-10  rounded-full " />
        </button>
           <button onClick={() => setSelectedScreen("chats")}>
          <X />
        </button>

           </div>
      </div>
    </div>
  );
};
export default AIChatHeader;
