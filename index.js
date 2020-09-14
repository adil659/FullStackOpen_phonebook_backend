const express = require('express');
const { request } = require('express');
var bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Adil",
        "number": "56",
        "id": 5
    },
    {
        "name": "guy",
        "number": "2342",
        "id": 6
    }
]

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

morgan.token('body', function getBody (req) {
    return JSON.stringify(req.body)
  })

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const deleted = persons.filter(person => person.id != id)
    persons = deleted

    if (deleted) {
        res.json(persons)
    }
    else {
        res.status(404).end()
    }

})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id == id)
    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }

})



app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    if (person["name"] == undefined  || person["number"] == undefined) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    else if (persons.find((pers) => pers.number == person.number)) {
        return res.status(400).json({
            error: 'Phone number already exists'
        })
    }
    person['id'] = Math.floor(Math.random() * 10000)
    console.log(person)
    persons.push(person)
    res.json(person)
})


app.get('/api/info', (req, res) => {
    res.send(`<h1>Phonebook has info for ${persons.length} people</h1>
    <br>
    ${new Date}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})