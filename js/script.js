if ('serviceWorker' in navigator){
    // registering serviceWorker
    navigator.serviceWorker.register('service-worker.js');
}


let count = Number(window.localStorage.getItem('count'));
if (!count){
    window.localStorage.setItem('count', 0);
}
function removeNote(e){
    if (confirm('Are you sure you want to delete this note?')){
        
        let clickedButton = e.srcElement;
        
        let noteKeyForRemoval = clickedButton.previousElementSibling.textContent;
        console.log("[-]Removed ", noteKeyForRemoval, ": ", window.localStorage.getItem(noteKeyForRemoval));
        document.querySelector('#notes').removeChild(clickedButton.parentElement.parentElement);
        window.localStorage.removeItem(noteKeyForRemoval);
        count -= 1;
        window.localStorage.setItem('count', count);
    }

    if (Number(window.localStorage.getItem('count')) <= 0){
        document.querySelector('#no-notes').className = '';
    }

    if (Number(window.localStorage.getItem('count')) < 2){
        removeClearAllNotesButton();
    }
    
    };

let removeClearAllNotesButton = () => {
    let myButton = document.querySelector('#clear-all-button');
    myButton.parentElement.removeChild(myButton);
};

function removeAllNotesFromStorage(){
    
    let allNotes = document.querySelector('#notes');
    while (allNotes.firstChild){
        allNotes.removeChild(allNotes.lastChild);
    }
    window.localStorage.clear();
    count = 0;
    removeClearAllNotesButton();
    document.querySelector('#no-notes').className = '';
    // window.localStorage.setItem('count', 0);
}
let createClearAllNotesButton = () => {
    let clearAllButton = document.createElement('button');
    
    let clearAllText = document.createTextNode('Delete all notes');
    
    clearAllButton.setAttribute('class', 'btn');
    clearAllButton.setAttribute('id', 'clear-all-button');
    clearAllButton.appendChild(clearAllText);
    document.querySelector('#inputForm').appendChild(clearAllButton);
    document.querySelector('#clear-all-button').addEventListener('click', removeAllNotesFromStorage);
};


if(count > 1){
    createClearAllNotesButton();
}


function addListenersToButtons(){   
    let allDeleteButtons = document.getElementsByClassName('delete');
    for (let i=0; i<allDeleteButtons.length; i++){
        allDeleteButtons[i].addEventListener('click', removeNote);
    }
}



let createNewNoteFromDetails = (noteTitle) => {
    
    document.querySelector('#no-notes').className = 'hidden';
    
    
    let li = document.createElement('li');
    let a = document.createElement('a');
    let h2 = document.createElement('h2');
    let button = document.createElement('button');
    let p = document.createElement('p');
    
    a.setAttribute('href', '#');
    button.setAttribute('class', 'delete');
    
    let titleTextNode = document.createTextNode(noteTitle);
    let buttonTextNode = document.createTextNode('X');
    
    let noteContent = window.localStorage.getItem(noteTitle);
    let contentTextNode = document.createTextNode(noteContent);
    
    h2.appendChild(titleTextNode);
    p.appendChild(contentTextNode);
    button.appendChild(buttonTextNode);
    
    a.appendChild(h2);
    a.appendChild(button);
    a.appendChild(p);
    
    li.appendChild(a);
    
    document.querySelector('#notes').appendChild(li);
    addListenersToButtons();
};

let getProcessInputForNewNote = (e) => {
    e.preventDefault(); // prevents default action from taking place    
    
    noteTitle = document.getElementById('new-note-title-input').value;
    noteContentBody = document.getElementById('new-note-body-input').value;
    
    let titleCount = 0
    while(window.localStorage.getItem(noteTitle)){
        // handling duplicate note titles since local storage can have only unique keys
        ++titleCount;
        noteTitle = document.getElementById('new-note-title-input').value + `-${titleCount.toString()}`;
    } 
    document.getElementById('new-note-title-input').value = "";
    document.getElementById('new-note-body-input').value = "";
    window.localStorage.setItem(noteTitle, noteContentBody); //storing the Note in local storage
    console.log("Title: ", noteTitle, ", Body: ", noteContentBody);
    window.localStorage.setItem('count', ++count); //storing the Note in local storage
    if (Number(window.localStorage.getItem('count')) > 1 && !document.querySelector('#clear-all-button')){
        createClearAllNotesButton();
    }
    createNewNoteFromDetails(noteTitle);
    
};


let showAllNotesIfPresent = () => {
    if (window.localStorage.length > 1){
        for (let l=0; l<window.localStorage.length; l++){
            if(window.localStorage.key(l) != 'count'){
                let currentKey = window.localStorage.key(l);
                createNewNoteFromDetails(currentKey);
            }
        }
    }
};

showAllNotesIfPresent();

document
.getElementById('inputForm')
.addEventListener('submit', getProcessInputForNewNote, false);

addListenersToButtons();

