import React, { useEffect, useState } from 'react'
import {
  MessageCircle, UserPlus, Users, Settings, UserRoundPen, LogOut, ChevronsRight, ChevronRight,
  Circle, Squircle
} from "lucide-react"
import Drawer from './Drawer';
import { useSideBarStore } from '../store/useSideBarStore';
import { Link } from 'react-router-dom';
import { useChatStore } from '../store/useChatStore';
import { useNotification } from '../store/useNotification';
import Lottie from "react-lottie"
import { HiUserGroup } from "react-icons/hi";
import {
  Mail,
  UserSearch,
  BrainCircuit,
  UserCheck,
  UsersRound,
} from "lucide-react";
function extremeSideBar() {



  const { showSideBar, toggleSideBar, openSideBar, closeSideBar, selectedScreen, setSelectedScreen } = useSideBarStore()
  const { selectedUser, setSelectedUser } = useChatStore()

  const { isVisible, setIsVisible, message, showNotification } = useNotification()
  return (
    <aside className={`h-full  w-[6rem]  border-r border-base-300 flex flex-col   transition-all duration-200 overflow-x-hidden overflow-y-hidden`}>


      <Drawer />
      <div className="overflow-y-auto w-full h-full  pt-0 flex flex-col   justify-between   ">

        <div className='' >

          <button
            //   key={user._id}
            onClick={toggleSideBar}
            className={` 
            w-full p-5 flex items-center
            hover:bg-base-300 transition-colors
          ring-1 ring-base-300
           pb-3
           mb-1
          
          `}

          >
            <div className="relative mx-auto ">
              <ChevronRight size={32} />

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
            w-full p-3 sm:p-6 flex items-center ""
            hover:bg-base-300 transition-colors
            ${selectedScreen === "chats" ? "bg-base-300 ring-1 ring-base-300" : ""}
            tooltip
          `}
            data-tip="messages"
          >
            <div className="relative mx-auto  ">
              <MessageCircle size={32} />
            </div>

          </button>
          <button
            //   key={user._id}
            onClick={() => setSelectedScreen("groupchats")}
            className={`
            w-full p-3 sm:p-6 flex items-center ""
            hover:bg-base-300 transition-colors
            ${selectedScreen === "groupchats" ? "bg-base-300 ring-1 ring-base-300" : ""}
            tooltip
          `}
            data-tip="group"
          >
            <div className="relative mx-auto p-0 m-0  ">
              <UsersRound size={32} />


            </div>

          </button>

          <button
            //   key={user._id}
            onClick={() => {
              setSelectedScreen("chatWithAi")
              setSelectedUser(null)
            }}
            className={`
            w-full  sm:p-6 flex items-center justify-center m-auto
            hover:bg-base-300 transition-colors
            ${selectedScreen === "chatWithAi" ? "bg-base-300 ring-1 ring-base-300" : ""}
            tooltip
          `}
            data-tip="Chat with AI"
          >
            <div className="relative mx-auto ">

              <Circle className='w-8 h-8 animate-ping focus:animate-none absolute  text-primary' />
              <Circle className='w-8 h-8 text-primary' />


              {/* <Lottie options={defaultOptions} height={60} width={60} /> */}
              {/* <img src="./chatbot.png" className='  rounded-full'  /> */}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              {/* <div className="font-medium truncate">Find Friends</div> */}
            </div>
          </button>

          <button
            //   key={user._id}
            onClick={() => {
              setSelectedScreen("findFriends")

              setSelectedUser(null)
            }}
            className={`
            w-full p-3 sm:p-6 flex items-center ""
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
              <UserSearch size={32} />
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              {/* <div className="font-medium truncate">Find Friends</div> */}
            </div>
          </button>



          <button
            //   key={user._id}
            onClick={() => {
              setSelectedScreen("friendRequests")
              setSelectedUser(null)
            }}

            className={`
            w-full p-3 sm:p-6 flex items-center 
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






        </div>


        <button
          //   key={user._id}
          onClick={() => {
            setSelectedScreen("logout")

            showNotification("this is an notification")
          }
          }
          className={`
            tooltip
            w-full p-3 sm:p-6 flex items-center
          
            hover:bg-base-300 transition-colors
            ${selectedScreen === "logout" ? "bg-base-300 ring-1 ring-base-300" : ""}
            hidden
            
          `}
          data-tip="Logout"
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

