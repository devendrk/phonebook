const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const Contact = require('./contact')

const app = express()
app.use(bodyParser.json())
morgan.token('id', function getId(req) {
  return req.id
})
app.use(morgan(':id :method :url :response-time :res[header]'))
app.use(cors())
app.use(express.static('build'))

// add person
app.post('/api/persons', async (req, res) => {
  const contact = new Contact(req.body)
  try {
    await contact.save()
    res.status(201).send(contact)
  } catch (error) {
    res.status(400).send(error)
  }
})

// get persons
app.get('/api/persons', async (req, res) => {
  try {
    const persons = await Contact.find({})
    res.send(persons)
  } catch (error) {
    res.status(500).send()
  }
})

// get single person
app.get('/api/persons/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const contact = await Contact.findById(_id)
    // if (!contact) {
    //   return res.status(404).send()
    // }
    res.send(contact)
  } catch (error) {
    res.status(500).send()
  }
})

// update person
app.patch('/api/persons/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'number']
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))
  if (!isValidOperation) {
    return res.status(404).send('not valid operation')
  }
  try {
    console.log('patch', req.params.id, 'body', req.body)
    const updatePerson = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    console.log(updatePerson)
    if (!updatePerson) {
      res.status(404).send('bad request')
    }
    res.send(updatePerson)
  } catch (error) {
    res.status(500).send(error)
  }
})

//delete person
app.delete('/api/persons/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const deletedContact = await Contact.findByIdAndDelete(_id)
    const contacts = await Contact.find({})
    res.send(contacts)
  } catch (error) {
    res.status(500).send()
  }
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`server is running on ${port}......`))

