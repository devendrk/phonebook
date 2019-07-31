require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const Contact = require('./models/contact')

const app = express()
app.use(bodyParser.json())
morgan.token('id', function getId(req) {
  return req.id
})
app.use(morgan(':id :method :url :response-time :res[header]'))
app.use(cors())
app.use(express.static('build'))

// add person
app.post('/api/persons', async (req, res, next) => {
  const contact = new Contact(req.body)
  if (contact.name === undefined) {
    return res.status(400).json({
      error: 'name missing'
    })
  }
  try {
    await contact.save()
    res.status(201).send(contact)
  } catch (error) {
    next(error)
  }
})
// get persons
app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Contact.find({})
    res.send(persons)
  } catch (error) {
    next(error)
  }
})

// get single person
app.get('/api/persons/:id', async (req, res, next) => {
  const _id = req.params.id
  try {
    const contact = await Contact.findById(_id)
    // if (!contact) {
    //   return res.status(404).send()
    // }
    res.send(contact)
  } catch (error) {
    next(error)
  }
})

// update person
app.patch('/api/persons/:id', async (req, res, next) => {
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
    next(error)
  }
})

//delete person
app.delete('/api/persons/:id', async (req, res, next) => {
  const _id = req.params.id
  try {
    await Contact.findByIdAndDelete(_id)
    const contacts = await Contact.find({})
    res.send(contacts)
  } catch (error) {
    next(error)
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const port = process.env.PORT
app.listen(port, () => console.log(`server is running on ${port}......`))

