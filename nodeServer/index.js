// Node server which will handle socket io connections
const io = require('socket.io')(8000)

const users = {};//an object called user is created to store information of every user separately 

io.on('connection', socket =>{
    //this function assigns the new user with a unique socket ID and tells other users that specified user has joined
    socket.on('new_user', name =>{ 
        console.log("new user",name)//this is for console/terminal
        users[socket.id] = name;//as the new connection is established a unique ID is generated and the user is associated with it 
        socket.broadcast.emit('user-joined', name);//this sends the name of the user that joined back to the client 
    });

    //this function sends message to all the other user
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})//when someone sends message this broadcasts it to others
    });

    //this function gives the name of the user that left the chat
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);//this tells other users that specified user left the chat
        delete users[socket.id];//this deletes the user using the unique socket ID
    });
});