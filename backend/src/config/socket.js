// server
import {Server} from "socket.io"
import http from "http"
import express from "express"

// We create an Express server to handle HTTP requests.
// Then, we pass the server to Socket.IO to set up the WebSocket connection.
const app = express()
const server = http.createServer(app)
const io = new Server(server ,{
    cors: {
        origin: ["http://localhost:5173"],
        methods: ['GET', 'POST'],
    },
});


// used to store online user
const userSocketMap = {}  //{userId: SocketId}

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
  }
  

io.on("connection" , (socket) =>{

    console.log("User connected" , socket.id)
    const userId = socket.handshake.query.userId
    const userName = socket.handshake.query.userName
    console.log(userName , " is online ")
    if(userId){
        userSocketMap[userId] = socket.id
    }
    //used to send event to all the connected Client
    //you can listen this event at the connect socket function in the store where you have 
    //connected to the backend from frontend
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

   console.log("Number of online users are" , Object.keys(userSocketMap).length)

    socket.on("disconnect" , () =>{
        console.log("User disconnected with socket id = " , socket.id , " and name = ", userName)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})


export {io , server,app}
