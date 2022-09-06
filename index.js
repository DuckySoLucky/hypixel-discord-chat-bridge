process.on('uncaughtException', function (error) {console.log(error)})
const refreshCollections = require('./API/data/refreshCollections');
const refreshAuctions = require('./API/data/refreshAuctions');
const refreshPrices = require('./API/data/refreshPrices');
const webServer = require('./src/web/server.js'); 
const app = require('./src/Application')

process.title = 'Hypixel Discord Chat Bridge | by DuckySoLucky#5181'
'use strict'; 

app.register().then(() => {
  app.connect()
}).catch(error => {
  console.error(error) 
})

refreshCollections();
refreshAuctions();
refreshPrices();
  