const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static ('public'));

const dbFilePath = path.join(__dirname, 'public', 'assets', 'js', 'db.json');

let notes = [];

if (fs.existsSync(dbFilePath)) {
    try {
        const data = fs.readFileSync(dbFilePath, 'utf8');
        notes = JSON.parse(data);
    } catch (error) {
        console.error('Error parsing db.json:', error);
    }
} else {
    console.error('Error: db.json file not found.');
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
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

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
