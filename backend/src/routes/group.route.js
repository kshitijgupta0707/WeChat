import express from "express";
import Group from "../models/group.model.js";
import { User } from "../models/user.model.js";
import GroupMessage from "../models/groupchat.model.js";

const router = express.Router();

// Create a new group
router.post("/create", async (req, res) => {
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
router.post("/message/send", async (req, res) => {
  try {
    const { senderId, groupId, text, image } = req.body;

    const newMessage = new GroupMessage({ senderId, groupId, text, image });
    await newMessage.save();

    // Add message to the group
    await Group.findByIdAndUpdate(groupId, { $push: { messages: newMessage._id } });

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
