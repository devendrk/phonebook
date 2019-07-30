const mongoose = require('mongoose')

const dbName = 'phone-book-api'
const url = process.env.MONGODB_URI
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