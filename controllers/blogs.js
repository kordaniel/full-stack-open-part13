const router              = require('express').Router()
const { Op }              = require('sequelize')

const {
  blogFinder,
  tokenExtractor
}                         = require('../util/middleware')
const { Blog, User }      = require('../models')


router.get('/', async (req, res) => {
  // Op.iLike case insensitive like operator (only for Postgres !!!)
  const where = req.query.search
    ? {
        [Op.or]: [
          { title: { [Op.iLike]: `%${req.query.search}%` } },
          { author: { [Op.iLike]: `%${req.query.search}%` } }
        ]
      }
    : {}

  const blogs = await Blog.findAll({
    attributes: {
      exclude: ['userId']
    },
    include: {
      model: User,
      attributes: ['id', 'name']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  return res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({
    ...req.body,
    userId: user.id
  })
  return res.json(blog)
})

router.get('/:id', blogFinder, async (req, res) => {
  return req.blog
    ? res.json(req.blog)
    : res.status(404).end()
})

router.delete('/:id', [tokenExtractor, blogFinder], async (req, res) => {
  if (!req.blog) {
    return res.status(404).end()
  }

  if (req.decodedToken.id !== req.blog.userId) {
    return res.status(403).json({ error: 'not allowed' })
  }

  await req.blog.destroy()
  return res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).end()
  }
  req.blog.likes = req.body.likes
  await req.blog.save()
  return res.json(req.blog)
})


module.exports = router
