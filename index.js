process.on('uncaughtException', function (error) {console.log(error)})
const webServer = require('./src/web/server.js'); 
const app = require('./src/Application.js')

process.title = 'Hypixel Discord Chat Bridge | by DuckySoLucky#5181'
'use strict'; 

app.register().then(() => {
  app.connect()
}).catch(error => {
  console.error(error) 
})

webServer.start()
  