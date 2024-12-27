import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ConciergeBell, LogOut, MessageSquare, Settings, User , Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useState , useEffect} from "react";
import { useLocation } from "react-router-dom";
import { useSideBarStore } from "../store/useSideBarStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { users , setUsers } = useChatStore();
  const {toggleSideBar} = useSideBarStore()  
  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex justify-between w-[95%] m-auto" >
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <button onClick={toggleSideBar} >
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>

              </button>
                <h1 className=" text-lg font-bold">Textify</h1>
              </Link>
             




            </div>
            <div className="flex items-center gap-2" >
            </div>
            <div className="flex items-center gap-2 ">
           




            <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

              <Link
                to={"/settings"}
                className={`
              btn btn-sm gap-2 transition-colors
              addFriend:hidden
              `}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              {authUser && (
                <>
              
                  <button className="flex gap-2 items-center" onClick={logout}>
                    <LogOut className="size-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
