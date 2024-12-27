import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser,socket } = useAuthStore();
  const messageEndRef = useRef(null);

  

  
  useEffect(() => {
    if (selectedUser&& authUser) {
      getMessages(selectedUser._id);
      subscribeToMessages(socket);
    }
    //2 times CALLING
    //CLEARING EVENT LISTENER
    return () => unsubscribeFromMessages(socket);
  },
   [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]
  );




  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  if (!authUser  || !selectedUser || isMessagesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="  flex flex-1  flex-col w-full md-lg:w-1/2 md-lg:flex-none ">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message , i) => {
           const isSender = message.senderId == authUser._id

          //  console.log(i , " " ,message.senderId , authUser , authUser._id , "", isSender , authUser.firstName);
           return(
          <div
            key={message._id}
            className={`chat ${isSender ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
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

      <MessageInput />
    </div>
  );
};
export default ChatContainer;