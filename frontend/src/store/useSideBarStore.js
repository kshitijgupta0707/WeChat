import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

// screen -> chats , openSideBar , findFriends , friendRequests , settings , profile , logout
export const useSideBarStore = create((set, get) => ({
  showSideBar: false,
  selectedScreen: "chats",

  toggleSideBar: async() =>{
    const {showSideBar} = get();
    set({ showSideBar: 
        !showSideBar
     });
  },
  closeSideBar: async() =>{
    const {showSideBar} = get();
    if(showSideBar){
        set({ showSideBar:false});
    }
  },
  openSideBar: async() =>{
    const {showSideBar} = get();
    if(!showSideBar){
        set({ showSideBar: true  });
    }}
,
  setSelectedScreen: async(screen) =>{
    const {selectedScreen} = get();
    console.log(screen)
    set({
        selectedScreen: screen
    })
  }
   
}));
