const mongoose = require('mongoose')

const dbName = 'phone-book-api'
const url =
  `mongodb+srv://fullstack:fullstack@cluster0-j7vjs.mongodb.net/phone-book-app?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true // creates index in db 
})

const Contact = mongoose.model('contacts', {
  name: {
    type: String,
    required: true,
    trim: true,
    lowerCase: true
  },
  number: {
    type: Number,
    required: true,
    trim: true
  }
})

module.exports = Contact