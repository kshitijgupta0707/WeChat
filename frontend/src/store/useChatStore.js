import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useNotification } from "./useNotification";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  setUsers: async(filteredUser) =>{
    set({ users: filteredUser });
  },
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    console.log(selectedUser)
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      toast.success("Message sent Successfully");
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  subscribeToMessages: (socket) => {
    console.log("subscribed to message called");
    const { selectedUser } = get();
    const { showNotification } = useNotification.getState();
    
    
    socket.on("newMessage", (data) => {
      console.log("Message Recieved")
      console.log("recieved notification")
      showNotification(`New Message from ${data.name}`)
      
      if (!selectedUser) return;
      const isMessageSentFromSelectedUser = data.message.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      set({
        messages: [...get().messages, data.message],
      });
    });
  },
  unsubscribeFromMessages: (socket) => {
    console.log("subscriber tomessage unsubcribe")
    socket.off("newMessage");
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  setMessagesAsSeen: async(id)=>{
    try {
      console.log("Marking messages as seen of " , id);
      const res = await axiosInstance.post(`/messages/markMessageAsSeen/${id}`);
      toast.success("Message seen updated");
    } catch (error) {
      toast.error(error.response.data.message);
  }
  }
}));
