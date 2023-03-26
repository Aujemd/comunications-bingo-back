const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const bingo = require('./controllers/bingo')

let activeUsers = []
let currentGameMode = ''
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

io.sockets.on('connection', async (socket) => {
  socket.on('set-mode', (gameMode) => {
    if (!currentGameMode) {
      currentGameMode = gameMode.mode
    }
  })

  socket.on('request-game', (user) => {
    const isNewUser = activeUsers.find((user) => user.id === socket.id)
    if (!isNewUser) {
      const newUser = {
        id: socket.id,
        name: user.playerName
      }

      activeUsers.push(newUser)

      socket.emit('joined-game', {
        otherPlayers: [...activeUsers],
        player: newUser
      })

      socket.broadcast.emit('player-connected', {
        ...newUser
      })

      const newTable = bingo.getCardBoard()

      socket.emit('table-assigned', {
        id: socket.id,
        table: newTable
      })

      setTimeout(() => {
        io.emit('lobby-closed', 'xd')
      }, 10000)
    }
  })

  socket.on('answer-table', (answer) => {
    console.log(answer)
  })

  socket.on('disconnect', () => {
    let userDisconnected = activeUsers.find((user) => user.id === socket.id)

    activeUsers = activeUsers.filter((user) => user.id !== socket.id)

    io.emit('player-disconnected', { ...userDisconnected })
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
