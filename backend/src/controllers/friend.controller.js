import { User } from '../models/user.model.js';
import dotenv from "dotenv"
dotenv.config()
import { getReceiverSocketId , io } from '../config/socket.js';
export const getAllFriends = async (req, res) => {
    try {
      // Fetch the requesting user's ID from the authenticated request
      const userId = req.user._id;
        
      // Find the user to whom the friend request is being sent
      const fetchedUser = await User.findOne({ _id: userId }).select("-password").populate("friends");
      if (!fetchedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    console.log("backend : All friends succesffuly send ")
      return res.status(200).json({
        success: true,
        message: "all friends are fetched",
        data: fetchedUser.friends,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Friend request not sent. Please try again later.",
      });
    }
  };

export const getAllFriendRequests = async (req, res) => {
    try {
      // Fetch the requesting user's ID from the authenticated request
      const userId = req.user._id;
        
      // Find the user to whom the friend request is being sent
      const fetchedUser = await User.findOne({ _id: userId }).select("-password").populate("friendRequests");
      console.log("fetched user = ", fetchedUser);
      if (!fetchedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      console.log("fetched User is",fetchedUser)

      return res.status(200).json({
        success: true,
        message: "all friends are fetched",
        data: fetchedUser.friendRequests,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Friend request not sent. Please try again later.",
      });
    }
  };

  export const sendFriendRequest = async (req, res) => {
    try {
      // Fetch the friend's ID from the request parameters
      const { id: friendId } = req.params;
      // Fetch the requesting user's ID from the authenticated request
      const userId = req.user._id;
  
      // Find the user to whom the friend request is being sent
      const fetchedUser = await User.findOne({ _id: friendId }).select("-password");
  
      if (!fetchedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
  
      // Check if the friend request has already been sent
      if (fetchedUser.friendRequests.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "Request was already sent to the person",
        });
      }
  
      // If already friends
      if (fetchedUser.friends.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "You are already friends",
        });
      }
  
      // Update the `friendRequests` array by adding the requesting user's ID
      const updatedUser = await User.findByIdAndUpdate(
        friendId,
        { $push: { friendRequests: userId } },
        { new: true } // This option returns the updated document
      ).select("-password").populate("friendRequests");
  
      if (!updatedUser) {
        return res.status(500).json({
          success: false,
          message: "Error updating friend requests",
        });
      }
  
      // real-time functionality: send in real time if the user is online
      const receiverSocketId = getReceiverSocketId(friendId);
  
      // Send in real-time if the user is online
      if (receiverSocketId) {
        console.log("this is what I am sending to the client:");
        console.log(updatedUser.friendRequests);
        io.to(receiverSocketId).emit("newFriendRequest", updatedUser.friendRequests);
        console.log("Notified the front end about the friend request");
      }
  
      return res.status(200).json({
        success: true,
        message: "Friend request sent successfully",
        data: updatedUser, // Send the updated user directly
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Friend request not sent. Please try again later.",
      });
    }
  };
  

  export const acceptFriendRequest = async (req, res) => {
    try {
      // Fetch the friend's ID from the request parameters
      const { id: friendId } = req.params;
      // Fetch the accepting user's ID from the authenticated request
      const userId = req.user._id;
  
      // Find the user who sent the friend request
      const fetchedUser = await User.findOne({ _id: friendId });
      const acceptingUser = await User.findOne({ _id: userId });
  
      if (!fetchedUser || !acceptingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Check if the friend request exists
      if (!acceptingUser.friendRequests.includes(friendId)) {
        return res.status(400).json({
          success: false,
          message: "No friend request from this user",
        });
      }
  
      // Check if they are already friends
      if (fetchedUser.friends.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "You are already friends",
        });
      }
  
      // Update both users in one call
      const updatedAcceptingUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: { friends: friendId }, // Add friendId to the accepting user's friends list
          $pull: { friendRequests: friendId }, // Remove friendId from the accepting user's friend requests
        },
        { new: true } // Return the updated document
      );
  
      const updatedFetchedUser = await User.findOneAndUpdate(
        { _id: friendId },
        {
          $push: { friends: userId }, // Add userId to the fetched user's friends list
        },
        { new: true } // Return the updated document
      ).populate('friends');

    
      // real-time functionality: send in real time if the user is online
      const receiverSocketId = getReceiverSocketId(friendId);
  
      // Send in real-time if the user is online
      if (receiverSocketId) {
        console.log("this is what I am sending to the client:");
        console.log(updatedFetchedUser.friends);
        io.to(receiverSocketId).emit("newFriend", {
          updatedFriends: updatedFetchedUser.friends,
        });
        console.log("Notified the front end about the friend accept");
      }

 


  
      return res.status(200).json({
        success: true,
        message: "Friend request accepted successfully",
        updatedAcceptingUser,
        updatedFetchedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Friendship not accepted. Please try again later.",
      });
    }
  };
  

export const declineFriendRequest = async (req, res) => {
    try {
      // Fetch the friend's ID from the request parameters
      const { id: friendId } = req.params;
      // Fetch the ID of the user declining the request
      const userId = req.user._id;
  
      // Find the user who sent the friend request
      const decliningUser = await User.findOne({ _id: userId });
  
      if (!decliningUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Check if the friend request exists
      if (!decliningUser.friendRequests.includes(friendId)) {
        return res.status(400).json({
          success: false,
          message: "No friend request from this user",
        });
      }
  
      // Remove the friend's ID from the friendRequests array
      decliningUser.friendRequests = decliningUser.friendRequests.filter(
        (id) => id.toString() !== friendId.toString()
      );
  
      // Save the updated user document
      await decliningUser.save();
  
      return res.status(200).json({
        success: true,
        message: "Friend request declined successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Unable to decline friend request. Please try again later.",
      });
    }
  };
  