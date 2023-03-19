const mongoose = require('mongoose')

const { database } = require('./keys')

main().catch((e) => console.log(e))

async function main() {
  try {
    const db = await mongoose.connect(database.URI)

    if (db) {
      console.log('Db connected')
    }
  } catch (error) {
    console.log(err)
  }
}
