require('dotenv').config()

module.exports = {
  database: {
    URI: `${process.env.DB_URI}`
  }
}
