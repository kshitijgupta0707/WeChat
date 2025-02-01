import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import VideoChat from "../pages/VideoChat";
import useGroupStore from "../store/useGroupStore.js";
import { useEffect, useState } from "react";


const GroupChatHeader = () => {
    const {selectedGroup, selectGroup} = useGroupStore()
      const { selectedUser, setSelectedUser } = useChatStore();
  const { authUser, onlineUsers , socket } = useAuthStore();
  const [members , setMembers] = useState("");
useEffect(()=>{
  
     
        let mem = ""
        for(let i = 0 ; i < selectedGroup.members.length ; i++){
           mem += selectedGroup.members[i].firstName + " ";
        }

        setMembers(mem);
        console.log(members);

},[selectedGroup])
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedGroup?.profilePic || "/avatar.png"} alt={selectedGroup?.name || "Group"} />


            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{
         
            selectedGroup.name}</h3>
            <h6 className=" font-light text-sm">{
               members.trim()
              }</h6>

          
          </div>
        </div>
        {/* Close button */}
        <div className="flex justify-center items-center" >

        {/* <VideoChat socket={socket} 
              userId={authUser._id}
              receiverId={selectedGroup._id} 
        />  */}
        <button onClick={() => selectGroup(null)}>
          <X />
        </button>
        </div>
      </div>
    </div>
  );
};
export default GroupChatHeader;
