import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
export const protectRoute = async (req, res, next) => {

  // console.log("protected route funtion called");
  console.log("Req ke user mein user daaldiya hainSSS")

  try {
    const token = req.cookies.token;
    console.log("token ", token)
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    //select everything except password 
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("user is " ,);
    console.log(user)

    req.user = user;
    // console.log(req.body)
    // console.log(req.user);
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }

}