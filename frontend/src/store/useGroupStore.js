import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const useGroupStore = create((set, get) => ({
  groups: [],
  selectedGroup: null,
  groupMessages: [],
  isgroupMessagesLoading: false,
  isFetchingGroup: false,

  // Fetch all groups for the logged-in user
  fetchGroups: async (userId) => {
    // console.log("fetching the groups")
    try {
      set({ isFetchingGroup: true });
      const res = await axiosInstance.get(`/groups/user/${userId}`);
      set({ groups: res.data });
      console.log("store ", res.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      set({ isFetchingGroup: false });
    }
    finally {
      set({ isFetchingGroup: false });

    }
  },

  // Create a new group
  createGroup: async (name, members, admin) => {
    try {
      const res = await axiosInstance.post("/groups/create", { name, members, admin });
      set((state) => ({ groups: [...state.groups, res.data] }));
      console.log("Returned by the backend to create group")
      console.log(res.data);
      console.log("Group created successfully ", res.data);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  },

  // Select a group to chat in
  setSelectedGroupAsNull: () => {
    set({ selectedGroup: null })
  },

  selectGroup(groupId) {
    if (groupId == null) { return; }
    console.log("selected a group is called in a store")
    //  console.log(groupId)
    const { groups } = get()
    const group = groups.find((g) => g._id === groupId);
    if (group) {
      set({ selectedGroup: group })
    }
    console.log("i am setting this as selected group ", group);
  }
  ,

  getGroupMessages: async (group) => {

    set({ isgroupMessagesLoading: true })

    if (group == null) {
      return;
    }


    // Fetch messages for the selected group
    try {
      const res = await axiosInstance.get(`/groups/messages/${group}`);
      set({ groupMessages: res.data });

    } catch (error) {
      console.error("Error fetching messages:", error);
    }
    finally {
      set({ isgroupMessagesLoading: false })
    }

  },

  // Send a message in the selected group
  sendMessageInGroup: async ({ senderId, text, image }) => {
    const groupId = get().selectedGroup?._id;
    if (!groupId || !text) return;

    try {
      const res = await axiosInstance.post("/groups/message/send", { senderId, groupId, text, image });

      // Update the message list in real-time
      // set({messages: [...messages, res.data]});
      set((state) => ({ groupMessages: [...state.groupMessages, res.data] }));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  // Clear selected group (optional for UI reset)
  clearSelectedGroup: () => set({ selectedGroup: null, messages: [] }),
}));

export default useGroupStore;
