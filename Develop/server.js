// The application should have a db.json file on the back end.
// This will be used to store and retrieve notes using the fs module.
//require express.js to start building the server
// server.js connects the back end to front end. Focus on routes. 
const express = require('express')
// Require fs module. This will help store and retrieve data, or the notes.
const fs = require('fs');
const path = require("path")
// Run express inside app to use it. 
const app = express();
// This is the port number that will appear alongside localhost.
const PORT = 3000;

// express() is being utilized here via app.use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET /notes should return the notes.html file.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// GET * should return the index.html file.
// any non-existent route returns GET * which acts like a wildcard route.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// GET/api/notes should read the db.json file with readFile and return all saved notes as JSON.

fs.readFile('./db/db.json', 'utf-8', (err, jsonString) => {
    if (err) {
        console.log(err);
    } else {
        // Catches improperly formatted JSON.
        try {
            const data = JSON.parse(jsonString);
            console.log(jsonString);
        } catch (err) {
            console.log('Error parsing JSON', err);
        }
    }

});

const newObject = [{
    "title": "Title goes here",
    "text": "Text goes here",
    "id": 0
}];

// JSON.stringify overwrites what we have.
fs.writeFile('./db.json', JSON.stringify(newObject, null, 2), err => {
    if (err) {
        console.log(err);
    } else {
        console.log('File was successfully written');
    }
});

// POST /api/notes. Posting new data, or notes, to the server, or the request body, 
// add it to the db.json file, and then return the new note to the client. 
// You'll need to find a way to give each note a unique id when it's saved.
// (look into npm packages that could do this for you).
app.post('./api/notes', (req, res) => {
    req.sendFile(path.join(__dirname, './Develop/db/db.json'))
});



// express.js library continues to be used. Documentation online.
app.listen(PORT, () => {
    console.log(`Express server listening. PORT running on http://localhost:${PORT}`)
});

// keep working
// deploy to heroku
