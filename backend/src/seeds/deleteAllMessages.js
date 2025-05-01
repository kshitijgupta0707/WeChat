import mongoose from 'mongoose';
import dotenv from 'dotenv'
import Message from "../models/message.model.js"
import { User } from '../models/user.model.js';
import { dbConnect } from '../config/database.js';
import GroupMessage from "../models/groupchat.model.js"
import Group from "../models/group.model.js"

const deleteMessages = async () => {
    try {
        dotenv.config()
        await dbConnect();
        await GroupMessage.deleteMany({})
        await Group.deleteMany({})
            .then(() => {
                console.log('All messages have been deleted successfully.');
                mongoose.disconnect();
            })
            .catch((error) => {
                console.error('Error deleting messages:', error);
                mongoose.disconnect();
            });
        console.log("Messages deleted successfully");
    } catch (error) {
        console.error("Error deleting database:", error);
    }
};

deleteMessages()

// Call the function
export { deleteMessages };
