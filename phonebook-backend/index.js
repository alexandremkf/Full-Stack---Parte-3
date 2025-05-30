const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Token personalizado para mostrar o body apenas em requisições POST
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})  

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

// Comentei pois estava subescrevendo o HTML criado no front-end.
// // Rota inicial simples
// app.get('/', (request, response) => {
//     response.send('<h1>Phonebook Backend</h1>')
// })

// GET mostra todas as pessoas
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// GET mostra uma pessoa específica pelo id
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).json({ error: 'Person not found' })
    }
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
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const initialLength = persons.length
    persons = persons.filter(p => p.id !== id)

    if (persons.length === initialLength) {
        return response.status(404).json({ error: 'Person not found' })
    }

    response.status(204).end()
})

// POST nova pessoa à lista de contatos
app.post('/api/persons', (request, response) => {
    const body = request.body

    // Validação: nome ou número ausentes
    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'Name and number are required' })
    }

    // Validação: nome já existe
    const nameExists = persons.some(p => p.name === body.name)
    if (nameExists) {
        return response.status(400).json({ error: 'Name must be unique' })
    }

    const person = {
        id: Math.floor(Math.random() * 1000000).toString(), // ID como string para manter padrão
        name: body.name,
        number: body.number,
    }

    persons.push(person)
    response.status(201).json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)  

// Porta de escuta do método http
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})