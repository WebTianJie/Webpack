console.log("hellow this is the webpack entry");
require('./hellow.js')
require("./style.css")
require('./other.js')

document.getElementsByClassName('box')[0].className = "green";
let ele = document.createElement('div');
ele.className = "red"
document.body.appendChild(ele);