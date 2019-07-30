const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-j7vjs.mongodb.net/phone-book-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Contact = mongoose.model('Contact', phoneBookSchema)

const name = process.argv[3]
const number = process.argv[4]
const contact = new Contact({
  name: name,
  number: number,
})

contact.save().then(response => {
  console.log('contact saved!')
  mongoose.connection.close()
})

// Contact.find({}).then(result => {
//   result.forEach(contact => {
//     console.log(contact)
//   })
//   mongoose.connection.close()
// })