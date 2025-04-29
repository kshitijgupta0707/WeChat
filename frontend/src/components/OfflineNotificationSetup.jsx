import { useEffect, useRef } from "react";
import { requestNotificationPermission } from "../lib/RequestPermission";
import { useAuthStore } from "../store/useAuthstore";
import { onMessage, messaging } from "../firebase"

const OfflineNotificationSetup = () => {
  const { authUser } = useAuthStore();
  const permissionRequested = useRef(false); // new addition

  useEffect(() => {
    if (authUser && !permissionRequested.current) {
      console.log("Requesting notification permission from OfflineNotificationSetup...");
      requestNotificationPermission(authUser);
      permissionRequested.current = true; // Mark as requested
    }
  }, [authUser]);



  return null;
};

export default OfflineNotificationSetup;