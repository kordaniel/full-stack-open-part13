const Blog                = require('./blog')
const User                = require('./user')
const Readinglist         = require('./readinglist')
const Session             = require('./session')

// NOTE: User can only have one active session. If we wanted to support several
//       concurrent sessions we would have to use a many-to-many relation.
User.hasOne(Session)
Session.belongsTo(User)

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Readinglist, as: 'readings' })
Blog.belongsToMany(User, { through: Readinglist })

//Blog.sync({ after: true })
//User.sync({ after: true })

module.exports = {
  Blog,
  Readinglist,
  User,
  Session
}
