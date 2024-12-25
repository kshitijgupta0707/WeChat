import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import ExtremeSideBar from "../components/ExtremeSideBar";
import FriendRequests from "../components/FriendRequests"
// import FindFriends from "../components/FindFriends";
import FindFriends from "../components/FindFriends";
import { useSideBarStore } from "../store/useSideBarStore";
import { useFriendStore } from "../store/useFriendStore";
const HomePage = () => {
  const { selectedUser } = useChatStore();
  const {authUser} = useAuthStore();
  const {selectedScreen} = useSideBarStore()
  const {friends} = useFriendStore()
  useEffect(()=>{
   console.log("You are at home page for the first time")
   console.log(authUser);
  },[])
  useEffect(()=>{
   console.log("Selected User is ", selectedUser)
  },[selectedUser])

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-[95%] h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <ExtremeSideBar/>
            
              { selectedScreen === "chats" ? (
                <Sidebar />
              ) : selectedScreen === "friendRequests" ? (
                <FriendRequests />
              ) : selectedScreen === "findFriends" ? (
                <FindFriends />
              ):<></>}
              
            
            { (selectedScreen == "chats" && selectedUser ) || ( selectedUser && friends && friends.some(friend => friend._id === selectedUser._id)) ? 
              <ChatContainer />:
              <NoChatSelected /> 
              }
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
