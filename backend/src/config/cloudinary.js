
// Require the Cloudinary library
import cloudinary from 'cloudinary'

export const connectCloudinary = async () => {
  try {
    await cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    console.log("cloudinary connected");
  } catch (e) {
    console.error(e);
  }
};
