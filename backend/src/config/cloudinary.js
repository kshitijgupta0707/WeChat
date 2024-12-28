
// Require the Cloudinary library
import cloudinary from 'cloudinary'
import dotenv from "dotenv";
dotenv.config();


export const connectCloudinary = async () => {
  try {
    const t = await cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    // console.log("cloud connfig : " , t)

    console.log("cloudinary connected");
  } catch (e) {
    console.error(e);
  }
};
