const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> <name> <number>')
  process.exit(1)
}



const url =
'mongodb+srv://fullstack:adil1234@phonebookcluster.13ghu.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log( 'Database Connected' ))
  .catch(err => console.log( err ))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)



if (process.argv.length > 3) {
  const name = process.argv[3]
  const number = process.argv[4]
  console.log(`adding ${name} number ${number} to phonebook!`)
  const person = new Person({
    name: name,
    number: number
  })
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook!`)
    mongoose.connection.close()
  }).catch(err => {
    console.log(err)
  })
}

else {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

