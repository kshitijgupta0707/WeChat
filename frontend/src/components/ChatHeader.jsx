import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import VideoChat from "../pages/VideoChat";


const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { authUser, onlineUsers , socket } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.firstName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.firstName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        {/* Close button */}
        <div className="flex justify-center items-center" >

        <VideoChat socket={socket} 
              userId={authUser._id}
              receiverId={selectedUser._id} 
        /> 
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
