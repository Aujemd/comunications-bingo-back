const express = require('express')
const routes = require('../routes/index')
const morgan = require('morgan')
const errorHandler = require('errorhandler')

module.exports = (app) => {
  app.set('env', process.env.ENV || 'dev')
  app.set('port', process.env.PORT || 3000)

  app.use(morgan('dev'))
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())

  routes(app)

  if ('development' === app.get('env')) {
    app.use(errorHandler)
  }
  return app
}
