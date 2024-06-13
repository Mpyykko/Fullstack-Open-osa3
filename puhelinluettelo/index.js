const express = require('express')
const app = express()

const morgan = require('morgan')


let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323532"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234-345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  },
  {
    id: 5,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
  
]



app.use(express.json())

// morgan

morgan.token('post-data', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))



app.get('/', (request, response) => {
  response.send('<h1>Puhelinluettelo</h1>')
  console.log(`Server running on port ${PORT}`)
})



app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const generateId = () => {
  return Math.floor(Math.random() * 10000)

}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ error: 'name already in list' })
  }



  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    console.log('x')
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


/// infosivu
app.get('/info', (request, response) => {
  const now = new Date()
  const infoPage = `
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${now}</p>
    </div>
  `
  response.send(infoPage)
})

/// etsitään id:llä
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)

  } else {
    response.status(404).json({ error: 'Not found' })
  }

})






const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})