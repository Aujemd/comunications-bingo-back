const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const bingo = require('./controllers/bingo')

let activeUsers = []
let currentGameMode = ''
let gameStarted = false
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

io.sockets.on('connection', async (socket) => {
  socket.emit('current-status', {
    currentGameMode,
    gameStarted
  })
  socket.on('set-mode', (gameMode) => {
    if (!currentGameMode) {
      currentGameMode = gameMode.mode
    }

    io.emit('current-status', {
      currentGameMode,
      gameStarted
    })
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

      setTimeout(() => {
        gameStarted = true
        io.emit('lobby-closed')
        io.emit('current-status', {
          currentGameMode,
          gameStarted
        })

        const newTable = bingo.getCardBoard()

        socket.emit('table-assigned', {
          id: socket.id,
          table: newTable
        })
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
