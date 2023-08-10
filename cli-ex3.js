require('dotenv').config()

const {
  Sequelize,
  Model,
  QueryTypes,
  DataTypes
} = require('sequelize')


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

const printBlogDataVals = (data) => {
  console.log(`${data.author}: '${data.title}', ${data.likes} likes`)
}

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connected to DB.')

    /*
    const blogs = await sequelize.query('SELECT author, title, likes FROM blogs', {
      type: QueryTypes.SELECT
    })
    blogs.forEach(b => {
      console.log(`${b.author}: '${b.title}', ${b.likes} likes`)
    })
    */

    const blogs = await Blog.findAll({
      attributes: ['author', 'title', 'likes']
    })
    blogs.forEach(printBlogDataVals)

    sequelize.close()
  } catch (err) {
    console.error('Unable to connect to the DB:', err)
  }
}

main()
