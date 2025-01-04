import { User } from '../models/user.model.js';
import dotenv from "dotenv"
import Message from '../models/message.model.js';
dotenv.config()
import { getReceiverSocketId, io } from '../config/socket.js';
export const getAllFriends = async (req, res) => {
  try {
    // Fetch the requesting user's ID from the authenticated request
    const userId = req.user._id;

    const friendIds = req.user.friends
    const pipeline = [
      // Match all messages related to the user (sender or receiver)
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      },
      // Sort by createdAt to ensure the latest message comes first

      {
        $group: {
          // we want saamne wala banda---
          // Group by friend (sender or receiver) based on who is the opposite of the current user
          _id: {
            $cond: [
              { $eq: ["$senderId", userId] },
              "$receiverId", // If the sender is the user, take the receiver as the friend
              "$senderId"    // Otherwise, take the sender as the friend
            ]
          },
          // Get the last message text
          lastMessage: { $last: "$text" },
          // Get the last message timestamp
          lastMessageTime: { $last: "$createdAt" },
          // Count the number of unseen messages for the user
          unseenCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiverId", userId] }, // Is the user the receiver?
                    { $eq: ["$isSeen", false] }        // Is the message unseen?
                  ]
                },
                1,  // Increment the count if both conditions are true
                0   // Else, do nothing
              ]
            }
          }
        }
      },
      // Use $lookup to fetch the user details (firstName, lastName, email) for each friend
      {
        $lookup: {
          from: "users",  // The name of the user collection
          localField: "_id",  // Match the userId (friend) with the _id field of the user collection
          foreignField: "_id",  // Ensure matching with the _id field of the User document
          as: "userDetails"  // Store the user details in a new field called userDetails
        }
      },
      // Unwind the userDetails array to access individual user info
      {
        $unwind: "$userDetails"
      },
      // Project the desired fields to send in the response
      {
        $project: {
          _id: 1,  // Remove the _id field from the output
          friendId: "$_id",  // Add the friendId (the other user in the conversation)
          firstName: "$userDetails.firstName",  // Add the friend's firstName
          lastName: "$userDetails.lastName",    // Add the friend's lastName
          email: "$userDetails.email",          // Add the friend's email
          profilePic: "$userDetails.profilePic",
          lastMessage: 1,                       // Include the last message text
          lastMessageTime: 1,                   // Include the last message timestamp
          unseenCount: 1                        // Include the unseen message count
        }
      },
      // Sort by the last message timestamp in descending order to show the most recent conversations first
      {
        $sort: { lastMessageTime: -1 }
      }
    ]
    const friendsWithLastMessages = await Message.aggregate(pipeline);
    // Step 2: Fetch friends with no messages
    const friendsWithMessagesIds = friendsWithLastMessages.map(friend => friend.friendId);

    const friendsWithNoMessages = await User.find({
      _id: {
        $nin: [...friendsWithMessagesIds, userId],
        $in: friendIds
      }, // Exclude friends with messages AND the user's own account
      /* Additional criteria for fetching friends if needed */
    })
    // .select("firstName lastName email");
    const combinedFriends = [
      ...friendsWithLastMessages,
      ...friendsWithNoMessages
    ]

    return res.status(200).json({
      success: true,
      message: "all friends are fetched according to the lastest messages",
      data: combinedFriends,
    });




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
    // console.log("fetched User is",fetchedUser)

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
      console.log("printing from backend");
      console.log(req.user.firstName);
      io.to(receiverSocketId).emit("newFriendRequest", { friendRequests: updatedUser.friendRequests, name: req.user.firstName });
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
    //  console.log("this is what i am sending to frontend ",fetchedUser.firstName)
    // Send in real-time if the user is online
    if (receiverSocketId) {
      console.log("this is what I am sending to the client:");
      console.log(updatedFetchedUser.friends);
      io.to(receiverSocketId).emit("newFriend", {
        updatedFriends: updatedFetchedUser.friends,
        name: fetchedUser.firstName,
        personWhoHasAccepted: userId
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
