const router              = require('express').Router()

const { blogFinder }      = require('../util/middleware')
const { Blog }            = require('../models')


// NOTE: DB operations should really be wrapped in try/catch

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  return res.json(blogs)
})

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', blogFinder, async (req, res) => {
  return req.blog
    ? res.json(req.blog)
    : res.status(404).end()
})

router.delete('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).end()
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
