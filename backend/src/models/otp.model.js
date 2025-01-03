import mongoose from "mongoose"
import { mailSender } from "../utils/mailSender.js"
import { otpTemplate } from "../templates/otp.template.js";
const schema = mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      //it will delete the complete document in 5 minutes after its creation
      expires: 5 * 60,
    },
  });
  
  //create a function which send emails
  async function sendVerificationEmail(email, otp) {
    try {
      const mailResponse = await mailSender(
         email,
        "Email Verification",
         otpTemplate(otp),
      );
      console.log("Verification email sent successfully", mailResponse);
    } catch (e) {
      console.log("Error occured while sending verification email");
      console.error(e);
      throw e;
    }
  }
  
  //called just before saving the otp in the database
  schema.pre("save", async function (next) {
    try {
      await sendVerificationEmail(this.email, this.otp);
  
      //save the document
      next();
    } catch (e) {
      // now document will not be saved
      next(e);
    }
  });
  
  const OTP = mongoose.model("OTP", schema);
  export {OTP}  