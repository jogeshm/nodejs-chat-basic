const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: {origins: ["*"]}});

//app.use(cors());
app.use(express.static(path.join(__dirname,'../public')));

io.use((socket, next) => {
    // a middle ware function to include any auth logic for users
    // const token = socket.handshake.auth.token;
    // const user_id = socket.handshake.auth.user_id;
    const username = socket.handshake.auth.username;

    // assign username to socket
    if(username){
        socket.username = username;
    }else{
        socket.username = 'user_'+10000*Math.random()
    }
    
    next();
})

io.on('connection', (socket) => {
    socket.on('new_message', (data) => {
        if(data.room){
            socket.in(data.room.trim().toLowerCase()).emit('new_message', {
                message: data.message,
                username: socket.username
            });
        }else{
            console.log(data);
        }        
    })

    socket.on('join_room', (data)=>{
        if(data.room){
            socket.join(data.room.trim().toLowerCase());
  
            socket.in(data.room.trim().toLowerCase()).emit('user_joined', {
                username: socket.username
            });
        }      
    })

    socket.on('add_user', (username)=>{
        socket.username = username;
        // echo globally (all clients) that a person has connected
    })

    socket.on("error", (err) => {
        if (err && err.message === "unauthorized event") {
          socket.emit('error', "unauthorized." );
          socket.disconnect();
        }else if(err){
          socket.emit('error', err.message );
          socket.disconnect();
        }else{
            socket.disconnect();
        }
      });
})

app.get('/', (req, res) =>{
  res.send({
      "status": 'success',
      "message": "First checkpoint!"
  })
})

server.listen(3001, () => {
    console.log('listening on *:3001');
});