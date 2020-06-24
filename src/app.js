const express = require('express')
const app = express()
const path = require('path')
const typeorm = require('typeorm')
const morgan = require('morgan')
const homeRouter = require('./routes/homeRoute')
const { logFile, skipSuccess } = require('./utils/logger')
const { initDDBB } = require('./utils/initDatabases')
require('dotenv').config({ path: '.env' })

typeorm.createConnection({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: process.env.TYPEORM_SYNCHRONIZE,
  entities: [
    new typeorm.EntitySchema(require('./entity/cableModem')),
    new typeorm.EntitySchema(require('./entity/modelo'))
  ]
}).then(async (connection) => {
  await initDDBB(connection)
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json({}))
  app.use(morgan('combined', { stream: logFile, skip: skipSuccess }))
  app.use('/public', express.static(path.join(__dirname, './public')))
  app.use('/', homeRouter)
  app.listen(process.env.PORT, () => console.log('listening...'))
}).catch(function (error) {
  console.log('Error: ', error)
})

module.exports = app
