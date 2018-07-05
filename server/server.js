const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; // heroku o sa isi puna singur; daca nu exista punem 3000
var app = express();
var server = http.createServer(app);
var io = socketIO(server); // return websocket server

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('createMessage', (message) => {
        console.log('CreateMessage', message);
        io.emit('newMessage', { // trimite tuturor conexiunilor // socket.emit trimite doar uneia
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});




