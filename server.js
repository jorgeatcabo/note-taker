// Dependencies

const express = require("express")
const path = require("path")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")
//app.use(express.static('public'));

// Sets up the Express App

const app = express()
const PORT = process.env.PORT || 3000

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

// Routes

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
)

// // Displays all characters
app.get("/api/notes", (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8")
    res.json(data)
    console.log(data)
  } catch (err) {
    console.error(err)
  }
})

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
)

// // Displays a single character, or returns false
// app.get('/api/characters/:character', (req, res) => {
//   const chosen = req.params.character;

//   console.log(chosen);

//   /* Check each character routeName and see if the same as "chosen"
//    If the statement is true, send the character back as JSON,
//    otherwise tell the user no character was found */

//   for (let i = 0; i < characters.length; i++) {
//     if (chosen === characters[i].routeName) {
//       return res.json(characters[i]);
//     }
//   }

//   return res.json(false);
// });

// // Create New Note - takes in JSON input
app.post("/api/notes", (req, res) => {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  const newNote = req.body

  try {
    let rawdata = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8")
    let noteArray = JSON.parse(rawdata)
     //uuidv4()
    noteArray.push(newNote)
    
   
    const fileDb = path.join(__dirname, "/db/db.json")
    fs.writeFileSync(fileDb, JSON.stringify(noteArray))
    //console.log(newNote)
    res.json(newNote);
  } catch (err) {
    console.error(err)
  }

  // push changes to your array
  // productArray ['product'].push({ any thing you want to add })
})

// Starts the server to begin listening

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`))
