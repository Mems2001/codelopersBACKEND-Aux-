// Dependencies imports
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

// Files imports
const db = require('./utils/database')

const app = express()
const PORT = process.env.PORT || 8000 

// Cors settings
const whitelist = ['http://localhost:8000']
const corsOptions = {
  origin: (origin , callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback (null , true)
    } else {
      callback(new Error('Denied by CORS'))
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  app.use(cors())
  app.use(helmet({crossOriginResourcePolicy: false}))
} else {
  app.use(cors(corsOptions))
}

//  Accept json & form-urlencoded
app.use(express.urlencoded({extended: true}))

// Db contection
db.authenticate()
  .then(() => {
    console.log('Database authenticated')
  })
  .catch(err => {
    console.log(err)
  })
db.sync()
  .then(() => {
    console.log('Database synced')
  })
  .catch(err => {
    console.log(err)
  })

// Routes
app.get('/', (req , res) => {
  res.status(200).json({
    status: 'up' ,
    maintenance: false
  })
})

app.listen(PORT, () => {
  console.log(`Server on PORT: ${PORT}`)
})