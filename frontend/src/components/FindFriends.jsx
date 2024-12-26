import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users , Loader2 } from "lucide-react";
import extremeSideBar from "./ExtremeSideBar";
import Button from '@mui/material/Button';
import { useFriendStore } from "../store/useFriendStore";
const FindFriends = () => {
    const {authUser} = useAuthStore()
    const { getUsers, users, setUsers, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const {friends , friendRequests , isFriendRequestsLoading , isFriendsLoading , getFriendRequests , getFriends,
      sendFriendRequest ,
    } = useFriendStore()
    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    const [search, setSearch] = useState("")
    const [filteredUsers , setfilteredUsers] = useState(users)
    function getRandomNumber() {
        return Math.floor(Math.random() * 500) + 1;
      }
      
      // Example usage
      console.log(getRandomNumber());
      

    const handleOnSearch = (e) => {
        e.preventDefault()
        // asynchronous hota hain toh it take time
        setfilteredUsers(users.filter((user) => (user.firstName.startsWith(search))))
        setSearch("")
        // console.log("Users are " , filteredUsers)
    }
    // useEffect(() => {
    //     console.log("Filtered users (updated state): ", filteredUsers);
    //     setUsers(searchedUser)
    // }, [searchedUser]);

    useEffect(() => {
        getUsers();
        getFriends();
    }, [getUsers , getFriends]);

    useEffect(() => {
      setfilteredUsers(users)
    } , [users])
    

    const [isSendingRequest , setIsSendingRequest] = useState(false) 
   
     const handleSendRequest = async(id) =>{
      
      setIsSendingRequest(true)
        sendFriendRequest(id).finally(() => {
          setIsSendingRequest(false);
    });
    

     }

   // Create a Set from the friends' ids for faster lookup
   const friendIds = new Set(friends.map(friend => friend._id));
  //  friendIds.has(userId);  big of 1 mein return
    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full  lg:w-[27rem]  border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Find a Friend</span>
                </div>
                
                <form onSubmit={handleOnSearch} className=" mt-3" >
              <label className="input input-bordered flex items-center gap-5 h-9 max-w-[230px]">
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
                {filteredUsers.map((user) => (
                    
                    <button
                        key={user._id}
                        onClick={() => {
                            setSelectedUser(user)
                            document.getElementById(user._id).showModal()                       
                        }}
                        className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            flex justify-between`}
                    >  
                       
                        
                         
                

                  {/* //dialogue box */}
                  <dialog id={user._id} className="modal p-0 ">
  <div className="modal-box p-0 ">
  <div className="flex flex-col items-center shadow-lg rounded-lg p-6 w-[500px] gap-4 m-auto ">
  {/* Profile Section */}
  <div className="flex justify-between items-center w-full">
    {/* Profile Picture */}
    <div>
      <img src={user.profilePic || "/avatar.png"} className="rounded-full w-[100px] h-[100px]" alt="Profile" />
      <span className="font-bold text-lg mt-2">{user.firstName+ " " + user.lastName}</span>
    </div>
    {/* Stats Section */}
    <div className="flex gap-6">
      {/* Posts */}
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg">25</span>
        <span className=" text-gray-500 text-sm">Posts</span>
      </div>

      {/* Followers */}
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg">201</span>
        <span className="text-gray-500 text-sm">Followers</span>
      </div>

      {/* Following */}
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg">40</span>
        <span className="text-gray-500 text-sm">Following</span>
      </div>
    </div>
  </div>

  {/* Bio Section */}
  <div className=" items-start">
    <p className="text-sm">Hey there, I am using a Textify App!</p>
  </div>

  {/* Action Button */}
  <div className="w-full">
    <button
     
     onClick={
      () =>{
        handleSendRequest(user._id)
      }
     }
    
    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all border-0 ">
       {isSendingRequest ? (
                                        <Loader2 className="h-5 w-5 animate-spin m-auto " />
                                                                        ) : (
                                  "Add Friend"
                                )}
    </button>
  </div>
</div>

                        

    
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>















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

                            {friends.some(friend => friend._id === user._id)    && ( <button className="btn bg-blue-600 rounded-2xl hover:bg-blue-500  ">
                                Send Message
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
                            </button>
                            )}

                        </div>



                    </button>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No online users</div>
                )}
            </div>
        </aside>
    );
};
export default FindFriends;