import React, { useEffect, useState } from 'react'
import {MessageCircle , UserPlus, Users , Settings , UserRoundPen , LogOut, ChevronsRight, ChevronRight} from "lucide-react"
import Drawer from './Drawer';
import { useSideBarStore } from '../store/useSideBarStore';
import { Link } from 'react-router-dom';
import { useChatStore } from '../store/useChatStore';
import { useNotification } from '../store/useNotification';
function extremeSideBar() {

  const {showSideBar , toggleSideBar , openSideBar , closeSideBar , selectedScreen , setSelectedScreen } = useSideBarStore() 
  const {selectedUser , setSelectedUser} = useChatStore()

  const {isVisible , setIsVisible , message , showNotification} = useNotification()
  return (
    <aside className= {`h-full  w-[6rem]  items-center border-r border-base-300 flex flex-col transition-all duration-200 overflow-x-hidden `}>


    <Drawer/>        
    <div className="overflow-y-auto w-full h-full py-3 pt-0 flex flex-col   justify-between  ">
          


          


              <div>

        <button
        //   key={user._id}
          onClick={toggleSideBar}
          className={` 
            w-full p-5 flex items-center
            hover:bg-base-300 transition-colors
          ring-1 ring-base-300
           pb-7
           mb-1
          
          `}
          
        >
       <div className="relative mx-auto ">
       <ChevronRight size={32}/>

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
            w-full p-6 flex items-center ""
            hover:bg-base-300 transition-colors
            ${selectedScreen === "chats" ? "bg-base-300 ring-1 ring-base-300" : ""}
            tooltip
          `}
          data-tip="messages"
        >
       <div className="relative mx-auto  ">
            <MessageCircle  size={32} />
        </div> 

        </button>

        
     
        <button
        //   key={user._id}
          onClick={() => {setSelectedScreen("findFriends")

            setSelectedUser(null)
          }}
          className={`
            w-full p-6 flex items-center ""
            hover:bg-base-300 transition-colors
            ${selectedScreen === "findFriends" ? "bg-base-300 ring-1 ring-base-300" : ""}
            tooltip
          `}
          data-tip="Find friends"
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
          onClick={() => {setSelectedScreen("friendRequests")
          setSelectedUser(null)
        }}

          className={`
            w-full p-6 flex items-center 
            hover:bg-base-300 transition-colors
            tooltip
            ${selectedScreen === "friendRequests" ? "bg-base-300 ring-1 ring-base-300" : ""}
          `}
data-tip="Requests"
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
          onClick={() => {
            //yeh bs isliye kiya hain kyuki routeing se tum chlegye but home mein kuch ni khulega
            setSelectedScreen("profile")
            setSelectedUser(null)
          }}
          className={`
            w-full p-6 flex items-center ""
            hover:bg-base-300 transition-colors
            ${selectedScreen === "profile" ? "bg-base-300 ring-1 ring-base-300" : ""}

            tooltip 
           
          `}
           data-tip="Profile"
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
          onClick={() => {setSelectedScreen("settings")
          setSelectedUser("")
        }}
          className={`
            w-full p-6 flex items-center ""
            hover:bg-base-300 transition-colors
            ${selectedScreen === "settings" ? "bg-base-300 ring-1 ring-base-300" : ""}
            tooltip
          `}
          data-tip="Settings"
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

              </div>
        
       
        <button
        //   key={user._id}
          onClick={() => {setSelectedScreen("logout")
        
         showNotification("this is an notification")
          }
        }
          className={`
            tooltip
            w-full p-6 flex items-center
          
            hover:bg-base-300 transition-colors
            ${selectedScreen === "logout" ? "bg-base-300 ring-1 ring-base-300" : ""}
            
          `}
          data-tip= "Logout"
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

