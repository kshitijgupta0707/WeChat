import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useSideBarStore } from "./useSideBarStore";
import { useChatStore } from "./useChatStore";
import { useNotification } from "./useNotification";
export const useFriendStore = create((set, get) => ({
  friends: [],
  friendRequests: [],
  isFriendsLoading: false,
  isFriendRequestsLoading: false,
  beMyFriends: localStorage.getItem("beMyFriends") ||[],
 
  //i am storing in local storage jin jin ko mne request bheji hain
  
  //basic function
  getFriends: async () => {
    console.log("i am called")
    set({ isFriendsLoading: true });
    try {
      const res = await axiosInstance.get("/friends/getAllFriends");
      console.log("Response get from the backjed to frontend " , res.data )
      set({ friends: res.data.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isFriendsLoading: false });
    }
  },
  setFriends: async(friends) =>{
    set(friends)
  },
  getFriendRequests: async () => {
    set({ isFriendRequestsLoading: true });
    try {
      const res = await axiosInstance.get("/friends/getAllFriendRequests");
      set({ friendRequests: res.data.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isFriendRequestsLoading: false });
    }
  },
 //after sending request I am updating the local storage
  sendFriendRequest: async(id)=>{
    try {
        console.log("Sending the request ");
        const res = await axiosInstance.post(`/friends/sendFriendRequest/${id}`);
       

        // Now update in local storage about the request to make the add friend button disable
        //id agyii jinko tune request bhej rakhhi  hain
        const {beMyFriends} = get()
        const newBeMyFriends = [...beMyFriends , id];
        localStorage.setItem("beMyFriends", newBeMyFriends);
        set({ beMyFriends: newBeMyFriends });    
        toast.success("Friend Request sent Successfully");
    } catch (error) {
        toast.error(error.response.data.message);
    }
  
  },


  //functions to accept and dcline request and update the friend Request accordingly
  acceptFriendRequest: async(id)=>{
      try {
      console.log("Accepting the request ");
      const {friendRequests} = get()
      const res = await axiosInstance.post(`/friends/acceptFriendRequest/${id}`);
     
      // i am doing this to update ui in real time
      console.log("Requests are - ", friendRequests);
      const updatedRequests = friendRequests.filter((user) => user._id!== id)
     
      console.log("Updated Requests are - ", updatedRequests);
      set({friendRequests: updatedRequests})

      toast.success("Friend Request accepted Successfully");
    } catch (error) {
        toast.error(error.response.data.message);
    }
},
   declineFriendRequest: async(id)=>{
    try {
        console.log("Declining the request ");
        const {friendRequests} = get()
        const res = await axiosInstance.post(`/friends/declineFriendRequest/${id}`);

        // i am doing this to update ui in real time
        console.log("Requests are - ", friendRequests);
        const updatedRequests = friendRequests.filter((user) => user._id!== id)
       
        console.log("Updated Requests are - ", updatedRequests);
        set({friendRequests: updatedRequests})
        toast.success("Friend Request Decline Successfully");
    } catch (error) {
        toast.error(error.response.data.message);
    }
   
}

//RealTime Functionality goes here
,
subscribeToFriendRequests: (socket) => {
  console.log("subscribed to Friend Request is called");
  const selectedScreen = useSideBarStore.getState().selectedScreen;
  
  // Access the showNotification function from the notification store
  const { showNotification } = useNotification.getState();
  
  socket.on("newFriendRequest", (data) => {
   console.log(data)
    console.log("Friend Request Recieved")
    // Show the notification
    console.log(data.name)
    console.log(data.friendRequests)
    showNotification(`You have a new friend request from ${data.name} !`);
    if (selectedScreen != "friendRequests") return;
    set({
      friendRequests: data.friendRequests
    });
    console.log("new friend request data = " , data.friendRequests)
  });
},

unSubscribeToFriendRequests: (socket) => {
     socket.off("newFriendRequest");
},

subscribeToMessageReciever: () =>{
  const socket = useAuthStore.getState().socket
  socket.on("newMessage", (data) => {
  const senderId = data.message.senderId;
  const text = data.message.text;
  const {friends} = get()
  const filteredSender = friends.filter(item => item._id === senderId);
    filteredSender[0].lastMessage = text
    filteredSender[0].unseenCount++
// Filter out the rest of the objects (not matching senderId)
  const restOfTheArray = friends.filter(item => item._id !== senderId);

// Concatenate the filteredSender object at the front of the rest of the array
  const sortedArray = [ , ...filteredSender,...restOfTheArray ];

  //jisne bheja hainmessage i have his id so bring that at top
   set({friends: sortedArray}) 
  });
},

unSubscribeToMessageReciever: () => {
  const socket = useAuthStore.getState().socket
  socket.off("newMessage");
},



subscribeToFriends: (socket) => {
  console.log("subscribed to Friends is called");
  const selectedScreen = useSideBarStore.getState().selectedScreen;
  const { showNotification } = useNotification.getState();
    
   socket.on("newFriend", (data) => {

    const{beMyFriends} = get()
     const newBeMyFriends = beMyFriends.filter((id) => id !== data.personWhoHasAccepted)
     localStorage.setItem("beMyFriends", newBeMyFriends)
     set({beMyFriends: newBeMyFriends})
    console.log("Friend Request accetpted by " , data.name);
    showNotification(`Your friend request has accepted by ${data.name} `)
    if (selectedScreen != "chats") return;
    set({
      friends: data.updatedFriends
    });
    console.log("new friends data = " , friendRequests)
  });
},



unSubscribeToFriends: (socket) => {
     socket.off("newFriend");
},

 
}));
