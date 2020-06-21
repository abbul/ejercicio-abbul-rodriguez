const fs = require('fs')
const path = require('path')

const logFile = fs.createWriteStream(path.join(__dirname, '../../logs/error.log'), { flags: 'a' })

const skipSuccess = (req, res) => res.statusCode < 400

module.exports = {
  logFile,
  skipSuccess
}
