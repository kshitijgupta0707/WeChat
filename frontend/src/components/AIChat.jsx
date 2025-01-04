import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import AIChatHeader from "./AIChatHeader.jsx";
import AIChatInput from "./AIChatInput.jsx";
import { useAIStore } from "../store/useAIStore.js";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";



const AIChat = () => {
  const {
    aimessages,
  isAIMessagesLoading,
  getAIChat,
  sendMessageToAi
  } = useAIStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  useEffect(() => {
    if ( authUser) {
      getAIChat();
    }
  },
   [getAIChat,authUser]
  );




  useEffect(() => {
    if (messageEndRef.current && aimessages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [aimessages]);

  if (isAIMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <AIChatHeader />
        <MessageSkeleton />
        <AIChatInput />
      </div>
    );
  }
  if (!authUser  || isAIMessagesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="  flex flex-1  flex-col w-full md-lg:w-[85%] md-lg:flex-none h-full sm-md:h-[95%]    ">
      <AIChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {aimessages.map((message , i) => {
           
       


           const isUserSender = message.sender == "user" 
          //  console.log(i , " " ,message.senderId , authUser , authUser._id , "", isSender , authUser.firstName);
           return(
          <div
            key={message._id}
            className={`chat ${isUserSender ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >{
            console.log(authUser)
          }
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.sender == "user"
                      ? (authUser.profilePic ||'./avatar.png')
                      :  "./aiProfile.jpg" 
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
              {message.timestamp}
              </time>
            </div>
            <div className="chat-bubble flex flex-col break-words">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
           )
            })}
      </div>

      <AIChatInput />
    </div>
  );
};
export default AIChat;