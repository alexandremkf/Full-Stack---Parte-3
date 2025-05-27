const http = require('http')

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

const app = http.createServer((request, response) => {
    const url = request.url

    if (url === '/info') {
        const date = new Date()
        const count = persons.length
        const htmlResponse = `
            <div>
                <p>Phonebook has info for ${count} people</p>
                <p>${date}</p>
            </div>
        `
        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.end(htmlResponse)

    } else if (url === '/api/persons') {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(persons))

    } else {
        response.writeHead(404, { 'Content-Type': 'text/plain' })
        response.end('404 Not Found')
    }
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)