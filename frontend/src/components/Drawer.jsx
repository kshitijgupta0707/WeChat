import React from 'react';
import { MessageCircle, UserPlus, Users, Settings, UserRoundPen, LogOut } from "lucide-react";
import { useSideBarStore } from '../store/useSideBarStore';

function Drawer() {
  const { 
    showSideBar, 
    toggleSideBar, 
    closeSideBar, 
    openSideBar, 
    selectedScreen, 
    setSelectedScreen 
  } = useSideBarStore();

  const handleScreenChange = (screen) => {
    setSelectedScreen(screen); // Update the selected screen
    closeSideBar(); // Close the sidebar
  };

  return (
    <div className="drawer z-50 ">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={showSideBar} readOnly />
      <div className="drawer-side">
        <label 
          htmlFor="my-drawer" 
          aria-label="close sidebar" 
          className="drawer-overlay" 
          onClick={closeSideBar}
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 text-center flex flex-col">
          {/* Sidebar content here */}
         
          <li>
            <button
              onClick={() => handleScreenChange("chats")}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedScreen === "chats" ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative  lg:mx-0">
                <MessageCircle />
              </div>
              <div className=" lg:block text-left min-w-0">
                <div className="font-medium truncate">Messages</div>
              </div>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScreenChange("friendRequests")}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedScreen === "friendRequests" ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative  lg:mx-0">
                <UserPlus />
              </div>
              <div className=" lg:block text-left min-w-0">
                <div className="font-medium truncate">Friend Requests</div>
              </div>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScreenChange("findFriends")}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedScreen === "findFriends" ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative  lg:mx-0">
                <Users />
              </div>
              <div className=" lg:block text-left min-w-0">
                <div className="font-medium truncate">Find Friends</div>
              </div>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScreenChange("settings")}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedScreen === "settings" ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative  lg:mx-0">
                <Settings />
              </div>
              <div className=" lg:block text-left min-w-0">
                <div className="font-medium truncate">Settings</div>
              </div>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScreenChange("profile")}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedScreen === "profile" ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative  lg:mx-0">
                <UserRoundPen />
              </div>
              <div className=" lg:block text-left min-w-0">
                <div className="font-medium truncate">Profile</div>
              </div>
            </button>
          </li>
          <li className='  items-end justify-end content-end   ' >
            <button
              onClick={() => handleScreenChange("logout")}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedScreen === "logout" ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative  lg:mx-0">
                <LogOut />
              </div>
              <div className=" lg:block text-left min-w-0">
                <div className="font-medium truncate">Logout</div>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Drawer;
