import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { sendMessageToAi } from "../controllers/gemini.controller.js";

const router = express.Router();

router.post("/gemini", sendMessageToAi);


export default router;
