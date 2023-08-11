const { Blog }            = require('../models')


const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
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
      console.error(err.message)
      return res.status(400).json({ error: err })
      //next(err)
  }
}

module.exports = {
  blogFinder,
  errorHandler
}
