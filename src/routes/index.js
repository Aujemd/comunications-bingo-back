const express = require('express')
const router = express.Router()

const index = require('../controllers/index')
const player = require('../controllers/player')

module.exports = (app) => {
  router.get('/', index.get)
  router.get('/players', player.get)
  router.post('/player', player.create)

  app.use(router)
}
