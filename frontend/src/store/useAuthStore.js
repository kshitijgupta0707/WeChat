import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";



const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSendingOtp: false ,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  //when you refresh the page check ki loggin in hain?
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  
  checkAuth: async () => {
    try {
      console.log("check auth function in the store get called");
      const res = await axiosInstance.get("/auth/check");
      console.log(res);
      set({ authUser: res.data });
        get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  sendOtp: async (data , navigate) => {

   
    set({ isSendingOtp: true });
    try {
      const res1 = await axiosInstance.post("/auth/sendotp" , data)
      console.log("Mail has send successfully to your account check kro")
      // const res = await axiosInstance.post("/auth/signup", data);
      // //so that the user get authenticated soon after the signup
      toast.success("Otp Send on mail");  
      set({ isSendingOtp: false });
      setTimeout(() => {
        // Use React Router's navigate function to redirect and pass state
        navigate("/otp", { state: { formData: data } });
      }, 2000); // Adjust delay as needed
      // get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSendingOtp: false });
     
    }
  },
  signup: async (data , navigate) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      //so that the user get authenticated soon after the signup
      // set({ authUser: res.data });
      toast.success("Account created successfully");  
      set({ isSigningUp: false });
      setTimeout(() => {
        // Use React Router's navigate function to redirect and pass state
        navigate("/login");
      }, 2000); // Adjust delay as needed
      // get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });

    }
  },
  

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      console.log("I have loggin to the id :" , res.data)
      set({ authUser: res.data.responseUser });
      toast.success("Logged in successfully ");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      console.log("In update profile ")
      console.log(data);


      const formData = new FormData();
      formData.append("profilePic", data.profilePic); // `somefile` should be the file object


      //now profilePic can be accessed directly by like formData in the request
      const res = await axiosInstance.put("/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

    connectSocket: () => {
      const { authUser } = get();
      //alreadyConnected or not autheticated - not do it
      if (!authUser || get().socket?.connected) return;

      const socket = io(BASE_URL,{
        // i am sending some data to the backend 
        // sending the userId to know who is online
        query: {
          userId: authUser._id,
          userName: authUser.firstName
        },
      }
    );
    //connection established by the user with io so it give notification to the backend 
    //and you have written what to do now in backend
      socket.connect();

      set({ socket: socket });

      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    },
    disconnectSocket: () => {
      console.log("disconnect socket from front end called")
      if (get().socket?.connected) get().socket.disconnect();
    },
}));
