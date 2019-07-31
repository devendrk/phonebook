const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    trim: true,
    unique: true,
    lowerCase: true
  },
  number: {
    type: Number,
    required: true,
    trim: true
  }
})
contactSchema.plugin(uniqueValidator)
contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Contact = mongoose.model('contacts', contactSchema)

module.exports = Contact