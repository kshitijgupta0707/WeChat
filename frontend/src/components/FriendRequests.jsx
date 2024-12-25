import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users , Loader2 } from "lucide-react";
import extremeSideBar from "./ExtremeSideBar";
import Button from '@mui/material/Button';
import { useFriendStore } from "../store/useFriendStore";
const FriendRequests = () => {
    const { getUsers, users, setUsers, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const { friends, friendRequests, isFriendRequestsLoading, isFriendsLoading, getFriendRequests, getFriends,
        acceptFriendRequest,
        declineFriendRequest,
    } = useFriendStore()
    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false)
    const [search, setSearch] = useState("")
    const [searchedUser, setsearchedUser] = useState([])

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

    const filteredUsers = showOnlineOnly
        ? users.filter((user) => onlineUsers.includes(user._id))
        : users;

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full  lg:w-[27rem]  border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Friend Requests</span>
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
                            <div className="hidden lg:block text-left min-w-0">
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
                            className="btn bg-blue-600 rounded-2xl hover:bg-blue-500  ">
                                {acceptingRequests[user._id] ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        accepting
                                    </>
                                ) : (
                                    <>
                                    Confirm
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    </>
                                )}
                              
                            </button>
                            <button 
                              onClick={()=>{
                                handleDeclineRequest(user._id);
                             }}
                            className="btn btn-outline rounded-2xl border-0 btn-neutral bg-[#121212] ">
                            {decliningRequests[user._id] ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        declining
                                    </>
                                ) : (
                               "Decline"
                                )}
                              
                                
                                </button>

                        </div>



                    </button>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No Friend Requests</div>
                )}
            </div>
        </aside>
    );
};
export default FriendRequests;