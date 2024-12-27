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
import { useState } from "react";
const HomePage = () => {
  const { selectedUser  , subscribeToMessages , unsubscribeFromMessages} = useChatStore();
  const {authUser,socket} = useAuthStore();
  const {selectedScreen} = useSideBarStore()
  const {friends , subscribeToFriends , unSubscribeToFriends ,subscribeToFriendRequests , unSubscribeToFriendRequests } = useFriendStore()
  const [toggleModeOn, setToggleModeOn] = useState(false); 
  

  useEffect(() => {
    const handleResize = () => {
      setToggleModeOn(window.innerWidth <= 768); 
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check on load
    return () => window.removeEventListener('resize', handleResize); 
  }, []);

  useEffect(()=>{
   console.log("You are at home page for the first time")
   console.log(authUser);
  },[])
  useEffect(()=>{
   console.log("Selected User is ", selectedUser)
  },[selectedUser])
  
  useEffect(() => {

    if ( authUser) {
        subscribeToFriendRequests(socket);
        subscribeToFriends(socket)
    }
    //2 times CALLING
    //CLEARING EVENT LISTENER
    return () => 
      {
        unSubscribeToFriendRequests(socket)
        subscribeToFriends(socket)
      }
  },
   [subscribeToFriendRequests, unSubscribeToFriendRequests , subscribeToFriends , unSubscribeToFriends]
  );
   
  useEffect(() => {
   if (authUser) {
      subscribeToMessages(socket);
    }
    //2 times CALLING
    //CLEARING EVENT LISTENER
    // return () => unsubscribeFromMessages(socket);
  },
   [ subscribeToMessages, unsubscribeFromMessages]
  );


  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-[100%] h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <ExtremeSideBar/>


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