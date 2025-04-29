import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import VideoChat from "../pages/VideoChat"; // Updated import path

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { authUser, onlineUsers, socket } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar with online indicator */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img 
                src={selectedUser.profilePic || "/avatar.png"} 
                alt={selectedUser.firstName} 
                className="w-full h-full object-cover"
              />
              {onlineUsers.includes(selectedUser._id) && (
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        
        {/* Actions buttons */}
        <div className="flex items-center gap-2">
          {/* Video call button */}
          <VideoChat 
            socket={socket} 
            userId={authUser._id}
            receiverId={selectedUser._id}
            selectedUser={selectedUser} // Pass selectedUser for the profile info
          />
          
          {/* Close chat button */}
          <button 
            onClick={() => setSelectedUser(null)} 
            className="p-2 hover:bg-base-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;