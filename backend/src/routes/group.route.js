import express from "express";
import Group from "../models/group.model.js";
import { User } from "../models/user.model.js";
import GroupMessage from "../models/groupchat.model.js";
import { sendNotificationToAll, sendNotificationToPerson, sendNotificationToAdmins }
  from
  "../controllers/notification.controller.js";

import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create a new group
router.post("/create", protectRoute, async (req, res) => {
  try {
    const { name, members, admin } = req.body;

    // Ensure admin is part of the group
    if (!members.includes(admin)) {
      members.push(admin);
    }



    const newGroup = new Group({ name, members, admin });
    await newGroup.save();
    // Populate members field
    const populatedGroup = await Group.findById(newGroup._id).populate("members", "firstName lastName profilePic email");


    console.log("members are ", members)


    for (let i = 0; i < members.length; i++) {
      if (String(members[i]) !== String(admin)) {
        try {
          console.log("sending notification")
          const notifyPerson = await sendNotificationToPerson(
            `${req.user.firstName} add you in ${name} group!`,
            `Starting zolo with each other`,
            { userId: members[i], type: "New Group Created" }
          );
          console.log("Notification result:", notifyPerson);
        } catch (notificationError) {
          console.error("Failed to send notification:", notificationError);
        }
      }
    }



    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Fetch all groups of a user
router.get("/user/:userId", async (req, res) => {
  try {
    const groups = await Group.find({ members: req.params.userId }).populate("members");
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Send a message in a group
router.post("/message/send", protectRoute, async (req, res) => {
  try {
    const { senderId, groupId, text, image } = req.body;

    const newMessage = new GroupMessage({ senderId, groupId, text, image });
    await newMessage.save();

    // Add message to the group
    // const g = await Group.findByIdAndUpdate(groupId, { $push: { messages: newMessage._id } }).populate('members');
    const g = await Group.findByIdAndUpdate(
      groupId,
      { $push: { messages: newMessage._id } },
      { new: true }
    ).populate('members');

    const members = g?.members

    for (let i = 0; i < members.length; i++) {
      console.log("Members id" , members[i]._id)
      if (String(members[i]._id) !== String(senderId)) {
        try {
          const notifyPerson = await sendNotificationToPerson(
            `${req.user.firstName} in ${g.name} group!`,
            `${text}`,
            { userId: members[i]._id, type: "New message received" }
          );
          console.log("Notification result:", notifyPerson);
        } catch (notificationError) {
          console.error("Failed to send notification:", notificationError);
        }
      }
    }


    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all messages in a group
router.get("/messages/:groupId", async (req, res) => {
  try {
    console.log("i am fetching all the messages for the group");

    console.log(req.params.groupId)
    const messages = await GroupMessage.find({ groupId: req.params.groupId }).populate('senderId');
    console.log(messages)
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
