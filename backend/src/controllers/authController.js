
import { User } from '../models/user.model.js';
import passport from "passport"
import jwt from "jsonwebtoken"
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
},
  async (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  }
));

passport.serializeUser(function (user, callback) {
  callback(null, user._id);
});

passport.deserializeUser(function (id, callback) {
  User.findById(id, function (err, user) {
    callback(err, user);
  });
});



const googleCallback = async (req, res) => {
  console.log("\n******** Inside handleGoogleLoginCallback function ********");
  // console.log("User Google Info", req.user);
  let existingUser = await User.findOne({ email: req.user._json.email });
  const redirectUrl = process.env.NODE_ENV === 'production' ? `${process.env.SITE_URL}/login` : 'http://localhost:5173/login';
  if (existingUser) {
    if (!existingUser.googleId) {
      existingUser.googleId = req.user._json.sub;
      existingUser.picture = req.user._json.picture;
      await existingUser.save();
    }


    const payload = { id: existingUser._id, email: existingUser.email }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d"
    })

    //creating a cookie
    let options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
     res.cookie("token", token, options)
    return res.redirect(redirectUrl);


  }
  else {
    console.log("Creating new Unregistered User");
    console.log(req.user._json)
    existingUser = await User.create({
      firstName: req.user._json.name,
      email: req.user._json.email,
      picture: req.user._json.picture,
      googleId: req.user._json.sub
    });
  }


  const payload = { id: existingUser._id, email: existingUser.email }
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d"
  })



  //creating a cookie
  let options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
   res.cookie("token", token, options)
  return res.redirect(redirectUrl);;

  

};

const getUserDetails = async (req, res) => {
  const user = await User.findById(req.userId);
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    googleId: user.googleId,
    profile: user.profile,
    currentPlan: user.currentPlan,
    planNameL: user.planName

  }
  res.status(200).json({ payload: payload, expiresIn: req.expIn });

};

const logout = (req, res) => {
  res.clearCookie('userjwt', {
    signed: true,
    httpOnly: true,
    sameSite: 'none',
    secure: true
  });
  const redirectUrl = process.env.NODE_ENV === 'production' ? `${process.env.SITE_URL}/login` : 'http://localhost:5173/login';
  res.redirect(redirectUrl);
}

export { googleCallback, getUserDetails, logout }