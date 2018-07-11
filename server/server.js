const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; // heroku o sa isi puna singur; daca nu exista punem 3000
var app = express();
var server = http.createServer(app);
var io = socketIO(server); // return websocket server

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined the chat app'));

    socket.on('createMessage', (message, callback) => {
        console.log('CreateMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text)); // trimite tuturor conexiunilor // socket.emit trimite doar uneia
        callback('');
        // callback('This is from the server');
        //     socket.broadcast.emit('newMessage', { // trimite messajul mai putin socketului deschis adica celui care l-a trimis
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});




