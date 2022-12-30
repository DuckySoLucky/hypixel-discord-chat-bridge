process.on('uncaughtException', function (error) {console.log(error)})
const webServer = require('./src/web/server.js'); 
const app = require('./src/Application.js')

'use strict'; 

app.register().then(() => {
  app.connect()
}).catch(error => {
  console.error(error) 
})

webServer.start()
  