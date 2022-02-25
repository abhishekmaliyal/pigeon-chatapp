const socket = io("http://localhost:8000");


//socket.on --> listens and collects data
//socket.emit --> sends data
//socket.broadcast.emit --> sends data to all other than creator


//these are to get DOM elements in respective variables
const form = document.getElementById("send_container");
const messageInput = document.getElementById("messageInput");
const messageContainer = document.querySelector(".container");

var audio = new Audio("alert.mp3"); //this is used to store an audio in a variable to be used later

//this function is used to append event information to the contaner
const append = (message, position) => {
  const messageElement = document.createElement("div"); //a div is created dynamically in HTML
  messageElement.innerText = message; //message is put in the new div as text
  messageElement.classList.add("message"); //message class is added to div
  messageElement.classList.add(position); //position class is added to div for left and right messages
  messageContainer.append(messageElement);
  if (position == "left") {//this plays the audio when a message is recieved
    audio.play();
  }
};
const name = prompt("Enter your name to join"); //this creates a pop-up window to get the name from the user and then stores it in name variable
socket.emit("new_user", name); //this function calls the new-user-joined function in the server to store the names of the users that joined

socket.on("user-joined", (name) => {
  //this function is for new users
  append(`${name} just landed`, "right"); //this function will print that a new user has joined the chat
});

socket.on("receive", (data) => {
  //this function gets the message sent by the user along with the name of the user that sent it
  append(`${data.name}: ${data.message}`, "left"); //this sends the name and the message to local append function
});

socket.on("left", (name) => {
  //this function gets he name of the user that has left the chat
  append(`${name} couldn't survive`, "right"); //this displays the name of he user that left to the other remaining users
});

form.addEventListener("submit", (e) => {
  e.preventDefault(); //this is used to stop the page from refreshing after every submition
  const message = messageInput.value; //variable message stores the text entered in the text box
  append(`You: ${message}`, "right"); // this appends the the text in the message variable after "you:"
  socket.emit("send", message);
  messageInput.value = ""; //this is used to clear the message text box for fresh new message
  scroll();
});