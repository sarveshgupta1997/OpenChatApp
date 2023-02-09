const socket = io("http://localhost:4400" , {transports:["websocket"]});

const form = document.querySelector("form");
const date_section = document.getElementById("date_section");
const message_input = document.getElementById("message_input");
const container = document.getElementById("container");
const message_submit_button = document.getElementById("message_submit_button");
var sent_tone = new Audio("sent_tone.mp3");
var receive_tone = new Audio("receive_tone.mp3");
var new_user_tone = new Audio("new_user_tone.mp3");
var left_tone = new Audio("left_tone.mp3");

message_submit_button.disabled = true;
message_input.addEventListener("input",()=>{
    if(message_input.value){
        message_submit_button.disabled = false;
    }else{
        message_submit_button.disabled = true;
    }
})

function appendData(name, message, position){
    container.innerHTML+=`
        <div class="message ${position}"><span class="user_name">${name} </span>${message}</div>
    `
    // scroling to bottom on new messages
    container.scrollTo(0, container.scrollHeight);
}

let name = prompt("Enter your name to join the chat.") || `Guest-${Math.floor(Math.random()*100000+1)}`;

socket.emit("new-user-joined",name);

socket.on("user-joined", name =>{
    appendData(name , "joined the chat." , "center");
    new_user_tone.play();
})

socket.on("receive_message", data =>{
    appendData(data.name , `<br>${data.message}` , "left");
    receive_tone.play();
})

socket.on("left_message", name =>{
    appendData(name , "left the chat." , "center");
    left_tone.play();
})

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const message = message_input.value
    appendData("You" , `<br>${message}` , "right");
    sent_tone.play();
    socket.emit("send_message",message);
    message_input.value ="";
    message_input.placeholder ="Type a message";
    message_submit_button.disabled = true;
})

// Getting Date 
let date= new Date();
var y = date.getFullYear();
var m = date.getMonth()+1;
var d = date.getDate();
if(m<10) m="0"+m;
if(d<10) d="0"+d;
var today =d+"/"+m+"/"+y;

date_section.innerText=today;    
