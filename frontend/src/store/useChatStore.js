import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useNotification } from "./useNotification";
import { useFriendStore } from "./useFriendStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  setUsers: async (filteredUser) => {
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
    try {

      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      toast.success("Message sent Successfully");
      //update in the chat to show
      //on friends
      const { messages } = get()
      console.log("purane messages", messages)
      const newMessages = [...messages, res.data]
      console.log("nayeMessages", newMessages);
      // const {friends , setFriends} = useFriendStore().getState()
      console.log("Message updated", newMessages)

      set({ messages: newMessages });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  //get notification about only message in real time
    showMessageNotification: (socket) => {
      const { showNotification } = useNotification.getState();

      socket.on("newMessage", (data) => {
        showNotification(`You recieved a new Message from ${data.name}`)
      });
    },
  dontShowMessageNotification: (socket) => {
    socket.off("newMessage");
  },
  //Below two function are just to show real time messaging between two persons (messages update of paticular user)
  subscribeToMessages: (socket) => {
    const { selectedUser } = get();
    socket.on("newMessage", (data) => {

      if (!selectedUser) return;
      const isMessageSentFromSelectedUser = data.message.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      set({
        messages: [...get().messages, data.message],
      });
    });
  },
  unsubscribeFromMessages: (socket) => {
    socket.off("newMessage");
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  // tell backend that messages are seened
  setMessagesAsSeen: async (id) => {
    try {
      const res = await axiosInstance.post(`/messages/markMessageAsSeen/${id}`);

      //refresh friends here

    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));
