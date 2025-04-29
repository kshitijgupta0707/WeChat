import express from "express";
import { checkAuth, login, logout, signup, updateProfile, sendOtp } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", protectRoute, logout);
authRoutes.post("/sendotp", sendOtp)
authRoutes.put("/update-profile", protectRoute, updateProfile);

authRoutes.get("/check", protectRoute, checkAuth);

export default authRoutes;


