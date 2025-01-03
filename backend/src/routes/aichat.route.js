import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";

import { sendMessageToGemini , getAIChatHistory ,clearChatHistory } from "../controllers/ai.chat.controller.js";

const router = express.Router();

router.post("/aichat/message", protectRoute , sendMessageToGemini);
router.get("/getAllChats", protectRoute , getAIChatHistory);
router.post("/clearChats", protectRoute , clearChatHistory);


export default router;
