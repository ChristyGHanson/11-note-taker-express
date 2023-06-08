//require express.js to start building the server
// server.js connect back end to front end. 
// the focus is routes for challenge 11.
const express = require('express')
const path = require("path")
// Run express here to use it. store it in app variable.
const app = express();
// this is the port number that i want to appear alongside localhost
const PORT = 3000;

// boilerplate template code 
// express() is being used here via app.use, etc. 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// GET *
// any non-existent route returns GET * which acts like a wildcard route.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// express.js library continues to be used. Documentation online.
app.listen(PORT, () => {
    console.log("PORT running on http://localhost:" + PORT)
})

// keep working
// deploy to heroku
