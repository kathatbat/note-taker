let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let clearBtn;
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
        saveNoteBtn = document.querySelector('.save-note');
        newNoteBtn = document.querySelector('.new-note');
        clearBtn = document.querySelector('.clear-btn');
        noteForm = document.querySelector('.note-form');
        noteList = document.querySelectorAll('.list-container .list-group');

        saveNoteBtn.addEventListener('click', handleNoteSave);
        newNoteBtn.addEventListener('click', handleNewNoteView);
        clearBtn.addEventListener('click', renderActiveNote);
        noteForm.addEventListener('input', handleRenderBtns);
    }
    getAndRenderNotes();
});

const getAndRenderNotes = () => getNotes().then(renderNoteList);

const handleNoteSave = () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value,
    };
    saveNote(newNote).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  const handleNewNoteView = (e) => {
    activeNote = {};
    show(clearBtn);
    renderActiveNote();
  };
  
  const handleRenderBtns = () => {
    show(clearBtn);
    if (!noteTitle.value.trim() && !noteText.value.trim()) {
      hide(clearBtn);
    } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
      hide(saveNoteBtn);
    } else {
      show(saveNoteBtn);
    }
  };

  const renderActiveNote = () => {
    hide(saveNoteBtn);
    hide(clearBtn);
  
    if (activeNote.id) {
      show(newNoteBtn);
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
    } else {
      hide(newNoteBtn);
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = '';
      noteText.value = '';
    }
  };