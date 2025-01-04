import { create } from "zustand";

// Zustand store for managing notifications
export const useNotification = create((set) => ({
  // Initial state
  isVisible: false,
  message: "",

  // Function to set visibility
  setIsVisible: (visibility) => set({ isVisible: visibility }),

  // Function to set the notification message
  setMessage: (message) => set({ message }),

  // Function to trigger notification
  showNotification: (text) => {
    set({ message: text, isVisible: true }); // Set the message and make it visible
    // Hide the notification after 2 seconds
    setTimeout(() => {
      set({ isVisible: false });
    }, 4000);
  },
}));
