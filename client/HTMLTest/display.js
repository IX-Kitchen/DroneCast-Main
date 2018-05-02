
var textArea
var data
const socket = io('http://localhost:8080/drones');

window.addEventListener("load", startup, false);
window.addEventListener("beforeunload", closeSocket, false);

function closeSocket() {
    socket.disconnect();
}

function startup() {
    textArea = document.querySelector("#textArea");
}

function show() {
    if (data === undefined){
        alert("No data")
        return
    }
    textArea.style.color = data.fontColor
    textArea.style.fontSize = `${data.fontSize}pt`
    textArea.style.backgroundColor = data.backColor
    textArea.value = data.text
}

socket.on('toHTML', (msg) => {
    data = msg
})