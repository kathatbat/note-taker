const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

app.use(express.static(path.join(__dirname, 'develop')));
app.use(express.json());

const dbFilePath = path.join(__dirname, 'db.json');
let notes = [];

if (fs.existsSync(dbFilePath)) {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading db.json:', err);
            return;
        }
        try {
            notes = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing db.json:', error);
        }
    });
} else {
    console.error('Error: db.json file not found.');
}

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'develop/public/js', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    notes.push(newNote);
    fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
        if (err) {
            console.error('Error writing to db.json:', err);
        }
    });

    res.json(newNote);
});

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const getNotes = () =>
  fetch(`http://localhost:${PORT}/api/notes`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
  });

const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

const renderNoteList = async () => {
  if (typeof window !== 'undefined' && window.location.pathname === '/notes') {
    let jsonNotes = await getNotes().then(response => response.json());
    noteList.forEach((el) => (el.innerHTML = ''));
    let noteListItems = [];

    const createLi = (text, delBtn = true) => {
      const liEl = document.createElement('li');
      liEl.classList.add('list-group-item');

      const spanEl = document.createElement('span');
      spanEl.classList.add('list-item-title');
      spanEl.innerText = text;
      spanEl.addEventListener('click', handleNoteView);

      liEl.append(spanEl);

      if (delBtn) {
        const delBtnEl = document.createElement('i');
        delBtnEl.classList.add(
          'fas',
          'fa-trash-alt',
          'float-right',
          'text-danger',
          'delete-note'
        );
        delBtnEl.addEventListener('click', handleNoteDelete);

        liEl.append(delBtnEl);
      }

      return liEl;
    };

    if (jsonNotes.length === 0) {
      noteListItems.push(createLi('No saved Notes', false));
    }

    jsonNotes.forEach((note) => {
      const li = createLi(note.title);
      li.dataset.note = JSON.stringify(note);

      noteListItems.push(li);
    });

    if (window.location.pathname === '/notes') {
      noteListItems.forEach((note) => noteList[0].append(note));
    }
  }
};

const getAndRenderNotes = () => renderNoteList();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

getAndRenderNotes();
