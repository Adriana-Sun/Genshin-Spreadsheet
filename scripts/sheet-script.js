const addButton = document.querySelector('#add');
const spreadsheet = document.querySelector('.spreadsheet');
const bodyElement = document.querySelector('body');

const rowIDs = [];  //used to store each row's unique ID

addButton.addEventListener('click', addRow);    //adds a click listener to the add button

document.onkeydown = function(e) {
    if (e.key === "Enter"){ //add a row each time the user presses "Enter"
      addRow();
    }
}

function addRow() { //the function that events call
    let ID = generateID();  //generate the ID and store it into a variable to pass to the helper method
    createRow(ID);  //helper method
}

function createRow(ID){ //takes in the unique ID to assign to the div and the remove button
    let fragment = new DocumentFragment();
    let ss = document.createElement("div");     //creating the div to hold the row in
    ss.classList.add('spreadsheet');
    ss.setAttribute('id', ID);

    let columns = [];    //column array
    let containers = [];    //dropdown container array
    for(let i = 0; i < 3; i++){
        let dropdownContainer = document.createElement("div");  //container for all dropdowns
        dropdownContainer.classList.add("dropdownContainer");
        ss.appendChild(dropdownContainer);
        containers.push(dropdownContainer);

        let dropButton = document.createElement("button");  //the button/cell
        dropButton.classList.add('dropBtn');
        columns.push(dropButton);
        dropdownContainer.appendChild(dropButton);
    }
    dropIDHelper(columns, containers, ["char", "const", "weapon"], ID);  //helper function

    let rmvBtn = document.createElement("button");  //creating the remove button
    ss.appendChild(rmvBtn);
    rmvBtn.classList.add("remove");
    rmvBtn.textContent = "-";
    rmvBtn.addEventListener('click', 
    function(){
        removeRow(ID);
    });     //adding an event listener that calls a function which calls removeRow

    fragment.appendChild(ss);
    bodyElement.insertBefore(fragment, addButton);
}

function dropIDHelper(columns, containers, type, ID){  //helper function
    for(let i = 0; i < 3; i++){
        columns[i].setAttribute('id', ID);  //assigning row id to the respective columns
        columns[i].classList.add(type[i] + "Drop");
        containers[i].classList.add(type[i]);
        dropdownAdd(containers[i], ['none', 'a', 'b', 'c'], ID, type[i]);
        columns[i].setAttribute('onclick', "showDrop(" + ID + ", " + "'" + type[i] + "'"+ ")");
    }
}

function showDrop(ID, type){
    let row = document.getElementById(ID);
    let dropType = row.querySelector("." + type);
    let dropContent = dropType.querySelector(".dropContent");
    dropContent.classList.toggle("show");
}

function dropdownAdd(node, list, ID, type){
    let dropContainer = document.createElement('div');
    dropContainer.classList.add("dropContent");
    dropContainer.classList.add(type + "Drop");
    dropContainer.setAttribute('id', ID);

    let searchBar = document.createElement('input');
    searchBar.setAttribute('id', 'search');
    searchBar.setAttribute('placeholder', 'Search...');
    searchBar.setAttribute('onkeyup', "filterFunction(" + ID + ", " + "'" + type + "'"+ ")");
    dropContainer.appendChild(searchBar);

    for(let i = 0; i < list.length; i++){
        let selection = document.createElement('a');
        selection.innerText = list[i];
        selection.setAttribute('onclick', "replaceText(" + ID + ", " + "'" + type + "'" + ", '" + selection.innerText + "')");
        dropContainer.appendChild(selection);
    }

    node.appendChild(dropContainer);
}

function filterFunction(ID, type) {
    let row = document.getElementById(ID);  //specific spreadsheet row
    let dropType = row.querySelector("." + type); //specific column
    let search = dropType.querySelector("#search");    //find search bar
    let filter = search.value.toUpperCase();
    let a = dropType.getElementsByTagName("a");   //get all the elements in the menu
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;  //no idea what this does lmao
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } 
        else {
            a[i].style.display = "none";
        }
    }
}

function replaceText(ID, type, text){
    let row = document.getElementById(ID)
    let button = row.querySelector("." + type + "Drop");
    if(text === "none"){
        button.innerText = "";
    }
    else{
        button.innerText = text;
    }
}

function generateID(){  //used to generate the ID
    let ID = Math.floor(Math.random() * 100001);    //value can be from 0 - 10000 (zero to any 5 digit number)
    while (rowIDs.includes(ID)){       //if ID already exists in rowIDs, generate a new one
        ID = Math.floor(Math.random * 100001);
    }
    rowIDs.push(ID);    //adding the unique ID to the rowIDs array so it can't be used again
    return ID;  //return the value of the ID
}

function removeRow(ID) {
    document.getElementById(ID).remove();
    if(rowIDs.includes(ID))
        rowIDs.splice(rowIDs.indexOf(ID), 1);   //if the ID exists in rowIDs, then remove it from the array
}

window.onclick = function(event) {
    //if the user clicks on anything other than add button or search bar
    if (!event.target.matches("#search")) {
        unshowDrop(event, event.target.classList.contains("dropBtn"));
    }
}

function unshowDrop(event, dropBtnClicked){
    let dropdowns = document.querySelectorAll(".show");    //get all shown menus
        for (let i = 0; i < dropdowns.length; i++){
            if(!dropBtnClicked || !(dropdowns[i].id === event.target.id) || !dropdowns[i].classList.contains(event.target.className.substring(8))){
                dropdowns[i].classList.remove("show");  //remove all except for the one clicked
            }
        }
}