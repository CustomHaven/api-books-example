const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {pool} = require('./config')
const morgan = require('morgan')
const PORT = process.env.PORT || 3002;

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('dev'))

const getBooks = (request, response) => {
  pool.query('SELECT * FROM books', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addBook = (request, response) => {
  const {author, title} = request.body

  pool.query(
    'INSERT INTO books (author, title) VALUES ($1, $2)',
    [author, title],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({status: 'success', message: 'Book added.'})
    },
  )
}

app
  .route('/books')
  // GET endpoint
  .get(getBooks)
  // POST endpoint
  .post(addBook)

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})