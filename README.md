# nodejs-chat-basic

# to open socket connection
# open multiple chrome browsers (http://localhost:3001/main.html) > Developer tools > console 
const socket = io('http://localhost:3001', {"auth":{"username":"Jogesh_one"}});

# Join Room
socket.emit('join_room', {"room":'MAH01'});

## Listner for any new message
socket.on('new_message', (data) => {console.log(data)})

# Listner for any new user joining / typing etc
socket.on('user_joined', (data) => {console.log(data)})

# Send new message
socket.emit('new_message', {"room":'MAH01', message:'Hello world'});