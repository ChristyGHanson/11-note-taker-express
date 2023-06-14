// The application should have a db.json file on the back end.
// This will be used to store and retrieve notes using the fs module.
//require express.js to start building the server
// server.js connects the back end to front end. Focus on routes. 
const express = require('express')
const uuidv4 = require('uuidv4')
// Require fs module. This will help store and retrieve data, or the notes. API for working with files and directories.
const fs = require('fs');
const fileName = './db/db.json'
const path = require("path") //  Path module defines utility functions for working with file and directory names
const app = express();
const PORT = 3000;

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
}


// GET /notes should return the notes.html file.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// GET * should return the index.html file.
// any non-existent route returns GET *, the 'wildcard' route.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
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

// JSON.stringify overwrites what we have.
// fs.writeFile('./db.json', JSON.stringify(newObject, null, 2), err => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('File was successfully written');
//     }
// });

// POST /api/notes. Posting new data, or notes, to the server, or the request body, 
// add it to the db.json file, and then return the new note to the client. 
// You'll need to find a way to give each note a unique id when it's saved.
// (look into npm packages that could do this for you).
app.post('./api/notes', (req, res) => {
    // request data
    const title = req.body.title;
    const text = req.body.text;
    if (title && text) {
        const newObject = {
            "title": title,
            "text": text,
            "id": uuidv4()
        };
        fs.readFile(fileName, 'utf-8', (error, data) => {
            if (error) {
                console.log("Error: Could not read file");
            } else {
                // parse the JSON into the array in newObject
                data = JSON.parse(data);
                data.push(newObject);
                data = JSON.stringify(data);
                fs.promises.writeFile(fileName, data, (error, data) => {
                    if (error) {
                        console.log("Error: Could not write file");
                    }
                });
            }
        })
    }
    // render
    // req.sendFile(path.join(__dirname, './Develop/db/db.json'))
});

// app.post('./api/notes', (req, res) => {
//     const newNote = req.body
//     sendFile(path.join(__dirname, newNote),
//         res.json(`${req.method} received`))
// });

// app.put - conclude the request to prevent client application from hanging indefinitely.  Methods attached to the res object let us conclude a req-res cycle.
// app.put('./api/notes/:note_id', (req, res) => {
//     // Logic to update a note
//     res.json('Note updated');
// });


// express.js library continues to be used.
app.listen(PORT, () => {
    console.log(`Express server listening. PORT running on http://localhost:${PORT}`)
});

// keep working
// deploy to heroku
