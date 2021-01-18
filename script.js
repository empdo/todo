"use strict";

var inputfield = document.querySelector("#input-field");
const itemContainer = document.querySelector("#todo-list");

function addItem(input){        
    var item = document.createElement("li");
    item.id = "todo-obj"

    var checkBox = document.createElement("span");
    checkBox.id = "checkBox";  
    checkBox.setAttribute("onClick", "checkBoxClick(this)");

    var inputText = document.createElement("span");
    inputText.id = "text";
    inputText.textContent = input;

    item.appendChild(checkBox)
    item.appendChild(inputText);

    itemContainer.appendChild(item);
    inputfield.value = "";
}

function checkBoxClick(e){
    var textElement = e.parentElement.querySelector("#text");
    console.log(textElement);
    if(e.style.backgroundColor === "white" || e.style.backgroundColor === ""){
        e.style.backgroundColor = "#b070e6";
        textElement.style.textDecoration = "line-through solid black 1.5px"
    }else {
        e.style.backgroundColor = "white";
        textElement.style.textDecoration = "none"
    }
}

document.querySelector("#form").addEventListener("submit", e => {
    if (inputfield.value.length > 0) {
            addItem(inputfield.value);  
    }
    event.preventDefault();
}, false);

