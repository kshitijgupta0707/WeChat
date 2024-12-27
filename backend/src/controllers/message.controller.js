import { User } from "../models/user.model.js";
import Message from "../models/message.model.js";

import { connectCloudinary } from "../config/cloudinary.js";
import cloudinary from "cloudinary"
import { getReceiverSocketId, io } from "../config/socket.js";
       

//fetch all th user except yourself for the side bar 
export const getUsersForSidebar = async (req, res) => {
  try {
    console.log("Backend : GetUsersForSidebar function called")
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
//i want the messages between 2 users in chronological order one by one 
export const getMessages = async (req, res) => {
  try {
    //fetching the id jinke message chiye and renaming it
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
   
     
     //fetching all the message where either (sender id is mine and reciever id is his) || (reciever id is mine and sendeer id is his)
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
     console.log("i am at sendMessge controller in backend")
     const { text, image } = req.body;
     const { id: receiverId } = req.params;
  
    const senderId = req.user._id;
      console.log("Sender name is " , req.user.firstName)
    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
      


    await newMessage.save();
      
    // real time functionality goes here we will do it afterwards
  

 


    const receiverSocketId = getReceiverSocketId(receiverId);
    
   //send in real time if the user is online
    if (receiverSocketId) {

      //only send to particular client
      io.to(receiverSocketId).emit("newMessage", { message: newMessage , name: req.user.firstName});
      console.log("Notified to front end ")
    }
    else{
      console.log("i am not sending")
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesAsSeen = async (req , res) => {
try{
  const userId = req.user._id;
  const {id: friendId} = req.params;
  if(friendId && userId){
    const messges = await Message.updateMany(
      {
        senderId: friendId,  // Messages sent by the friend
        receiverId: userId,  // Received by the user
        isSeen: false        // Only unseen messages
      },
      {
        $set: { isSeen: true } // Mark them as seen
      }
    );

    res.status(200).json({
      success: true,
      message: "All messages seened"
    })
  }else{
    res.status(404).json({
      success: false,
      message: "Provide the sender and reciever id "
    })
  }
}
catch(e){
  console.log(e);
  console.log("Eror in mark message as seen");
}
};