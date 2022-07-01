const express = require('express');
const server = express();
 
server.all('/', (req, res) => {
  res.send(`Bot is Online!`)
})
 
function keepAlive() {
  server.listen(1382, () => { console.log("Server is Ready!") });
}
 
module.exports = keepAlive;

//--------------------------------
// If u wanna have fancy website

/*var http = require('http');
var fs = require('fs');

const PORT=1382; 

fs.readFile('./src/web/index.html', function (err, html) {
    if (err) throw err;    
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(PORT);
});*/
 
