const bcrypt              = require('bcrypt')
const jwt                 = require('jsonwebtoken')
const router              = require('express').Router()

const { SECRET }          = require('../util/config')
const { User, Session }   = require('../models')
const {
  tokenExtractor,
  userSessionLoader
}                         = require('../util/middleware')

router.post('/login', async (req, res) => {
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

  if (user.disabled) {
    return res.status(401).json({
      error: 'account disabled'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, SECRET)

  const [session, created] = await Session.findOrCreate({
    where: { userId: user.id },
    defaults: { token }
  })

  return res.status(200).send({
    token: session.token,
    username: user.username,
    name: user.name
  })
})

router.delete('/logout', [tokenExtractor, userSessionLoader], async (req, res) => {
  const session = await Session.findByPk(req.sessionUser.id)

  if (session) {
    await session.destroy()
  }

  return res.status(200).end()
})


module.exports = router
