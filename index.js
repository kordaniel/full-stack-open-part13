const express             = require('express')
const app = express()
require('express-async-errors')

const { PORT }            = require('./util/config')
const {
  connectToDatabase
}                         = require('./util/db')
const { errorHandler }    = require('./util/middleware')

const authorsRouter       = require('./controllers/authors')
const blogsRouter         = require('./controllers/blogs')
const sessionsRouter      = require('./controllers/sessions')
const readinglistsRouter  = require('./controllers/readlinglists')
const usersRouter         = require('./controllers/users')


app.use(express.json())

app.use('/api/authors',      authorsRouter)
app.use('/api/blogs',        blogsRouter)
app.use('/api/readinglists', readinglistsRouter)
app.use('/api/users',        usersRouter)
app.use('/api',              sessionsRouter)

app.use(errorHandler)


const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
