
var textArea
var data

const prod = 'http://ec2-18-233-146-243.compute-1.amazonaws.com:8080/drones'
const dev = "http://localhost:8080/drones"
const socket = io(dev);

window.addEventListener("load", startup, false);
window.addEventListener("beforeunload", closeSocket, false);

function closeSocket() {
    socket.disconnect();
}

function startup() {
    textArea = document.querySelector("#marquee");
}

socket.on('toHTML', (data) => {
    document.body.style.backgroundColor = data.backColor
    textArea.style.color = data.fontColor
    textArea.style.fontSize = `${data.fontSize}vh`
    textArea.textContent = data.text
    textArea.style.animationDuration = `${data.scrollRate}s`
})