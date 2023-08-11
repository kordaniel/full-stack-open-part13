const { Blog }            = require('../models')


const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id)
    next()
  } catch (error) {
    return res.status(400).json({ error })
  }
}


module.exports = {
  blogFinder
}
