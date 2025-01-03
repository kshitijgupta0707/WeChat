import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";

import { sendMessageToGemini , getAIChatHistory } from "../controllers/ai.chat.controller.js";

const router = express.Router();

router.post("/aichat/message", protectRoute , sendMessageToGemini);
router.get("/getAllChats", protectRoute , getAIChatHistory);


export default router;
