import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import useGroupStore from "../store/useGroupStore.js";
import { useFriendStore } from "../store/useFriendStore.js";
import GroupModal from "./GroupModal.jsx";
const GroupSidebar = () => {
  const { groups, selectedGroup, isFetchingGroup, fetchGroups, selectGroup } = useGroupStore();
  const { authUser } = useAuthStore();
  const {friends} = useFriendStore();
  const [search, setSearch] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);

  // Fetch groups when component mounts
  useEffect(() => {
    if (authUser?._id) {
      fetchGroups(authUser._id);
    }
  }, [fetchGroups, authUser]);

  // Update filtered groups whenever `groups` changes
  useEffect(() => {
    setFilteredGroups(groups);
  }, [groups]);

  const handleOnSearch = (e) => {
    e.preventDefault();
    setFilteredGroups(groups.filter((group) => group.name.toLowerCase().startsWith(search.toLowerCase())));
  };

  if (isFetchingGroup) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full md:w-[27rem] border-r border-base-300 flex flex-col transition-all duration-200 ">
      <GroupModal/>
      <div className="border-b border-base-300 w-full p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-2 justify-between">
          <div className="flex gap-2 justify-center ">
          <Users className="size-6" />
          <span className="font-medium lg:block ">Groups</span>
          </div>
          <button className="btn btn-outline" onClick={()=>{
            document.getElementById('createGroupModal').showModal() 
          }} >Create</button>
        </div>

        <form className="m-auto w-[95%]" onSubmit={handleOnSearch}>
          <label className="input input-bordered flex items-center gap-5 h-10">
            <input
              type="text"
              className="grow w-[10px] h-4"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </label>
        </form>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredGroups.map((group) => (
          <button
            key={group._id}
            onClick={() => selectGroup(group._id)}
            className="w-full p-3 flex justify-between items-center gap-3 hover:bg-base-300 transition-colors"
          >
            <div className="flex gap-3 items-center">
              <div className="relative mx-auto lg:mx-0 pl-1 pr-1">
                <img src={group.profilePic || "/avatar.png"} alt={group.name} className="size-14 object-cover rounded-full" />
              </div>

              <div className="lg:block text-left min-w-0">
                <div className="font-medium truncate">{group.name}</div>
                <div className="text-sm text-zinc-400"></div>
                <div className="text-sm text-zinc-400"></div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default GroupSidebar;
