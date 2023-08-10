require('dotenv').config()

const {
  Sequelize,
  Model,
  DataTypes
}             = require('sequelize')

const express = require('express')
const app = express()

app.use(express.json())


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

Blog.sync()


app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  return res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    return blog
      ? res.json(blog)
      : res.status(404).end()
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).end()
    }
    await blog.destroy()
    return res.status(200).end()
  } catch (error) {
    return res.status(400).json({ error })
  }
})


app.listen(process.env.PORT, () => {
  sequelize.authenticate()
    .then(() => {
      console.log('Connected to DB')
      console.log(`Server running on port ${process.env.PORT}`)
    })
    .catch(err => {
      console.error('Unable to connect to DB:', err)
    })
})
