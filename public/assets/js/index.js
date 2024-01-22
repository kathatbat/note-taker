let notes = [];

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

const handleNoteDelete = (event) => {
    event.stopPropagation();
  
    const listItem = event.target.closest('li');
  
    if (listItem) {
    const noteData = JSON.parse(listItem.dataset.note);
  
    if (noteData && noteData.title) {
    fetch(`/api/notes/${noteData.id}`, {
    method: 'DELETE',
    headers: {
    'Content-Type': 'application/json',
    },
    })
    .then(response => {
    if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
    }
    listItem.remove();
    })
    .catch(error => {
      console.error('Error deleting note:', error);
    });
    } else {
      console.error('Invalid note data:', noteData);
    }
  }
};  
  
  const deleteBtns = document.querySelectorAll('.delete-note');
  deleteBtns.forEach(btn => {
      btn.addEventListener('click', handleNoteDelete);
  });
  
    const renderNoteList = (notes) => {
      noteList.innerHTML = '';
  
      if (notes.length === 0) {
          const noNotes = document.createElement('li');
          noNotes.classList.add('list-group-item');
          noNotes.innerText = 'No saved notes';
          noteList.appendChild(noNotes);
      } else {
          notes.forEach((note) => {
              const li = document.createElement('li');
              li.classList.add('list-group-item');
              li.dataset.note = JSON.stringify(note.title);
  
              const span = document.createElement('span');
              span.classList.add('list-item-title');
              span.innerText = note.title;
              span.addEventListener('click', handleNewNoteView);
  
              li.appendChild(span);
  
              const deleteBtn = document.createElement('i');
              deleteBtn.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
              deleteBtn.addEventListener('click', handleNoteDelete);
  
              li.appendChild(deleteBtn);
  
              noteList.appendChild(li);
          });
      }
  };
  
  const getAndRenderNotes = () => {
    getNotes()
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(notes => {
            if (Array.isArray(notes)) {
                renderNoteList(notes);
            } else {
                console.error('Invalid response format. Expected an array of notes.');
            }
        })
        .catch(error => {
            console.error('Error fetching notes:', error);
        });
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/notes') {
        saveNoteBtn = document.querySelector('.save-note');
        newNoteBtn = document.querySelector('.new-note');
        clearBtn = document.querySelector('.clear-btn');
        noteForm = document.querySelector('.note-form');
        noteList = document.querySelector('.list-container .list-group');
        const deleteBtns = document.querySelectorAll('.icons');
        deleteBtns.forEach(btn => {
        btn.addEventListener('click', handleNoteDelete);
        });
        // deleteBtns = document.querySelector('.icons');
        // deleteBtns.addEventListener('click', handleNoteDelete);
        noteTitle = document.querySelector('.note-title');
        noteText = document.querySelector('.note-textarea');
        saveNoteBtn.addEventListener('click', handleNoteSave);
        newNoteBtn.addEventListener('click', handleNewNoteView);
        clearBtn.addEventListener('click', renderActiveNote);
        noteForm.addEventListener('input', handleRenderBtns);
    }
    getAndRenderNotes();
});

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };

  saveNote(newNote)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response();
    })
    .then(savedNote => {
      console.log('Saved note:', savedNote);

      if (savedNote && savedNote.id) {
        getAndRenderNotes();
        renderActiveNote();
      } else {
        console.error('Invalid response format. Expected an object with an "id" property.');
      }
    })
    .catch(error => {
      console.error('Error saving note:', error);
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