import express from 'express'
import { dbConnect } from './config/database.js'
import authRoutes from './routes/auth.route.js'
import messageRoutes from "./routes/message.route.js"
import cookieParser from 'cookie-parser'
import { connectCloudinary } from '../src/config/cloudinary.js'
import fileUpload from "express-fileupload";
import cors from "cors"

//initiating the server
const app = express()

//for fetching env data
import dotenv from "dotenv"
dotenv.config()

// Middleware for parsing files
app.use(
  fileUpload({
    useTempFiles: true, // Enables temporary file storage
    tempFileDir: "/tmp/", // Temporary directory for uploaded files
  })
);


//so you can send json response and request
app.use(express.json());

//so that we can access the data in the cookie file

app.use(cookieParser());

//to remove cors error
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true
  }
))
//merging the router with server
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);



//starting the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
  //connects the database
  dbConnect()
  connectCloudinary()
})
