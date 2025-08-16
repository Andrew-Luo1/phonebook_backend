const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('combined'))

let phoneBook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/info', (request, response) => {
    console.log('GET request made...')
    today = new Date()
    response.setHeader('Content-Type', 'text/plain')
    response.send(`Phonebook has info for ${phoneBook.length} people. \n${today.toString()}`)
})

app.get('/api/persons', (request, response) => {
    response.json(phoneBook)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    person = phoneBook.find(person => person.id===id)
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    // Check 1: is the name or number missing?
    if(!body.name || !body.number){
        response.status(400).json({'error': 'content missing'})
    }
    else if(phoneBook.find(person => person.name==body.name)){
        response.status(400).json({'error': 'name already there'})
    }
    else{
        body.id = Math.floor(Math.random()*100000)
        phoneBook = phoneBook.concat(body)
        console.log(body)
        response.status(201)
        response.json(body)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const deletedPerson = phoneBook.find(person=>person.id === id)
    phoneBook = phoneBook.filter(person=>person.id != id)
    response.status(200)
    console.log("hi")
    response.json(deletedPerson)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
