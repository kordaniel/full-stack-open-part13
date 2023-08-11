const bcrypt              = require('bcrypt')
const jwt                 = require('jsonwebtoken')
const router              = require('express').Router()

const { SECRET }          = require('../util/config')
const { User }            = require('../models')

router.post('/', async (req, res) => {
  const { username, password } = req.body

  if (!(username && password)) {
    return res.status(401).json({
      error: 'username or password missing'
    })
  }

  const user = await User.findOne({ where: { username } })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, SECRET)

  return res.status(200).send({
    token,
    username: user.username,
    name: user.name
  })
})

module.exports = router