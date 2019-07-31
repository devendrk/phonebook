const mongoose = require('mongoose')

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

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Contact = mongoose.model('contacts', contactSchema)

module.exports = Contact