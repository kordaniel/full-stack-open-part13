const jwt                 = require('jsonwebtoken')
const {
  Blog,
  Session,
  User
}                         = require('../models')
const { SECRET }          = require('./config')


const tokenExtractor = (req, res, next) => {
  // This should be removed and only the user (including session from DB if necessary)
  // should be stored in req in real applications(?)
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

const userSessionLoader = async (req, res, next) => {
  const session = await Session.findByPk(req.decodedToken.id)
  if (!session) {
    return res.status(401).json({ error: 'no session found for token' })
  }

  const user = await User.findByPk(session.userId, {
    attributes: ['id', 'disabled']
  })
  if (!user) {
    // user should be fetched from the DB in the same query as the session
    // to avoid this check. session ID PK is FK to user ID with restriction
    await session.destroy()
    return res.status(406).json({ error: 'invalid token, no matching account'})
  } else if (user.disabled) {
    return res.status(401).json({ error: 'account disabled' })
  }

  req.sessionUser = user
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
    case 'SequelizeForeignKeyConstraintError':
      console.error('[ERROR]:', res)
      return res.status(409).json({ error: 'invalid data' })
    default:
      console.error('[ERROR]:', err)
      return res.status(400).json({ error: 'undeterminated error occured' })
      //next(err)
  }
}

module.exports = {
  tokenExtractor,
  userSessionLoader,
  blogFinder,
  errorHandler
}
