import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import extremeSideBar from "./ExtremeSideBar";
import { useFriendStore } from "../store/useFriendStore";

const Sidebar = () => {
  const { getUsers, users, setUsers, selectedUser, setSelectedUser, isUsersLoading , showMessageNotification , dontShowMessageNotification   } = useChatStore();
      const {friends , friendRequests , isFriendRequestsLoading , isFriendsLoading , getFriendRequests , getFriends
        ,subscribeToFriends , unSubscribeToFriends,
        subscribeToMessageReciever,
        unSubscribeToMessageReciever
      } = useFriendStore()

  const {subscribeToMessages , unsubscribeFromMessages

    ,setMessagesAsSeen
  } = useChatStore()
  
  const { onlineUsers , socket , authUser } = useAuthStore();
  const [friendsOnline , setFriendsOnline] = useState([]);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const [search , setSearch] = useState("")
  const [filteredFriends , setfilteredFriends] = useState(friends)
 
  const handleOnSearch = (e) =>{
     e.preventDefault()
   // asynchronous hota hain toh it take time
   setfilteredFriends(friends.filter((user) => (user.firstName.startsWith(search))))
    setSearch("")
  }
  const handleOnOnlineToggle= (e) =>{
    e.preventDefault()
  // asynchronous hota hain toh it take time
  setfilteredFriends(friends.filter((user) => (user.firstName.startsWith(search))))
   setSearch("")
 }
  useEffect(()=>{
    if(showOnlineOnly){
      setfilteredFriends(friends.filter((user) => onlineUsers.includes(user._id)))
    }
    else{
      setfilteredFriends(friends)
    }
  } , [showOnlineOnly])

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  useEffect(() => {
    // console.log("selected user is " ,selectedUser.firstName);
    // console.log("sender is" ,authUser.firstName);
    if ( authUser) {
        getFriends();
        subscribeToFriends(socket);
        subscribeToMessageReciever();
        showMessageNotification(socket)
        // subscribeToMessages()
    }
    //2 times CALLING
    //CLEARING EVENT LISTENER
    return () => {
      unSubscribeToFriends(socket);
      unSubscribeToMessageReciever()
      dontShowMessageNotification(socket)
    }
  },
   [getFriends, subscribeToFriends, unSubscribeToFriends , subscribeToMessages
     , unsubscribeFromMessages,
     subscribeToMessageReciever,
     unSubscribeToMessageReciever,
     showMessageNotification,
     dontShowMessageNotification
   ]
  );


  useEffect(() =>{
    if (selectedUser) {
      setfilteredFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend._id === selectedUser._id
            ? { ...friend, unseenCount: 0 } // Mark selected user's chats as seen
            : friend
        )
      );
    }
  },[selectedUser])




  useEffect(()=>{
     setfilteredFriends(friends)
  } , [friends ])


  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full  md:w-[27rem]  border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5 flex flex-col">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium  lg:block">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-3  flex items-center gap-2 mb-4">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({         onlineUsers.length - 1} online)</span>
        </div>
         <form className="   m-auto w-[95%]"   onSubmit={handleOnSearch} >
              <label className="input input-bordered flex items-center gap-5 h-10 ">
                <input type="text"
                 className="grow w-[10px] h-4" 
                 placeholder="Search"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 />
                 <button type="submit">
                   <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd" />
                  </svg>
                 </button>
              </label>
       </form>
      </div>

      <div className="overflow-y-auto w-full py-3 ">
        {filteredFriends.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user)
              setMessagesAsSeen(user._id)
            }}
            className={`
              w-full p-3 flex justify-between
                items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="flex gap-3 items-center" >
            <div className="relative mx-auto lg:mx-0 pl-1 pr-1 ">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className=" size-14 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div> 

            {/* User info - only visible on larger screens */}
            <div className=" lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.firstName} 
                {/* <span className=" ml-2  text-sm text-zinc-400" >
                 ({onlineUsers.includes(user._id) ? "Online" : "Offline"}) 

                </span>
                 */}
                 </div>
              <div className="text-sm text-zinc-400">
                {/* {onlineUsers.includes(user._id) ? "Online" : "Offline"} */}
              </div>
              <div className="text-sm text-zinc-400" >
              {user.lastMessage && user.lastMessage.length >40  ?
              user.lastMessage.substring(0, 40) + ".....":
              user.lastMessage ?
              user.lastMessage:
              "No messages "}
              </div>
            </div>
            </div>
            
            {
                user.unseenCount &&   user.unseenCount > 0 ? user.unseenCount
                : ""
            } 
            {/* {user.unseenCount} */}
          </button>
        ))}

        {filteredFriends.length === 0 && showOnlineOnly && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
        {filteredFriends.length === 0 && !showOnlineOnly && (
          <div className="text-center text-zinc-500 py-4">No Friends</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;

