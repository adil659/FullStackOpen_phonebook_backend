require('dotenv').config()
const express = require('express');
const { request } = require('express');
var bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()



let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
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

morgan.token('body', function getBody(req) {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    console.log("update: ", body)
    console.log("id: ", req.params.id)
    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res) => {

    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        }
        else {
            res.status(404).end()
        }
    }).catch(error => next(error))

})



app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
    })
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (body["name"] == undefined || body["number"] == undefined) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    else if (persons.find((pers) => pers.number == body.number)) {
        return res.status(400).json({
            error: 'Phone number already exists'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(saveAndFormattedPerson => {
        res.json(saveAndFormattedPerson)
    })
    .catch(error => next(error))
})


app.get('/api/info', (req, res) => {
    Person.find({}).then(result => {
        res.send(`<h1>Phonebook has info for ${result.length} people</h1>
    <br>
    ${new Date}`)
    })
    
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})