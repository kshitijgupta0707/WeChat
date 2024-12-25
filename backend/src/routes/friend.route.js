import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { sendFriendRequest , acceptFriendRequest , getAllFriends, getAllFriendRequests, declineFriendRequest} from "../controllers/friend.controller.js";


const router = express.Router();

router.post("/sendFriendRequest/:id", protectRoute, sendFriendRequest);
router.post("/acceptFriendRequest/:id", protectRoute, acceptFriendRequest);
router.get("/getAllFriends", protectRoute, getAllFriends);
router.get("/getAllFriendRequests", protectRoute, getAllFriendRequests);
router.post("/declineFriendRequest/:id", protectRoute, declineFriendRequest);
router.post("")
export default router;
