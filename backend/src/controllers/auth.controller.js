import { User } from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import cloudinary from "cloudinary"
import { uploadImageToCloudinary } from '../utils/imageUploader.js';
dotenv.config()


export const signup = async (req, res) => {
  try {
    //fetch the data from the request
    const { firstName, lastName, email, password, confirmPassword } = req.body
    console.log(firstName, lastName, email, password, confirmPassword);

    //check if some data is missing
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
    //check whether both password are same
    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not matches"
      });
    }
    //check whether length is >= 6
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    //check if user already exist
    //use find one it gives an single object
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      console.log(existingUser);
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //secure the password

    //optimal round jaida heavy hoga //if kam then can be hacked------------>
    // AES ke bre mein padhoo //worth it very interesting
    //Retry startegy to hash password for atleast three times
    let tryy = 0;
    let hashedPassword;
    while (tryy < 3) {
      try {
        hashedPassword = await bcrypt.hash(password, 10);
        if (hashedPassword) break;
      } catch (e) {
        tryy++;
        if (tryy == 3) {
          return res.status(500).json({
            success: false,
            data: "Error in hashing passwrord",
          });
        }
      }
    }

    //entry in db

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      friends: [],
      friendRequests: []
    })

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user
    });


  } catch (error) {
    console.log(error);
    res.json({
      message: "User cannot be registed, Please try again later",
    }).status(500);
  }
}
export const login = async (req, res) => {
  try {
    //get data
    const { email, password } = req.body;

    //validation on email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fills all the details",
      });
    }

    //check whethrer user exists or not
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }

    //take the hash password
    console.log(user.password);
    const { password: hashedPassword } = user;

    //now verify the password //decrypt

    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword)

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //if correct

    //Data that you want to hide in the token
    const payload = { id: user._id, email: user.email }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d"
    })

    // Create response object without password

    const responseUser = user;
    responseUser.password = ""
    //creating a cookie
    let options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };


    // user.password = ""
    // user.token = token
    return res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      responseUser,
      message: "User logged in successfully",
    });

  } catch (error) {

    console.error(e);
    res.status(400).json({
      success: false,
      data: "Not able to get the data",
    })
  }
};
export const logout = (req, res) => {
  //we have to just clear out the cookies
  try {
    res.cookie("token", "", { maxAge: 0 }); //expire immediattely get removed by maxage , erased by " "
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    console.log("At update profile");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const userId = req.user._id; // Inserted in the protected middleware
    const profilePic = req.files?.profilePic; // Extract the file from `req.files`

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const uploadResponse = await uploadImageToCloudinary(profilePic, "CHATAPP");
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
