const express = require('express');
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const path = require("path");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection",(socket)=>{
    socket.on('send-location',(data)=>{
        io.emit("receive-location",{id: socket.id, ...data})
    });
    socket.on('disconnect',function(){
        io.emit("user-disconnected",socket.id)
    })
})

app.get('/', function(req,res){
    res.render('index');
});

server.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
  });
  

