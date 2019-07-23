const express = require('express')
const morgan = require('morgan')

const app = express()


const bodyParser = require('body-parser')

app.use(bodyParser.json())

morgan.token('id', function getId(req) {
  return req.id
})

app.use(morgan(':id :method :url :response-time :res[header]'))

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

app.get('/', (req, res) => {
  res.send(`<h1>Phone book has info for ${persons.length} people</h1> <br/> ${new Date().toString()}`)
})

// get persons
app.get('/persons', (req, res) => {
  res.json(persons)
})

// generate id
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(person => person.id))
    : 0
  return maxId + 1
}

// add person
app.post('/persons', (req, res) => {

  const person = {
    name: req.body.name,
    number: req.body.number,
    id: generateId()
  }
  console.log(person)
  if (persons.find(person => person.name === req.body.name)) {
    return res.status(404).send({ error: 'name must be unique' })

  } else if (!person.name || !person.number) {
    return res.status(404).send({ error: "name or number missing" })
  }

  persons = persons.concat(person)

  res.json(person)

})

// get single person
app.get('/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id == id)
  if (!person) {
    res.status(404).send('404 error, req cant found')
  }
  res.json(person)
})


//delete person
app.delete('/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const PORT = 5000
app.listen(PORT, () => console.log(`server is running on ${PORT}......`))













// const express = require('express')
// const cors = require('cors')
// // const morgan = require('morgan')
// // app.use(morgan())


// const app = express()

// app.use(express.json())
// app.use(cors())
// app.use(express.static('build'))



// app.get('/', (req, res) => res.send('<h1>Hello World!............!</h1>'))

// app.get('/persons', (req, res) => res.send(phonebook))

// app.get('/persons/:id', (req, res) => {
//   const contact = phonebook.find(c => c.id === parseInt(req.params.id))
//   if (!contact) {
//     res.status(404).send('requested phone book is not available ')
//   }
//   res.send(contact)
// })

// // generate random id
// const generateId = () => {
//   const randomId = Math.floor(Math.random() * phonebook.length * 50)
//   return randomId
// }


// // Add new contact
// app.post('/persons', (req, res) => {

//   const contact = {
//     name: req.body.name,
//     number: req.body.number,
//     id: generateId()
//   }

//   if (phonebook.find(contact => contact.name === req.body.name)) {
//     return res.status(404).send({ error: 'name must be unique' })
//   } else if (!contact.name || !contact.number) {
//     return res.status(404).send({ error: "name or number missing" })
//   }

//   // updates database
//   phonebook.push(contact);

//   // send updated response to the client
//   res.send(contact)
// })

// // Delete contact
// app.delete('/persons/:id', (req, res) => {
//   const deleteItem = phonebook.find(item => item.id === parseInt(req.params.id))
//   if (!deleteItem) {
//     res.status(404).send({ error: "contact with the id you requestd ,do not exist or already deleted" })
//   }
//   const index = phonebook.indexOf(deleteItem)
//   phonebook.splice(index, 1)
//   res.send(deleteItem)
// })

// // get info
// app.get('persons/info', (req, res) => {
//   const contactLength = phonebook.length
//   const timeDate = new Date();
//   res.send('phoneBook has info for ' + contactLength + ' people' + '</br>' + timeDate)
// })

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Our app is running on port...${PORT}`);
// });