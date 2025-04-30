
import Navbar from "./components/Navbar"
import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import OtpPage from "./pages/OtpPage"
import { Navigate } from "react-router-dom"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"
import ExtremeSideBar from "./components/ExtremeSideBar"
import { useAuthStore } from "./store/useAuthStore"
import { useThemeStore } from "./store/useThemeStore"
import { useEffect } from "react"
import { useState } from "react"
import { useNotification } from "./store/useNotification"
import GroupModal from "./components/GroupModal"
import GroupSidebar from "./components/GroupSidebar"
import OfflineNotificationSetup from "./components/OfflineNotificationSetup"
import "./App.css"
const App = () => {



  const { isVisible, setIsVisible, message } = useNotification()

  const { authUser, checkAuth, isCheckingAuth, onlineUsers, socket } = useAuthStore()
  const { theme, setTheme } = useThemeStore()
  useEffect(() => {
    console.log("onlineUsers : ", onlineUsers)
  }, [onlineUsers])
  //when the appliation start it is called
  useEffect(() => {
    console.log("i am checking that you are authenticated or not")
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );





  return (
    <div data-theme={theme} className=" flex flex-col  self-center content-center "  >
      <OfflineNotificationSetup/>
      <Navbar />  
      {isVisible && (
        <div className="z-50 fixed left-[50%] -translate-x-1/2 w-[400px]  lg:w-[600px]">
          <div role="alert" className="  alert shadow-lg flex justify-between">

            <div className="flex align-center justify-center items-center gap-3" >
              <div  >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-info h-6 w-6 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>

              </div>
              <div>
                <h3 className="font-bold hidden sm:block ">Notification</h3>
                <div className="text-xs">{message}</div>
              </div>

            </div>
            <button className=" hidden sm:block  btn btn-sm" onClick={() => setIsVisible(false)}>
              Close
            </button>
          </div>

          <div className="relative w-full h-1">
            <div className="absolute bottom-0 left-0 h-[2px] animate-progress-bar"></div>
          </div>


        </div>
      )}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/otp" element={authUser ? <HomePage /> : <OtpPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App