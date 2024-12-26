import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { set } from "mongoose";
import { useSideBarStore } from "./useSideBarStore";

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
  if (selectedScreen != "friendRequests") return;


  socket.on("newFriendRequest", (data) => {
    // console.log("this is w")
    console.log("Message Recieved")
    set({
      friendRequests: data
    });
    console.log("new friend request data = " , friendRequests)
  });
},

unSubscribeToFriendRequests: (socket) => {
     socket.off("newFriendRequest");
},

subscribeToFriends: (socket) => {
  console.log("subscribed to Friends is called");
  const selectedScreen = useSideBarStore.getState().selectedScreen;
  if (selectedScreen != "chats") return;


  socket.on("newFriend", (data) => {
    console.log("Message Recieved")
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
