const Blog = require('./blog')
const User = require('./user')

User.hasMany(Blog)
Blog.belongsTo(User)

//Blog.sync({ after: true })
//User.sync({ after: true })

module.exports = {
  Blog,
  User
}
