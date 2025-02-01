import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import GroupChatHeader from "./GroupChatHeader.jsx"
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { useFriendStore } from "../store/useFriendStore";
import GroupMessageInput from "./GroupMessageInput.jsx";
import useGroupStore from "../store/useGroupStore";


const GroupChatContainer = () => {
    const {groupMessages , getGroupMessages
        ,isgroupMessagesLoading,
        selectedGroup
     } = useGroupStore();
 
  const { authUser,socket } = useAuthStore();
  const messageEndRef = useRef(null);
   
 
  useEffect(() => {
    if (selectedGroup&& authUser) {
      // console.log("selectedGroup" , selectedGroup);
      
      getGroupMessages(selectedGroup._id);
    }
  },
   [selectedGroup._id, getGroupMessages]
  );
  useEffect(() => {
    if (messageEndRef.current && groupMessages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages]);

  if (isgroupMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <GroupChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  if (!authUser  || !selectedGroup || isgroupMessagesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="  flex flex-1  flex-col w-full md-lg:w-1/2 md-lg:flex-none ">
      <GroupChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groupMessages.map((message , i) => {
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

      <GroupMessageInput />
    </div>
  );
};
export default GroupChatContainer;