const router              = require('express').Router()

const { User }            = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll()
  return res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  return res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  if (!user) {
    return res.status(404).end()
  }

  // sequelize with Postgres does not validate the type of the field name,
  // only that it exists and is not null.
  // => a body { name: true } can be saved and will be returned with
  // the name field as a boolean. When fetching the updated user from the
  // DB it will then be a string "true".

  user.name = req.body.name
  await user.save()

  return res.json(user)
})

module.exports = router
