import { useEffect, useState } from "react";
import { X, Loader2, CheckSquare, Square } from "lucide-react";
import { useFriendStore } from "../store/useFriendStore";
import { useAuthStore } from "../store/useAuthStore";
import useGroupStore from "../store/useGroupStore";

export default function GroupModal() {
    const {authUser} = useAuthStore();
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const {friends , getFriends} = useFriendStore()
  const {createGroup} = useGroupStore();
  useEffect(() => {
    getFriends();
  },[])   
  useEffect(() => {
    console.log("selected memebers" , selectedFriends);
  } , [selectedFriends])
  useEffect(() => {
    console.log ("name " , groupName);
  },[groupName])   
  const toggleFriendSelection = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  
    const groupCreateKro = (name , member , admin ) =>{
        if(!name || !member || !admin){
            return;
        }
        console.log("group create kro in modal")
        createGroup(name , member , admin);
        document.getElementById("close").click()
        // .click()
        
    }

  return (
    <dialog id="createGroupModal" className="modal p-0">
      <div className="modal-box p-6 w-[100%] md:w-[500px] shadow-lg rounded-lg flex flex-col gap-6">
        {/* Close Button */}
        <div className="modal-action relative m-0  ">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button  id="close" className="btn bg-none ">
        <X/>
        </button>
      </form>
    </div>

        {/* Group Name Input */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-lg">Group Name</label>
          <input
            type="text"
            placeholder="Enter group name..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Friends List */}
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto border p-3 rounded-md">
          <h3 className="font-bold text-lg">Select Friends</h3>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div
                key={friend._id}
                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => toggleFriendSelection(friend._id)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={friend.profilePic || "/avatar.png"}
                    className="w-10 h-10 rounded-full"
                    alt="Profile"
                  />
                  <span className="font-medium">{friend.firstName} {friend.lastName}</span>
                </div>
                {selectedFriends.includes(friend._id) ? (
                  <CheckSquare className="text-blue-500" />
                ) : (
                  <Square className="text-gray-400" />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No friends available</p>
          )}
        </div>

        {/* Create Group Button */}
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all border-0"
          onClick={() => groupCreateKro(groupName, selectedFriends , authUser._id)}
          disabled={false || groupName.trim() === "" || selectedFriends.length === 0}
        >
          {false ? <Loader2 className="h-5 w-5 animate-spin m-auto" /> : "Create Group"}
        </button>
      </div>
    </dialog>
  );
}
