const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')


const app = express()
app.use(bodyParser.json())
morgan.token('id', function getId(req) {
  return req.id
})
app.use(morgan(':id :method :url :response-time :res[header]'))
app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    "name": "Arto heigas",
    "number": "789234",
    "id": 1
  },
  {
    "name": "second contact",
    "number": "789",
    "id": 2
  },
  {
    "name": "Tthird contact",
    "number": "89e8",
    "id": 3
  }
]

const url = `mongodb+srv://fullstack:fullstack@cluster0-j7vjs.mongodb.net/phone-book-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: Number,
})
const Contact = mongoose.model('Contact', phoneBookSchema)

phoneBookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


app.get('/api', (req, res) => {
  res.send(`<h1>Phone book has info for ${persons.length} people</h1> <br/> ${new Date().toString()}`)
})

// get persons
app.get('/api/persons', (req, res) => {
  Contact.find({}).then(persons => {
    res.json(persons.map(note => note.toJSON()))
  })
})

// generate id
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(person => person.id))
    : 0
  return maxId + 1
}

// add person
app.post('/api/persons', (req, res) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
    id: generateId()
  }
  if (persons.find(person => person.name === req.body.name)) {
    return res.status(404).send({ error: 'name must be unique' })

  } else if (!person.name || !person.number) {
    return res.status(404).send({ error: "name or number missing" })
  }

  persons = persons.concat(person)
  res.json(person)

})

// get single person
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id == id)
  if (!person) {
    res.status(404).send('404 error, req cant found')
  }
  res.json(person)
})

//delete person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server is running on ${PORT}......`))

