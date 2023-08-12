const router              = require('express').Router()

const { sequelize }       = require('../util/db')
const { Blog }            = require('../models')


router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
      [sequelize.fn('COUNT', sequelize.col('*')), 'blogs']
    ],
    group: ['author'],
    order: [
      ['likes', 'DESC']
    ]
  })

  return res.json(blogs)
})


module.exports = router
