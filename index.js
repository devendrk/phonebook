const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())


const persons = [

  {
    name: "Arto Hellas",
    number: "040-120003",
    id: 1
  },
  {
    name: "devnedra",
    number: "040-145003",
    id: 2
  },
  {
    name: "Nishan T",
    number: "040-000003",
    id: 3
  },
  {
    name: "GOlden R",
    number: "040-1299",
    id: 4
  }
]

//  get info page
app.get('/info', (req, res) => {
  console.log('len', req.length, typeof lrn)
  const textt = `<h1> Helow Fuckers fuck oup</h1>`
  res.send(textt)
})

//  get list of persons
app.get('/api/persons/', (req, res) => {
  res.send(persons)
})

// get individual person by its unique id
app.get('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const person = persons.find(note => note.id === id)

  // if data doesnot exists it will give 404 not fund status else response with requested id 
  if (person) {
    res.json(person)
  } else {
    res.status(404).send('person with id ' + id + 'doesnot exist yet !!')
  }
})

// generate random id
const generateId = () => {
  const randomId = persons.length > 0
    ? Math.floor(Math.random() * persons.length * 50)
    : 1
  return randomId
}
//create new person data
app.post('/persons', (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return Response.status(400).json({
      error: 'name or number is missing'
    })
  }
  else if (body.name === (persons.map(person => person))) {
    return Response.status(400).json({
      error: 'name already exist'
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons.concat(person)

  res.json(person)
})


// deleting person by its id 
app.delete('/persons/:id', (req, res) => {
  const id = req.params.id
  persons.filter(person => person.id !== id)
  console.log('delete', persons)
  req.status.end()
})

const PORT = 5001
app.listen(PORT)
console.log('server is running on port ...' + PORT)