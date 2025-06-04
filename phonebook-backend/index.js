require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const app = express()

// Token personalizado para mostrar o body apenas em requisições POST
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})  

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))
app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
  
app.use(requestLogger)  

let persons = [
    { 
        id: "1",
        name: "Arto Hellas", 
        number: "040-123456"
    },
    { 
        id: "2",
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    },
    { 
        id: "3",
        name: "Dan Abramov", 
        number: "12-43-234345"
    },
    { 
        id: "4",
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
    }
]

// GET mostra todas as pessoas
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
})

// GET mostra uma pessoa específica pelo id
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
      .then(person => {
        if (person) {
          res.json(person)
        } else {
          res.status(404).send({ error: 'Person not found' })
        }
      })
      .catch(error => next(error)) // isso dispara o middleware de erro
})

// GET info da página
app.get('/info', (request, response) => {
    const count = persons.length
    const date = new Date()
    const html = `
        <div>
            <p>Phonebook has info for ${count} people</p>
            <p>${date}</p>
        </div>
    `
    response.send(html)
})

// DELETE pessoa pelo id
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(204).end()
      })
      .catch(error => next(error))
})  

// POST nova pessoa à lista de contatos
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    // Estrutura do person a ser criado
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            response.status(201).json(savedPerson)
        })
        .catch(error => next(error)) // aqui virá o ValidationError
})

const path = require('path')

// Serve o index.html para qualquer rota que não seja API
app.use((req, res) => {
    res.status(404).send('Not found')
})

// Middleware de rota desconhecida
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)  

// Middleware para erros
const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'Malformatted ID' })
    }
  
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    }
  
    next(error)
  }
app.use(errorHandler)  

// Porta de escuta do método http
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})