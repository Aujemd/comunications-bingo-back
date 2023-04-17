const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const bingo = require('./controllers/bingo')

let activeUsers = []
let usersStatus = []
let currentGameMode = ''
let gameStarted = false
let numbers = []

const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

const isMarked = (value) => {
  if (value === -1) {
    return true
  }
  let marked = false
  for (let index = 0; index < numbers.length; index++) {
    if (value === numbers[index]) {
      marked = true
    }
  }

  return marked
}

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
      usersStatus.push({
        ...newUser,
        tableAccept: false
      })

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
      }, 500)
    }
  })

  socket.on('answer-table', (answer) => {
    if (!answer.accept) {
      const newTable = bingo.getCardBoard()

      socket.emit('table-assigned', {
        id: socket.id,
        table: newTable
      })
    } else if (answer.accept) {
      usersStatus.forEach((user) => {
        if (user.id === socket.id) {
          user.tableAccept = true
        }
      })
    }

    let startGame = true

    usersStatus.forEach((user) => {
      if (!user.tableAccept) {
        startGame = false
      }
    })

    if (startGame) {
      io.emit('game-has-started', {})

      setInterval(() => {
        let isSpawmed = true
        let numberRandom = -1

        do {
          numberRandom = Math.floor(Math.random() * (75 - 1 + 1) + 1)

          isSpawmed = numbers.find((number) => numberRandom === number)
        } while (isSpawmed)

        numbers.push(numberRandom)

        io.emit('num-announced', {
          number: numberRandom
        })
      }, 1000)
    }
  })

  socket.on('claim-win', (answer) => {
    const { table } = answer
    let win = true
    for (let i = 0; i < 5; i++) {
      win = true
      for (let j = 0; j < 5; j++) {
        if (!isMarked(table[i][j])) {
          win = false
          break
        }
      }

      if (win) {
        let user = activeUsers.find((user) => user.id === socket.id)
        io.emit('win-announced', {
          winner: {
            id: user.id,
            name: user.name,
            table
          }
        })
        return
      }
    }

    for (let i = 0; i < 5; i++) {
      win = true
      for (let j = 0; j < 5; j++) {
        if (!isMarked(table[j][i])) {
          win = false
          break
        }
      }

      if (win) {
        let user = activeUsers.find((user) => user.id === socket.id)
        io.emit('win-announced', {
          winner: {
            id: user.id,
            name: user.name,
            table
          }
        })
        return
      }
    }

    if (
      (isMarked(table[0][0]) &&
        isMarked(table[1][1]) &&
        isMarked(table[2][2]) &&
        isMarked(table[3][3]) &&
        isMarked(table[4][4])) ||
      (isMarked(table[0][4]) &&
        isMarked(table[1][3]) &&
        isMarked(table[2][2]) &&
        isMarked(table[3][1]) &&
        isMarked(table[4][0]))
    ) {
      let user = activeUsers.find((user) => user.id === socket.id)
      io.emit('win-announced', {
        winner: {
          id: user.id,
          name: user.name,
          table
        }
      })
    }
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
