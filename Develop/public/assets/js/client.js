let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

const show = (elem) => {
    elem.style.display = 'inline';
};

const hide = (elem) => {
    elem.style.display = 'none';
};

let activeNote = {};

const getNotes = () =>
    fetch('/api/notes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

const saveNote = (note) =>
    fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    });


document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/notes') {
        saveNoteBtn.addEventListener('click', handleNoteSave);
        newNoteBtn.addEventListener('click', handleNewNoteView);
        clearBtn.addEventListener('click', renderActiveNote);
        noteForm.addEventListener('input', handleRenderBtns);
    }
    getAndRenderNotes();
});