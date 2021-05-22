// Dependencies

const express = require("express")
const path = require("path")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")

// Sets up the Express App
const app = express()
const PORT = process.env.PORT || 3000

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// Routes

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
)

// // Displays all characters
app.get("/api/notes", (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8")
    res.send(data)
  } catch (err) {
    console.error(err)
  }
})

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
)

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
)

// // Create New Note - takes in JSON input
app.post("/api/notes", (req, res) => {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  const newNote = req.body
  newNote.id=uuidv4()

  try {
    let rawdata = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8")
    let noteArray = JSON.parse(rawdata)
    let uuid=uuidv4()
    noteArray.push(newNote)

    const fileDb = path.join(__dirname, "/db/db.json")
    fs.writeFileSync(fileDb, JSON.stringify(noteArray))
    res.json(newNote)
  } catch (err) {
    console.error(err)
  }

})

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  let rawdata = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8")
  let noteArray = JSON.parse(rawdata)
  if (noteArray.length>0){
    const found =noteArray.some(note=>note.id===id)
    if (found){
      newNoteArray=noteArray.filter(note=>note.id!==id)
      const fileDb = path.join(__dirname, "/db/db.json")
      fs.writeFileSync(fileDb, JSON.stringify(newNoteArray))
      console.log(`Delete it`)
      res.json(newNoteArray)
    }
    else
    {
      console.log(`Not Found`)
      res.json(`Not Found`)
    }
  }
  else
  {
    console.log(`Data Base Empty`)
    res.json(`Data Base Empty`)
  }

});

// Starts the server to begin listening

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`))
