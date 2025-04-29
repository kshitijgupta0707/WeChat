import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import { deleteToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDvEv4jQ9JJXhhivKiikSHx71zjhp4byQw",
    authDomain: "zolo-e3745.firebaseapp.com",
    projectId: "zolo-e3745",
    storageBucket: "zolo-e3745.firebasestorage.app",
    messagingSenderId: "86285220324",
    appId: "1:86285220324:web:a94c77dfd1dba49a166ff1",
    measurementId: "G-2T5Q6MRVM1"
  };
// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);
// Explicitly register the service worker
if ('serviceWorker' in navigator) {
  console.log("At firebase.js file")
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((err) => {
      console.log('Service Worker registration failed:', err);
    });
}

export {app , analytics  };
export{messaging, getToken, onMessage , deleteToken}
//this will be used for google , facebook etc login-------->
export const auth = getAuth(app)
export const db = getFirestore()