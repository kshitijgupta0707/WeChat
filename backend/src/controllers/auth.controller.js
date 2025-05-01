import { User } from '../models/user.model.js';
import { OTP } from '../models/otp.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import cloudinary from "cloudinary"
import { uploadImageToCloudinary } from '../utils/imageUploader.js';
import otpGenerator from "otp-generator";
import { Token } from '../models/token.model.js';
export const sendOtp = async (req, res) => {
  try {
    //fetch email from the request body
    const { email } = req.body;

    //check if user already exists
    const existingUser = await User.findOne({ email });

    //if user already exist , then return a respoonse
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    //generate otp
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    console.log("otp generated ", otp);

    //check unique otp or not
    const result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      console.log("otp generated ", otp);
      result = await OTP.findOne({ otp });
    }

    //create an entry in db for otp
    const otpPayLoad = { email, otp };
    const otpBody = await OTP.create(otpPayLoad);
    console.log(otpBody);

    //return succesfull response
    return res.status(200).json({
      success: true,
      message: "Otp sent successfully",
      otp,
    });
  } catch (e) {
    console.log("Error in sending otp");
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Otp not generated",
      error: e,
    });
  }
}
export const signup = async (req, res) => {
  try {
    //fetch the data from the request
    const { firstName, lastName, email, password, confirmPassword, otp } = req.body
    // console.log(firstName, lastName, email, password, confirmPassword);

    //check if some data is missing
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
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
      // console.log("User already exists");
      // console.log(existingUser);
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    //compare the otp
    //find the most recent stored for the user

    const recentOtp = await OTP.find({ email })
      .sort({
        createdAt: -1,
      })
      .limit(1);

    console.log("Recent otp", recentOtp);

    //validate otp
    if (recentOtp.length == 0) {
      //otp not found
      return res.status(400).json({
        success: false,
        message: "Otp is expired",
      });
    }
    console.log(otp);
    console.log(recentOtp[0].otp);
    //compare otp
    if (otp != recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid otp",
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
    console.log(" login called")
    const { email, password } = req.body;

    //validation on email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fills all the details",
      });
    }
    console.log(email, password)

    //check whethrer user exists or not
    let user = await User.findOne({ email });
    // console.log(user)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }

    //take the hash password
    console.log(user.password);

    const { password: hashedPassword } = user;
    if (hashedPassword == null) {
      return res.status(400).json({
        success: false,
        message: "Please login using google Auth"
      })
    }
    //now verify the password //decrypt

    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword)

    console.log("checking authenticity");
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //if correct
    console.log("valid credentials");

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

  } catch (e) {

    console.error(e);
    res.status(400).json({
      success: false,
      data: "Not able to get the data",
    })
  }
};
export const logout = async (req, res) => {
  //we have to just clear out the cookies
  try {
    res.cookie("token", "", { maxAge: 0 }); //expire immediattely get removed by maxage , erased by " "



    const userId = req.user._id;
    // Remove the token for this user
    //Also dlete all the token for the notification for the user
    await Token.deleteMany({ userId });

    res.status(200).json({ message: "Logged out successfully" });




  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profilePic = req.files?.profilePic;
    const predefinedPhoto = req.body.profilePic; // Predefined photo URL

    if (!profilePic && !predefinedPhoto) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    let profilePicUrl = predefinedPhoto;

    if (profilePic) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(profilePic.mimetype)) {
        return res.status(400).json({ message: "Only JPG and PNG files are allowed" });
      }
      // only 200kb photo rquired
      if (profilePic.size > 200 * 1024) {
        return res.status(400).json({ message: "File size must be less than 200Kb" });
      }

      const uploadResponse = await uploadImageToCloudinary(profilePic, "CHATAPP");
      profilePicUrl = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: profilePicUrl },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error.message);
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
export const loginwithOAuth = async (req, res) => {
  try {

    console.log("Login with o auth called");
    let { email, name } = req.body;

    name = name.split(' ');
    let firstName = name[0]
    let lastName = name[1]

    // Check if both fields are provided
    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });

    }

    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      user = User.create({ email, firstName, lastName })
    }


    const payload = {
      id: user._id,
      email: user.email,
    };

    // Generate JWT token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      //STRICT IF HOSTED TOGETHER
      //Allow cross-site cookies
      sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    }

    const responseUser = user;
    responseUser.password = ""; // Remove password from response


    // Send token in HTTP-only cookie
    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "Login successful",
      token,
      responseUser,
      // location
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


