const mongoose = require('mongoose')

// Verifica se a senha foi dada:
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://phonebook:${password}@clusterphonebook.i2r80st.mongodb.net/?retryWrites=true&w=majority&appName=ClusterPhonebook`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    // Apenas a senha foi passada: listar pessoas
    Person.find({}).then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    // Senha, nome e número foram passados: adicionar nova pessoa
    const person = new Person({
      name: name,
      number: number
    })
  
    person.save().then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
} else {
    console.log('Usage:\n  node mongo.js <password> [name] [number]')
    mongoose.connection.close()
}