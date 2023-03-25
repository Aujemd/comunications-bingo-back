const bingo = {}

const B = 0
const I = 1
const N = 2
const G = 3
const O = 4

const findNumber = (cardBoard = [[]], newNumber) => {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (cardBoard[i][j] === newNumber) {
        return true
      }
    }
  }

  return false
}

bingo.getCardBoard = () => {
  const cardBoard = [...Array(5)].map((_) => Array(5).fill(0))

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      let isInCardBoard = false
      let value = -2
      switch (i) {
        case B:
          do {
            value = Math.floor(Math.random() * (15 - 1 + 1) + 1)
            isInCardBoard = findNumber(cardBoard, value)
            cardBoard[i][j] = value
          } while (isInCardBoard)
          break
        case I:
          do {
            value = Math.floor(Math.random() * (30 - 16 + 1) + 16)
            isInCardBoard = findNumber(cardBoard, value)
            cardBoard[i][j] = value
          } while (isInCardBoard)

          break
        case N:
          do {
            value = Math.floor(Math.random() * (45 - 31 + 1) + 31)
            isInCardBoard = findNumber(cardBoard, value)
            cardBoard[i][j] = value
          } while (isInCardBoard)
          break
        case G:
          do {
            value = Math.floor(Math.random() * (60 - 46 + 1) + 46)
            isInCardBoard = findNumber(cardBoard, value)
            cardBoard[i][j] = value
          } while (isInCardBoard)

          break
        case O:
          do {
            value = Math.floor(Math.random() * (75 - 61 + 1) + 61)
            isInCardBoard = findNumber(cardBoard, value)
            cardBoard[i][j] = value
          } while (isInCardBoard)

          break
        default:
          break
      }
    }
  }

  cardBoard[2][2] = -1

  console.log(cardBoard)

  return cardBoard
}
module.exports = bingo
