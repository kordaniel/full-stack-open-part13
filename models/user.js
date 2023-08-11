const {
  Model,
  DataTypes
}                         = require('sequelize')

const { sequelize }       = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: [60, 60]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
})

module.exports = User
