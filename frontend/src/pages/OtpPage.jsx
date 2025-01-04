import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link, useNavigate , useLocation } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import OtpInput from 'react-otp-input';
import otp1 from "../gif/otp1.json"
import { useRef } from "react";
import Lottie from "react-lottie"
const OtpPage = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputs = useRef([]);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: otp1,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const handleChange = (e, index) => {
    const { value } = e.target;

    // Only allow numeric input (single digit)
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input
      if (index < 5) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] !== '') {
        // Erase the current input without moving focus
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move focus to the previous input if current is empty
        inputs.current[index - 1].focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };
  
  const location = useLocation()
  const { formData } = location.state || {};
  useEffect(()=>{
    console.log(formData)
  },[formData])
  const [showPassword, setShowPassword] = useState(false);
    const { signup  } = useAuthStore();
    const navigate = useNavigate()

  

  const handleSubmit = async () => {
    const finalOtp = otp.join('');
    if(formData && finalOtp.length == 6){
      formData.otp = finalOtp
      signup(formData , navigate)
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 flex flex-col items-center">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              {/* <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >   
                <MessageSquare className="w-6 h-6 text-primary" />
              </div> */}
              <h1 className="text-2xl font-bold mt-2">Enter Verification Code </h1>
              {/* <p className="text-base-content/60">Login in to your account</p> */}
            </div>
          </div>

          <Lottie options={defaultOptions} height={300} width={300} />

          {/* Form */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
      {otp.map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputs.current[index] = el)}
          style={{
            // backgroundColor: "white",
            width: '45px',
            height: '45px',
            margin: '0 5px',
            textAlign: 'center',
            fontSize: '18px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      ))}
  
  
  
    </div>
    <button onClick={handleSubmit}  className="btn btn-primary  w-[80%]  " >
              
              Enter
              
            </button>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Login to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};
export default OtpPage;
