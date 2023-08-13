const router              = require('express').Router()

const { tokenExtractor }  = require('../util/middleware')
const { Readinglist }     = require('../models')


router.post('/', async (req, res) => {
  const { blog_id, user_id } = req.body

  const [readinglist, created] = await Readinglist.findOrCreate({
    where: {
      userId: user_id,
      blogId: blog_id
    }
  })

  return created
    ? res.status(201).json(readinglist)
    : res.json(readinglist)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const readinglist = await Readinglist.findOne({
    where: {
      userId: req.decodedToken.id,
      blogId: req.params.id
    }
  })
  if (!readinglist) {
    return res.status(404).end()
  }

  readinglist.read = req.body.read
  await readinglist.save()

  return res.json(readinglist)
})

module.exports = router
