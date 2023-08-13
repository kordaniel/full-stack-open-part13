const Blog                = require('./blog')
const User                = require('./user')
const Readinglist         = require('./readinglist')


User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Readinglist, as: 'readings' })
Blog.belongsToMany(User, { through: Readinglist })

//Blog.sync({ after: true })
//User.sync({ after: true })

module.exports = {
  Blog,
  Readinglist,
  User
}
