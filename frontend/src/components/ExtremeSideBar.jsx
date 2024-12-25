import React, { useEffect, useState } from 'react'
import {MessageCircle , UserPlus, Users , Settings , UserRoundPen , LogOut, ChevronsRight} from "lucide-react"
import Drawer from './Drawer';
import { useSideBarStore } from '../store/useSideBarStore';
import { Link } from 'react-router-dom';
function extremeSideBar() {

  const {showSideBar , toggleSideBar , openSideBar , closeSideBar , selectedScreen , setSelectedScreen } = useSideBarStore() 
 


  return (
    <aside className= {`h-full  w-[5rem]  items-center border-r border-base-300 flex flex-col transition-all duration-200 `}>


    <Drawer/>        
    <div className="overflow-y-auto w-full py-3 pt-0 flex flex-col gap-5  ">
      

        <button
        //   key={user._id}
          onClick={toggleSideBar}
          className={` 
            bg-red-600
            w-full p-5 flex items-center ""
            hover:bg-base-300 transition-colors
          bg-base-300 ring-1 ring-base-300 
          `}
        >
       <div className="relative mx-auto ">
       <ChevronsRight size={32}/>

        </div> 

          {/* User info - only visible on larger screens */}
          <div className="hidden lg:block text-left min-w-0">
            {/* <div className="font-medium truncate">Messages</div> */}
          </div>
        </button>


        <button
        //   key={user._id}
          onClick={() => setSelectedScreen("chats")}
          className={`
            w-full p-3 flex items-center ""
            hover:bg-base-300 transition-colors
            ${selectedScreen === "chats" ? "bg-base-300 ring-1 ring-base-300" : ""}
          `}
        >
       <div className="relative mx-auto  ">
            <MessageCircle  size={32} />
        </div> 

          {/* User info - only visible on larger screens */}
          <div className="hidden lg:block text-left min-w-0">
            {/* <div className="font-medium truncate">Messages</div> */}
          </div>
        </button>

        
     
        <button
        //   key={user._id}
          onClick={() => setSelectedScreen("findFriends")}
          className={`
            w-full p-3 flex items-center ""
            hover:bg-base-300 transition-colors
            ${selectedScreen === "findFriends" ? "bg-base-300 ring-1 ring-base-300" : ""}
          `}
        >
       <div className="relative mx-auto">
            {/* <img
              src={user.profilePic || "/avatar.png"}
              alt={user.name}
              className="size-12 object-cover rounded-full"
            /> */}
            <Users size={32} />
        </div> 

          {/* User info - only visible on larger screens */}
          <div className="hidden lg:block text-left min-w-0">
            {/* <div className="font-medium truncate">Find Friends</div> */}
          </div>
        </button>

   
        <button
        //   key={user._id}
          onClick={() => setSelectedScreen("friendRequests")}
          className={`
            w-full p-3 flex items-center 
            hover:bg-base-300 transition-colors
            ${selectedScreen === "friendRequests" ? "bg-base-300 ring-1 ring-base-300" : ""}
          `}
        >
       <div className="relative mx-auto">
            {/* <img
              src={user.profilePic || "/avatar.png"}
              alt={user.name}
              className="size-12 object-cover rounded-full"
            /> */}
            <UserPlus size={32} />
        </div> 

          {/* User info - only visible on larger screens */}
          <div className="hidden lg:block text-left min-w-0">
            {/* <div className="font-medium truncate">Friend Requests</div> */}
          </div>
        </button>



    <Link to="/profile" >
        <button
        //   key={user._id}
          onClick={() => 
            //yeh bs isliye kiya hain kyuki routeing se tum chlegye but home mein kuch ni khulega
            setSelectedScreen("profile")
          }
          className={`
            w-full p-3 flex items-center ""
            hover:bg-base-300 transition-colors
            ${selectedScreen === "profile" ? "bg-base-300 ring-1 ring-base-300" : ""}
          `}
        >
       <div className="relative mx-auto ">
            {/* <img
              src={user.profilePic || "/avatar.png"}
              alt={user.name}
              className="size-12 object-cover rounded-full"
            /> */}
            <UserRoundPen size={32} />
        </div> 

          {/* User info - only visible on larger screens */}
          <div className="hidden lg:block text-left min-w-0">
            {/* <div className="font-medium truncate">Profile</div> */}
          </div>
        </button>
    </Link>
      
        <Link to="/settings">
        <button
        //   key={user._id}
          onClick={() => setSelectedScreen("settings")}
          className={`
            w-full p-3 flex items-center ""
            hover:bg-base-300 transition-colors
            ${selectedScreen === "settings" ? "bg-base-300 ring-1 ring-base-300" : ""}
          `}
        >
       <div className="relative mx-auto ">
            {/* <img
              src={user.profilePic || "/avatar.png"}
              alt={user.name}
              className="size-12 object-cover rounded-full"
            /> */}
            <Settings size={32} />
        </div> 

          {/* User info - only visible on larger screens */}
          <div className="hidden lg:block text-left min-w-0">
            {/* <div className="font-medium truncate">Settings</div> */}
          </div>
        </button>
                
        </Link>



        <button
        //   key={user._id}
          onClick={() => setSelectedScreen("logout")}
          className={`
            w-full p-3 flex items-center
          
            hover:bg-base-300 transition-colors
            ${selectedScreen === "logout" ? "bg-base-300 ring-1 ring-base-300" : ""}
            
          `}
        >
       <div className="relative mx-auto ">
            {/* <img
              src={user.profilePic || "/avatar.png"}
              alt={user.name}
              className="size-12 object-cover rounded-full"
            /> */}
            <LogOut size={32} />
        </div> 

          {/* User info - only visible on larger screens */}
          <div className="hidden lg:block text-left min-w-0">
            {/* <div className="font-medium truncate">Logout</div> */}
          </div>
        </button>
    </div>
        
      
    
  </aside>
  )
}

export default extremeSideBar

