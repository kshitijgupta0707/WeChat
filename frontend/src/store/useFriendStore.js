import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { set } from "mongoose";
import { useSideBarStore } from "./useSideBarStore";
import { useChatStore } from "./useChatStore";
import { useNotification } from "./useNotification";
export const useFriendStore = create((set, get) => ({
  friends: [],
  friendRequests: [],
  isFriendsLoading: false,
  isFriendRequestsLoading: false,

   
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
  sendFriendRequest: async(id)=>{
    try {
        console.log("Sending the request ");
        const res = await axiosInstance.post(`/friends/sendFriendRequest/${id}`);
        toast.success("Friend Request sent Successfully");
    } catch (error) {
        toast.error(error.response.data.message);
    }
  
  },
  acceptFriendRequest: async(id)=>{
      try {
      console.log("Accepting the request ");
      const res = await axiosInstance.post(`/friends/acceptFriendRequest/${id}`);
      toast.success("Friend Request accepted Successfully");
    } catch (error) {
        toast.error(error.response.data.message);
    }
},
declineFriendRequest: async(id)=>{
    try {
        console.log("Declining the request ");
        const res = await axiosInstance.post(`/friends/declineFriendRequest/${id}`);
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
    console.log("new friend request data = " , friendRequests)
  });
},

unSubscribeToFriendRequests: (socket) => {
     socket.off("newFriendRequest");
},

subscribeToMessageReciever: () =>{
  console.log("subsciber for reciever called");
  const socket = useAuthStore.getState().socket
  socket.on("newMessage", (data) => {
  console.log("Message Recieved")
   console.log(data)
  const senderId = data.message.senderId;
  const text = data.message.text;
  console.log("message recieved by ", senderId)
  console.log(" text Recieved = " , text)
  const {friends} = get()
  const filteredSender = friends.filter(item => item._id === senderId);
    filteredSender[0].lastMessage = text
    filteredSender[0].unseenCount++
// Filter out the rest of the objects (not matching senderId)
  const restOfTheArray = friends.filter(item => item._id !== senderId);

// Concatenate the filteredSender object at the front of the rest of the array
  const sortedArray = [ , ...filteredSender,...restOfTheArray ];

  //jisne bheja hainmessage i have his id so bring that at top
   console.log("i have setted the friends ");
   console.log(sortedArray)
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
