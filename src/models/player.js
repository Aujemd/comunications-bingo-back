const mongoose = require('mongoose')
const { Schema } = mongoose

const PlayerSchema = new Schema({
  name: { type: String }
})

module.exports = mongoose.model('Player', PlayerSchema)
