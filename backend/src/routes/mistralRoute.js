import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { generateText } from "../controllers/mistralModel.js";
const router = express.Router();

router.post("/mistral", generateText);


export default router;
