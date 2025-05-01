

//step 1 Create an instance of the Google provider object 
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
//this have all the configuration
import { auth } from "@/firebase";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";


export const SignInWithGoogle = ({name = "Login with Google"}) => {
  const { loginwithOAuth } = useAuthStore();

  async function googleLogin() {
    const provider = new GoogleAuthProvider();
     // This gives you a Google Access Token. You can use it to access the Google API.
     try {
       // it shares thde compleete info in result.user
       const result = await signInWithPopup(auth, provider); 
       //  const credential = GoogleAuthProvider.credentialFromResult(result);
       //  const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;

      console.log("user = ", user);
      console.log("calling o auth")
      console.log("user = ",user.displayName)
      
      
      //now i got that person is verified so i am sending his email to my backend for login
      if (user) {
        await loginwithOAuth({ email: user.email , name: user.displayName });
        // toast.success("Signed in successfully!");
      }
    } catch (error) {
      toast.error("Sign in failed. Please try again.");
      console.error("Google sign in error:", error);
    }
  }

  return (
    <div className=" w-full mb-2 flex flex-col items-center">
     
      
      <button
        onClick={googleLogin}
        className="flex items-center  justify-center gap-3 w-full  py-3 px-4 bg-white text-gray-700 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-[15px]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span className="font-medium"> {`${name}`}</span>
      </button>
    </div>
  );
};