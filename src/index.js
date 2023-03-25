const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const bingo = require('./controllers/bingo')
let activeUsers = []
let gameMode = ''

const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

io.sockets.on('connection', async (socket) => {
  socket.on('set-mode', (mode) => {
    if (!gameMode) {
      gameMode = mode
    }

    io.emit('lobby-closed', {
      mode: gameMode
    })
  })

  socket.on('request-game', (user) => {
    const newUser = {
      id: socket.id,
      name: user.playerName
    }

    activeUsers.push(newUser)

    socket.emit('joined-game', {
      otherPlayers: [...activeUsers],
      player: newUser
    })

    io.emit('player-connected', {
      ...newUser
    })

    const newTable = bingo.getCardBoard()

    socket.emit('table-assigned', {
      id: socket.id,
      table: newTable
    })
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
