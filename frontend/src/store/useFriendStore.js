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
    set({ isFriendsLoading: true });
    try {
      const res = await axiosInstance.get("/friends/getAllFriends");
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
      const {friendRequests} = get()
      const res = await axiosInstance.post(`/friends/acceptFriendRequest/${id}`);
     
      // i am doing this to update ui in real time
      const updatedRequests = friendRequests.filter((user) => user._id!== id)
     
      set({friendRequests: updatedRequests})

      toast.success("Friend Request accepted Successfully");
    } catch (error) {
        toast.error(error.response.data.message);
    }
},
   declineFriendRequest: async(id)=>{
    try {
        const {friendRequests} = get()
        const res = await axiosInstance.post(`/friends/declineFriendRequest/${id}`);

        // i am doing this to update ui in real time
        const updatedRequests = friendRequests.filter((user) => user._id!== id)
       
        set({friendRequests: updatedRequests})
        toast.success("Friend Request Decline Successfully");
    } catch (error) {
        toast.error(error.response.data.message);
    }
   
}

//RealTime Functionality goes here
,
subscribeToFriendRequests: (socket) => {
  if(!socket) {
    return
  }
  const selectedScreen = useSideBarStore.getState().selectedScreen;
  
  // Access the showNotification function from the notification store
  const { showNotification } = useNotification.getState();
  
  socket.on("newFriendRequest", (data) => {
    // Show the notification
    showNotification(`You have a new friend request from ${data.name} !`);
    if (selectedScreen != "friendRequests") return;
    set({
      friendRequests: data.friendRequests
    });
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
  const sortedArray = [  ...filteredSender,...restOfTheArray ];

  //jisne bheja hainmessage i have his id so bring that at top
   set({friends: sortedArray}) 
  });
},

unSubscribeToMessageReciever: () => {
  const socket = useAuthStore.getState().socket
  socket.off("newMessage");
},



subscribeToFriends: (socket) => {
  if(!socket) {
    return
  }
  const selectedScreen = useSideBarStore.getState().selectedScreen;
  const { showNotification } = useNotification.getState();
    
   socket.on("newFriend", (data) => {
     showNotification(`Your friend request has accepted by ${data.name} `)
    const{beMyFriends} = get()
     const newBeMyFriends = beMyFriends.filter((id) => id !== data.personWhoHasAccepted)
     localStorage.setItem("beMyFriends", newBeMyFriends)
     set({beMyFriends: newBeMyFriends})
    if (selectedScreen != "chats") return;
    set({
      friends: data.updatedFriends
    });
  });
},


unSubscribeToFriends: (socket) => {
     socket.off("newFriend");
},

 
}));
