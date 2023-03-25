const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')

const activeUsers = new Set()

const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

io.sockets.on('connection', async (socket) => {
  socket.on('new-player-request', (user) => {
    socket.userId = user
    activeUsers.add(user)
    io.emit('new-user', [...activeUsers])
  })

  socket.on('disconnect', () => {
    activeUsers.delete(socket.userId)
    io.emit('user-disconnected', socket.userId)
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
