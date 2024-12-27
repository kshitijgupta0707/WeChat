import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import ExtremeSideBar from "../components/ExtremeSideBar";
import BottomBar from "../components/BottomBar";
import FriendRequests from "../components/FriendRequests"
// import FindFriends from "../components/FindFriends";
import FindFriends from "../components/FindFriends";
import { useSideBarStore } from "../store/useSideBarStore";
import { useFriendStore } from "../store/useFriendStore";
import { useState } from "react";
const HomePage = () => {
  
  const { selectedUser  , subscribeToMessages , unsubscribeFromMessages , showMessageNotification , dontShowMessageNotification} = useChatStore();
  const {authUser,socket} = useAuthStore();
  const {selectedScreen} = useSideBarStore()
  const {friends , subscribeToFriends , unSubscribeToFriends ,subscribeToFriendRequests , unSubscribeToFriendRequests , subscribeToMessageReciever ,unSubscribeToMessageReciever} = useFriendStore()
  const [toggleModeOn, setToggleModeOn] = useState(false); 
  const [showBottomBar , setShowBottomBar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setToggleModeOn(window.innerWidth <= 768); 
      setShowBottomBar(window.innerWidth <=  768)
        };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check on load
    return () => window.removeEventListener('resize', handleResize); 
  }, []);

  useEffect(() => {
    if ( authUser) {
        subscribeToFriendRequests(socket);
        subscribeToFriends(socket)
        showMessageNotification(socket)
        subscribeToMessageReciever();
    }
    //2 times CALLING
    //CLEARING EVENT LISTENER
    return () => 
      {
        unSubscribeToFriendRequests(socket)
        subscribeToFriends(socket)
        dontShowMessageNotification(socket)
        unSubscribeToMessageReciever()
      }
  },
  [
    authUser,                 // Dependency on the authentication status
    subscribeToFriendRequests,
    unSubscribeToFriendRequests,
    subscribeToFriends,
    unSubscribeToFriends,
    subscribeToMessageReciever,
    unSubscribeToMessageReciever,
    socket              ,      // Dependency on the socket instance,
    showMessageNotification,
    dontShowMessageNotification
]
  );
   
 


  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-[100%] h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
        { !showBottomBar ?
        <ExtremeSideBar/>
        :
        selectedScreen != "chats" || !selectedUser ?
        <BottomBar/>:
        ""
      }


      {toggleModeOn && selectedScreen && (
             selectedScreen === "friendRequests" ? <FriendRequests />
            : selectedScreen === "findFriends" ? <FindFriends />
            : (selectedScreen === "chats" && selectedUser && friends && friends.some(friend => friend._id === selectedUser._id) ? <ChatContainer/> : <Sidebar/> ) 
       )
      }

        { !toggleModeOn && (
               selectedScreen === "chats" ? (
                <Sidebar />
              ) : selectedScreen === "friendRequests" ? (
                <FriendRequests />
              ) : selectedScreen === "findFriends" ? (
                <FindFriends />
              ):<></>)
        }
          
            {!toggleModeOn && (selectedScreen == "chats" && selectedUser && friends.some(friend => friend._id === selectedUser._id))  ? 
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