// The application should have a db.json file on the back end.
// This will be used to store and retrieve notes using the fs module.
//require express.js to start building the server
// server.js connects the back end to front end. Focus on routes. 
const express = require('express');
const { v4: uuid } = require('uuid');
let server = require('http').Server(app);
// Require fs module. This will help store and retrieve data, or the notes. API for working with files and directories.
const fs = require('fs');
const fileName = './db/db.json'
const path = require("path") //  Path module defines utility functions for working with file and directory names
const app = express();
const PORT = process.env.PORT || 3000;

// express() is being utilized here via app.use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET/api/notes should read the db.json file with readFile and return all saved notes as JSON.
// wait for the file to load before we return a response, or data in this function.
async function readFile() {
    try {
        const jsonString = await fs.promises.readFile(fileName, 'utf-8');
        const data = JSON.parse(jsonString);
        console.log("readFile executed");
        return data;
    } catch (err) {
        console.log('Error reading file:', err);
        throw err;
    }
};


// GET /notes should return the notes.html file.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// GET * should return the index.html file.
// any non-existent route returns GET *, the 'wildcard' route.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// GET/api/notes should read the db.json file with readFile and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    // We invoke readFile, and then we use .then chaining to await similarly to the async function.
    readFile()
        .then((notes) => {
            res.json(notes);
        })
        .catch((err) => {
            // Handle the error if the file reading fails
            console.log(err);
            res.status(500).json({ error: 'Failed to read notes' });
        });
});


// POST /api/notes. Posting new data, or notes, to the server, or the request body, 
// add it to the db.json file, and then return the new note to the client. 
app.post('/api/notes', (req, res) => {
    // request data
    const title = req.body.title;
    const text = req.body.text;
    const id = uuid();
    if (title && text) {
        const newObject = {
            "title": title,
            "text": text,
            "id": id
        };

        fs.readFile(fileName, 'utf-8', (error, data) => {
            if (error) {
                console.log("Error: Could not read file");
            } else {
                // parse the JSON into the array in newObject
                data = JSON.parse(data);
                data.push(newObject);
                data = JSON.stringify(data);
                fs.promises.writeFile(fileName, data).then((error, newNote) => {
                    if (error) {
                        res.status(500).json(error);
                    }
                    else {
                        res.status(200).json(newNote);
                    }
                });
            }
        })
    }
});


// express.js library continues to be used.
// app.listen
server.listen(PORT, () => {
    console.log(`Express server listening. App is running on port: http://localhost:${PORT}`)
});


