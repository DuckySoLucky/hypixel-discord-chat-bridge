const keepAlive = require('./src/web/server.js');
const app = require('./src/Application')

'use strict'
process.title = 'Hypixel Discord Chat Bridge'


app
  .register()
  .then(() => {
    app.connect()
  })
  .catch(err => {
    console.error(err)
  })