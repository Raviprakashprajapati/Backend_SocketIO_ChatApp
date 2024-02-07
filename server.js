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

let users = []



io.on("connection", (socket) => {

    //craete new user and popup for new user joined
    socket.on("new-user-joined", (payload) =>{
       
            users.push({name:payload.name,id:socket.id})
            console.log("users ",users)

            //send popup for new user joined
            socket.broadcast.emit("user-joined",{name:payload.name,id:socket.id,newRegister:true})
            io.sockets.emit("popUpUserJoined",{user:users.length})
    });





    //send meesage to other all sockets
    socket.on("send-message",(payload)=>{
            socket.broadcast.emit("receive-message",payload)
    });

    
    socket.on("disconnect",()=>{
        users = users.filter((i)=>(i.id!=socket.id))
        console.log("map users ",users.length)
        io.sockets.emit("popUpUserJoined",{user:users.length})
    })





})











server.listen(5000, ()=>{
    console.log("server is listening on PORT 5000")
})

