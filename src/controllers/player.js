const { Player } = require('../models')
const player = {}

player.get = async (_, res) => {
  try {
    const players = await Player.find().sort({ timestamp: -1 })

    res.json({
      players: players
    })
  } catch (e) {
    console.log(e)
  }
}

player.create = async (req, res) => {
  try {
    const newPlayer = new Player({
      ...req.body
    })

    await newPlayer.save()
    res.json({
      message: 'Player created successfully',
      id: newPlayer._id
    })
  } catch (e) {
    console.log(e)
    res.json({ message: 'Error creating player, try later' })
  }
}

module.exports = player
