import { MessageSquare } from "lucide-react";
import { useFriendStore } from "../store/useFriendStore";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
const NoChatSelected = () => {
  const { subscribeToFriends, unSubscribeToFriends, subscribeToFriendRequests, unSubscribeToFriendRequests, subscribeToMessageReciever, unSubscribeToMessageReciever } = useFriendStore()
  const { selectedUser, subscribeToMessages, unsubscribeFromMessages, showMessageNotification, dontShowMessageNotification } = useChatStore();
  const { authUser, socket } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      subscribeToFriendRequests(socket);
      subscribeToFriends(socket)
      showMessageNotification(socket)
      subscribeToMessageReciever();
    }
    //2 times CALLING
    //CLEARING EVENT LISTENER
    return () => {
      unSubscribeToFriendRequests(socket)
      subscribeToFriends(socket)
      dontShowMessageNotification(socket)
      unSubscribeToMessageReciever()
    }
  },
    [
      authUser,                 // Dependency on the authentication status
      subscribeToFriendRequests,
      unSubscribeToFriendRequests,
      subscribeToFriends,
      unSubscribeToFriends,
      subscribeToMessageReciever,
      unSubscribeToMessageReciever,
      socket,      // Dependency on the socket instance,
      showMessageNotification,
      dontShowMessageNotification
    ])
  return (
    <div className="w-full hidden  md:flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>



        <h2 className=" text-2xl font-bold flex justify-center items-center">Welcome to zolo !!!</h2>

        <p className=" hidden lg:block text-base-content/60 text-wrap ">
          Where Every Conversation Becomes a Moment. Choose a friend and start chatting.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
