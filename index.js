const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const {Server}= require("socket.io")
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});


io.on('connection',(socket)=>{
    socket.emailSender=socket.handshake.auth.email
    console.log("a user connected", socket.emailSender);
    socket.on("sendFromClient",(data)=>{
        io.emit("sendFromServer",{
            emailSender:socket.emailSender,
            msg:data,
            id:Date.now()
        })
    })
    socket.on("doneTaskFromClient",(data)=>{
        io.emit("doneTaskFromServer",{
            msg:data
        })
        console.log(data);
        
    })
    socket.on('disconnect',()=>{
        console.log("User disconnected", socket.id);
        
    })
})

server.listen(3000, () => {
  console.log("listening on *:3000");
});
