import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useNotification } from "./useNotification";
import { useFriendStore } from "./useFriendStore";

export const useAIStore = create((set, get) => ({
  aimessages: [],
  isAIMessagesLoading: false,
  isAIMessagesSending: false,
  getAIChat: async () => {
    set({ isAIMessagesLoading: true });
    try {
      console.log("i am at get ai chat")
      const res = await axiosInstance.get("/getAllChats");
      console.log("response is ", res)
      set({ aimessages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isAIMessagesLoading: false });
    }
  },
  sendMessageToAi: async (data) => {
    const { aimessages } = get();
    set({ isAIMessagesSending: true });

    try {
      const res = await axiosInstance.post("/aichat/message", data);
      toast.success("Message sent Successfully");
      //update in the chat to show
      //on friends
       const {aimessages} = get()
       const chats = res.data.chat.messages
      set({ aimessages: [...chats] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally{
      set({ isAIMessagesSending: false });

    }
  },
}));
