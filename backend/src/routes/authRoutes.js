// const {isUser} = require ('../middleware');
import {googleCallback , logout ,getUserDetails } from "../controllers/authController.js"
// const catchAsync = require('../utils/catchAsync');

import express from "express"
const router = express.Router();
import passport from "passport"
import { protectRoute } from "../middlewares/auth.middleware.js";

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google',  { 
    scope: ['profile', 'email'],
    failureRedirect: `${process.env.SITE_URL}/login`,
    session: false
}, ), googleCallback);


router.get('/getDetails', protectRoute,getUserDetails);

// router.get('/redirect', authController.redirectToFrontend);
router.get('/logout', logout);
export default router

