
var colorPicker
var sizePicker
var backPicker
var scrollPicker
var textArea

const prod = 'http://dronecast.westeurope.cloudapp.azure.com:8080/clients'
const dev = "http://localhost:8080/clients"
const socket = io(prod);

window.addEventListener("load", startup, false);
window.addEventListener("beforeunload", closeSocket, false);

function closeSocket(){
    socket.disconnect();
}

function startup() {
    colorPicker = document.querySelector("#colorPicker");
    sizePicker = document.querySelector("#sizePicker");
    backPicker = document.querySelector("#backgroundPicker");
    scrollPicker = document.querySelector("#scrollPicker");
    textArea = document.querySelector("#textArea");    

    // colorPicker.addEventListener("change", watchColorPicker, false);
    // sizePicker.addEventListener("change", watchSizePicker, false);
    // backPicker.addEventListener("change", watchBackPicker, false);    
    // scrollPicker.addEventListener("change", watchScrollPicker, false);
    //textArea.addEventListener("change", watchTextArea, false);
}

function watchColorPicker(event) {
    textArea.style.color = event.target.value
}

function watchSizePicker(event){
    textArea.style.fontSize = `${event.target.value}pt`
}

function watchBackPicker(event){
    textArea.style.backgroundColor = event.target.value
}

function watchScrollPicker(event){
    //console.log(event.target.value)
}
// function watchTextArea(){
//     console.log("change")
//     textArea.style.color = colorPicker.value
//     textArea.style.fontSize = sizePicker.value
//     textArea.style.backgroundColor = backPicker.value
// }

function onSend(){
    if (textArea.value === ""){
        alert("Text is empty")
    }
    let data= {
        text: textArea.value,
        fontColor: colorPicker.value,
        fontSize: sizePicker.value,
        backColor: backPicker.value,
        scrollRate: scrollPicker.value
    }
    socket.emit('toHTML', data);
}