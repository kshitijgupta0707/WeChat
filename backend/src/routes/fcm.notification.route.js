
import express from "express";
// import { saveFcmToken, removeToken } from "../controllers/fcm.notification.controller";

import { saveFcmToken , removeToken } from "../controllers/notification.controller.js";
const router = express.Router();

router.post("/save-token", saveFcmToken);
router.post('/remove-token', removeToken)

export default router;