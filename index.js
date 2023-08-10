require('dotenv').config()

const {
  Sequelize
} = require('sequelize')


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connected to DB.')
    sequelize.close()
  } catch (err) {
    console.error('Unable to connect to the DB:', err)
  }
}

main()
