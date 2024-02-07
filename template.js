import express from "express"
import {createServer} from "http"
import { Server } from "socket.io";

const app = express()
const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true
    }
})

const users = []



io.on("connection", (socket) => {

    //craete new user and popup for new user joined
    socket.on("new-user-joined", (payload) =>{
        console.log("new user",payload.name,payload.id)
            users.push({name:payload.name,id:payload.id})
            console.log("users ",users)

            //send popup for new user joined
            socket.broadcast.emit("user-joined",payload)
    });

    //send meesage to other all sockets
    socket.on("send-message",(payload)=>{
            socket.broadcast.emit("receive-message",payload)
    });

    





})











server.listen(5000, ()=>{
    console.log("server is listening on PORT 5000")
})

