import express from 'express'
import { dbConnect } from './config/database.js'
import authRoutes from './routes/auth.route.js'
import messageRoutes from "./routes/message.route.js"
import friendRoutes from "./routes/friend.route.js"
import cookieParser from 'cookie-parser'
import { connectCloudinary } from '../src/config/cloudinary.js'
import { app , server } from './config/socket.js'
import fileUpload from "express-fileupload";
import cors from "cors";
import path from "path"
import { deleteMessages } from './seeds/deleteAllMessages.js'
import { seedDatabase } from './seeds/user.seeds.js'
//initiating the server
// const app = express()

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
app.use("/api/friends", friendRoutes);

//starting the server

const __dirname = path.resolve()
 
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
  //connects the database
  dbConnect()
  connectCloudinary()
  // deleteMessages()
  // seedDatabase()
})
