const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; // heroku o sa isi puna singur; daca nu exista punem 3000
var app = express();
var server = http.createServer(app);
var io = socketIO(server); // return websocket server
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }

        socket.join(params.room);
        //socket.leave(params.room) - iese din grup
        //io.emit - catre toti userii
        //socket.broadcast.emit - trimite tuturor conectati pe server mai putin cel current
        //socket.emit - doar unui user

        //io.to('camera').emit - trimite doar camerei
        //socket.broadcast.to('camera').emit - idem

        users.removeUser(socket.id); // da remove din orice alte camere
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room)); // trimite lista
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`));
        callback();
    })

    socket.on('createMessage', (message, callback) => {
        console.log('CreateMessage', message);
        var user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text)); // trimite tuturor conexiunilor // socket.emit trimite doar uneia
        }

        callback('');
        // callback('This is from the server');
        //     socket.broadcast.emit('newMessage', { // trimite messajul mai putin socketului deschis adica celui care l-a trimis
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`));
        }
        console.log('User was disconnected');
    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});




