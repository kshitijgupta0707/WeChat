import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import Sidebar from "../components/Sidebar";
// Array of pre-defined photos
const predefinedPhotos = [
  "./avatar/1.jpg","./avatar/2.jpg","./avatar/3.jpg",
  "./avatar/4.jpg","./avatar/5.jpg","./avatar/6.jpg","./avatar/7.jpg",
  "./avatar/8.jpg","./avatar/9.jpg"
];

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const handleImageUpload = async (e) => {

    // grabs the first file selected by the user.
    const file = e.target.files[0];
    console.log("file", file)
    // console.log(e);
    // console.log(e.target);
    // console.log(e.target.files[0]);

    if (!file) return;
    // FileReader API:
    // FileReader is a web API to read file contents.
    // reader.readAsDataURL(file) converts the file into a Base64-encoded string.
    // Why Base64? It simplifies image previews in a browser without needing a server.
    // How Base64 Works for Images
    // Encoding: The binary data of the image (e.g., raw bytes of a JPEG) is encoded into a text string using the Base64 algorithm. This makes it safe to include in text-based formats.
    // Decoding: When a browser or tool encounters this string, it decodes it back into binary data to render the image.
    // For small, infrequently accessed images, Base64 in MongoDB might work.
    // For larger or performance-critical applications, use a cloud storage service.
    // Converting an image to Base64 increases its size by ~33%. This larger size leads to higher bandwidth usage during uploads and slower processing times.
    const reader = new FileReader();

    reader.readAsDataURL(file);
    // reader.onload is triggered when file reading is complete.
    reader.onload = async () => {
      const base64Image = reader.result;
      //so that image get shown in circle immediately
      await updateProfile({ profilePic: file });
      setSelectedImg(base64Image);
    };
  };
  const handlePredefinedPhotoSelect = async (photo) => {
    // photo = photo.slice(8)
    // const newPhoto = './' + photo
    setSelectedImg(photo); // Update UI immediately
    await updateProfile({ profilePic: photo }); // Send the selected photo to the backend
  };

  return (
    <div className=" pt-20">
      <div className=" max-w-2xl  md:max-w-3xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">

          {/* starting  */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section here */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                {/* onChange fires when the user selects a file from their system. */}
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo or choose an avatar"}
            </p>
          </div>

        
              {/* Predefined photo selection */}
              <div className="space-y-4">


               <div className="flex justify-center gap-1 md:gap-2 avatarScreen:flex-wrap ">
                 {predefinedPhotos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Avatar ${index + 1}`}
                    className={` w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 cursor-pointer  
                      ${selectedImg === photo ? "border-green-500" : "border-gray-300"}`}
                    onClick={() => handlePredefinedPhotoSelect(photo)}
                  />
                </div>
              ))}
               </div>



             </div>
    
      
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{`${authUser?.firstName.charAt(0).toUpperCase() + authUser.firstName.slice(1)} ${authUser.lastName ? authUser.lastName: ""} `}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
