
var textArea
var data

const prod = 'http://dronecast.westeurope.cloudapp.azure.com:8080/clients'
const dev = "http://localhost:8080/drones"
const socket = io(dev);

window.addEventListener("load", startup, false);
window.addEventListener("beforeunload", closeSocket, false);

function closeSocket() {
    socket.disconnect();
}

function startup() {
    textArea = document.querySelector("#marquee");
    console.log(textArea.style)
}

socket.on('toHTML', (data) => {
    console.log(data)
    document.body.style.backgroundColor = data.backColor
    textArea.style.color = data.fontColor
    textArea.style.fontSize = `${data.fontSize}pt`
    textArea.textContent = data.text
    textArea.style.animationDuration = `${data.scrollRate}s`
})