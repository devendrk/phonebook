
const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())
app.use(cors())

const phonebook = [
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

app.get('/', (req, res) => res.send('Hello World!............!'))

app.get('/persons', (req, res) => res.send(phonebook))

app.get('/persons/:id', (req, res) => {
  const contact = phonebook.find(c => c.id === parseInt(req.params.id))
  if (!contact) {
    res.status(404).send('requested phone book is not available ')
  }
  res.send(contact)
})


// generate random id
const generateId = (phonebook) => {
  const randomId = Math.floor(Math.random() * phonebook.length * 50)
  return randomId
}

// Add new contact
app.post('/persons', (req, res) => {

  const contact = {
    name: req.body.name,
    number: req.body.number,
    id: generateId(phonebook)
  }

  if (phonebook.find(contact => contact.name === req.body.name)) {
    return res.status(404).send({ error: 'name must be unique' })
  } else if (!contact.name || !contact.number) {
    return res.status(404).send({ error: "name or number missing" })
  }

  // updates database
  phonebook.push(contact);

  // send updated response to the client
  res.send(contact)
})

// Delete contact
app.delete('/persons:id', (req, res) => {
  const deleteItem = phonebook.find(item => item.id === parseInt(req.params.id))
  if (!deleteItem) {
    res.status(404).send({ error: "contact with the id you requestd ,do not exist or already deleted" })
  }
  const index = phonebook.indexOf(deleteItem)
  phonebook.splice(index, 1)
  res.send(deleteItem)
})

// get info
app.get('/info', (req, res) => {
  const contactLength = phonebook.length
  const timeDate = new Date();
  res.send('phoneBook has info for ' + contactLength + ' people' + '</br>' + timeDate)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))