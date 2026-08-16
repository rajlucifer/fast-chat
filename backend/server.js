import express from "express";
import "dotenv/config"
import cors from "cors";
import http from "http";
import connectDB from "./src/lib/db.js";
import dns from "dns";
import userRouter from "./src/routes/userRoutes.js";
import messageRouter from "./src/routes/messageRoutes.js";
import { Server } from "socket.io";


const PORT = process.env.PORT || 5000;
// create express app and http  we crate http because socket.io i support the http 
const app = express();
const server = http.createServer(app);



//initalized the socket.io server

export const io = new Server(server,{
    // to allow all the address
    cors:{origin:"*"}

})

// store all online users here

export  const userSocketMap = {};  // {userId:socketId}


// socket io connection handler

io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected",userId);

    if(userId){
        // making the key value pair in this object
        userSocketMap[userId] = socket.id;
    }

    // emit online  user all connected clients
    io.emit("getOnlineUser",Object.keys(userSocketMap));

    socket.on("Disconnected",()=>{
        console.log("User Disconnected",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUser",Object.keys(userSocketMap));
    })


})



//middleware 
// we create the limit so that only less then 4mb file can be use
app.use(cors());
app.use(express.json({limit:"4mb"}))
 

app.use("/api/status",(req,res)=>
    // this show in frontend
    res.send("server is live")
    
);
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);
 


// correct the dns so that mongodb connect properly

dns.setServers(['8.8.8.8','1.1.1.1']);

//connect to db
await connectDB();


 
server.listen(PORT,()=>{
    console.log(`Server Is Running on ${PORT}`);
});
 



