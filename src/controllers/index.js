const ctrl = {}

ctrl.get = (_, res) => {
  res.json({
    code: 200,
    message: 'All fine'
  })
}

module.exports = ctrl