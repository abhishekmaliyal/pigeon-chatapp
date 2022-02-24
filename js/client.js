const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

var audio = new Audio('ting.mp3');//this is used to store an audio in a variable to be used later

// Function which will append event info to the contaner
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left'){ 
        audio.play();
    }
}
// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");//this creates a pop-up window to get the name from the user and then stores it in name variable
socket.emit('new-user-joined', name);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    append(`${name} just landed`, 'right')
})

// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name} couldn't survive`, 'right')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();         //this is used to stop the page from refreshing after every submition
    const message = messageInput.value;     //variable message stores the text entered in the text box
    append(`You: ${message}`, 'right');     // this appends the the text in the message variable after "you:"
    socket.emit('send', message);
    messageInput.value = ''     //this is used to clear the message text box for fresh new message
})