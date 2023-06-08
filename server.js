const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const fs = require('fs');

const app = express();

const PORT = 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        res.json(data);
    })
});

app.post('/api/notes', (req, res) => {
    // Log that a post request was recieved
    console.log('POST request recieved to add a note.')
    // Destructuring the information in the req body
    const { title, text } = req.body;
    // Checking to see if the info is there
    if (title && text) {
        // Creating the note object to hold the information
        const note = {
            title,
            text
        }
        // Reading the info contained in the file
        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.log(err)
            } else {
                // Parsing the data so that we can push to the array
                const parsedNotes = JSON.parse(data)
                parsedNotes.push(note)
                // Writing to the file and stringifying the info back into a JSON object
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), (err) => {
                    // Returns the note added to the file to the user
                    console.log(note);
                    // Logs the error if there is one otherwise sends confirmation to the client
                    err ? console.log(err) : console.log('Success! Note was written to file.')})
            }

    })} else {
        res.json('error in posting note')
    }
});

app.listen(PORT, () => {
    console.log(`The server is up and running at http://localhost:${PORT}`);
});