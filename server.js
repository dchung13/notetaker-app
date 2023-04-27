const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();


//middleware management
app.use(express.json());

app.use(express.static('public'));

//GET route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        err ? console.error(err) : res.json(JSON.parse(data));
    })
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received`)

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid()
        }

        fs.readFile('./db/db.json', 'utf8', (err, data) =>{
            if (err) {
                console.error(err);
            } else {
                let parsedData = JSON.parse(data);
                parsedData.push(newNote);
                fs.writeFile('./db/db.json', JSON.stringify(parsedData, null, 2), (err) => {
                    err ? console.error(err) : console.info('\nData written to /db/db.json');
                }
            )
            res.send('Note added successfully!')}
        })
    } else {
        res.send('Error adding note.')
    }
});

app.delete('/api/notes', (req, res) => {
    res.json('DELETE route');
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});