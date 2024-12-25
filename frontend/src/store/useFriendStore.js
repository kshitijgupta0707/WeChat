import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { set } from "mongoose";

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
      set({ messages: [...messages, res.data] });
    } catch (error) {
        toast.error(error.response.data.message);
    }
  
  },
  acceptFriendRequest: async(id)=>{
      try {
      console.log("Accepting the request ");
      const res = await axiosInstance.post(`/friends/acceptFriendRequest/${id}`);
      toast.success("Friend Request accepted Successfully");
      set({ messages: [...messages, res.data] });
    } catch (error) {
        toast.error(error.response.data.message);
    }
},
declineFriendRequest: async(id)=>{
    try {
        console.log("Declining the request ");
        const res = await axiosInstance.post(`/friends/declineFriendRequest/${id}`);
        toast.success("Friend Request Decline Successfully");
        set({ messages: [...messages, res.data] });
    } catch (error) {
        toast.error(error.response.data.message);
    }
   
}
 
}));
