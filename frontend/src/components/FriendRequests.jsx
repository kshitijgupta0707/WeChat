import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users , Loader2 , X , ThumbsUp , ThumbsDown } from "lucide-react";
import extremeSideBar from "./ExtremeSideBar";
import Button from '@mui/material/Button';
import { useFriendStore } from "../store/useFriendStore";
const FriendRequests = () => {
    const { getUsers, users, setUsers, selectedUser, setSelectedUser, isUsersLoading , showMessageNotification , dontShowMessageNotification } = useChatStore();
    const { friends, friendRequests, isFriendRequestsLoading, isFriendsLoading, getFriendRequests, getFriends,
        acceptFriendRequest,
        declineFriendRequest,
        subscribeToFriendRequests,
        unSubscribeToFriendRequests
    } = useFriendStore()
    const { onlineUsers , socket , authUser} = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false)
    const [search, setSearch] = useState("")
    const [searchedUser, setsearchedUser] = useState([])
   

    //only for updating the status - otherwise no use
    const [acceptingRequests, setAcceptingRequests] = useState({});  // Track accepting status for each user
    const [decliningRequests, setDecliningRequests] = useState({});  // Track declining status for each user

    const handleAcceptRequest = (userId) => {
        setAcceptingRequests((prev) => ({ ...prev, [userId]: true }));
        
        acceptFriendRequest(userId).finally(() => {
            setAcceptingRequests((prev) => ({ ...prev, [userId]: false }));
        });
    }

    const handleDeclineRequest = (userId) => {
        setDecliningRequests((prev) => ({ ...prev, [userId]: true }));
        declineFriendRequest(userId).finally(() => {
            setDecliningRequests((prev) => ({ ...prev, [userId]: false }));
        });
    }
    const handleOnSearch = (e) => {
        e.preventDefault()
        console.log("handle on submit called")
        console.log(users)
        // asynchronous hota hain toh it take time
        setsearchedUser(users.filter((user) => (user.firstName.startsWith(search))))
        setSearch("")
        // console.log("Users are " , filteredUsers)
    }
    useEffect(() => {
        console.log("Filtered users (updated state): ", filteredUsers);
        setUsers(searchedUser)
    }, [searchedUser]);

    useEffect(() => {
        console.log("called function get freinds")
        getFriendRequests();
    }, [getFriendRequests]);


   //real time show yehi krra hain
    useEffect(() => {
        // console.log("selected user is " ,selectedUser.firstName);
        // console.log("sender is" ,authUser.firstName);
        if ( authUser) {
            getFriendRequests();
            subscribeToFriendRequests(socket);
            console.log("called by friend request page")
        }
        //2 times CALLING
        //CLEARING EVENT LISTENER
        return () => unSubscribeToFriendRequests(socket);
      },
       [getFriendRequests, subscribeToFriendRequests, unSubscribeToFriendRequests]
      );
    
      useEffect(() => {
        showMessageNotification(socket)
          return () => 
            {
     
              dontShowMessageNotification(socket)
    
            }
        },
        [
          showMessageNotification,
          dontShowMessageNotification
        ]
        );





    const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user._id))
  : users;

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-full  md:w-[27rem]  border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium ">Friend Requests</span>
                </div>

            </div>

            <div className="overflow-y-auto w-full py-3 ">
                {friendRequests.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            flex justify-between`}
                    >
                        <div className="flex justify-center items-center gap-2" >

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
                            <div className="text-left min-w-0">
                                <div className="font-medium truncate">{user.firstName}</div>
                                <div className="text-sm text-zinc-400">
                                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3" >

                            <button 
                             onClick={()=>{
                                handleAcceptRequest(user._id);
                             }}
                            className="btn bg-primary/40 rounded-2xl hover:bg-primary/15   ">
                                {acceptingRequests[user._id] ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        accepting
                                    </>
                                ) : (
                                    <>
                                    <span  >
                                    <ThumbsUp/>
                                    </span>
                                
    
                                    </>
                                )}
                              
                            </button>
                            <button 
                              onClick={()=>{
                                handleDeclineRequest(user._id);
                             }}
                            className="btn btn-outline rounded-2xl border-0 btn-neutral bg-primary/10 hover:bg-primary/15 ">
                            {decliningRequests[user._id] ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        declining
                                    </>
                                ) : <>
                              <span className="" >
                              <ThumbsDown/>
                                    </span>
                               
                                </>
                                }
                              
                                
                                </button>

                        </div>



                    </button>
                ))}

                {friendRequests.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No Friend Requests</div>
                )}
            </div>
        </aside>
    );
};
export default FriendRequests;