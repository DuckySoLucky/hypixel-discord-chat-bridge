const express = require('express');
const server = express();
 
server.all('/', (req, res) => {
  res.send(`Bot is Online!`)
})
 
function keepAlive() {
  server.listen(1382, () => { console.log("Server is Ready!!") });
}
 
module.exports = keepAlive;
