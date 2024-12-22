import express from 'express'
import { dbConnect } from './config/database.js'
import router from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import {connectCloudinary} from '../src/config/cloudinary.js'

//initiating the server
const app = express()

//for fetching env data
import dotenv from "dotenv"
dotenv.config()


//so you can send json response and request
app.use(express.json());

//so that we can access the data in the cookie file
app.use(cookieParser());


//merging the router with server
app.use("/api/v1" , router);



//starting the server
const PORT = process.env.PORT || 3000
app.listen(PORT , () =>{
  console.log(`Server started at port ${PORT}`);
  //connects the database
  dbConnect()
  connectCloudinary()
  })
