const jwt                 = require('jsonwebtoken')
const { Blog, User }      = require('../models')
const { SECRET }          = require('./config')


const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (!(authorization && authorization.toLowerCase().startsWith('bearer '))) {
    return res.status(401).json({ error: 'token missing' })
  }

  try {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
  } catch (error) {
    return res.status(401).json({ error: 'invalid token' })
  }

  next()
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id, {
    attributes: {
      exclude: ['userId']
    },
    include: {
      model: User,
      attributes: ['name']
    }
  })
  next()

  /* express-async-errors library catches and forwards the error to the handler
  try {
    req.blog = await Blog.findByPk(req.params.id)
    next()
  } catch (error) {
    next(error)
  }
  */
}

const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case 'SequelizeDatabaseError':
      //return res.status(400).json({ error: 'SQL error (most likely due to a malformatted id)' })
      return res.status(400).json({ error: err.original.toString() }) // use original field of error to mask the fact that we are using sequelize
    case 'SequelizeValidationError':
      return res.status(400).json({ error: err.errors.map(e => e.message) })
    case 'SequelizeUniqueConstraintError':
      return res.status(400).json({ error: err.original.toString() })
    default:
      console.error('[ERROR]:', err)
      return res.status(400).json({ error: 'undeterminated error occured' })
      //next(err)
  }
}

module.exports = {
  tokenExtractor,
  blogFinder,
  errorHandler
}
