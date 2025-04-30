import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full lg:w-[27rem] border-r border-base-300 
      flex flex-col transition-all duration-200"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <div className="skeleton h-4   w-[13rem] mb-2 rounded" /> {/* Name */}
              <div className="skeleton h-3  w-[32rem] sm:w-[20rem]  rounded" />       {/* Message text */}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
