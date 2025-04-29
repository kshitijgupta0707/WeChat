
// src/utils/requestPermission.js

import { messaging, getToken } from "../firebase";
import { axiosInstance } from "../lib/axios";


// If permission granted, you generate an FCM token 
// Once token is generated, you send this token to your backend 
export const requestNotificationPermission = async (authUser) => {
  try {
    
    console.log("At request notification function");
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      let fcmToken = localStorage.getItem("fcmToken");
      if (!fcmToken) {
        fcmToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_VAPID_KEY,
        });

        if (fcmToken) {
          localStorage.setItem("fcmToken", fcmToken);
        }
      }
      console.log("Permission granted");
      if (fcmToken) {

        console.log("Generated the FCM Token:", fcmToken);

        if (authUser?._id) {
          await axiosInstance.post("/notification/save-token", {
            userId: authUser._id,
            token: fcmToken,
          });

          console.log("🎯 Token saved to DB");
        } else {
          console.warn("⚠️ No authenticated user found");
        }
      } else {
        console.warn("⚠️ Failed to get FCM token");
      }
    } else {
      console.warn("❌ Notification permission denied");
    }
  } catch (error) {
    console.error("❌ Error getting permission/token:", error);
  }
};