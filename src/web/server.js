const express = require("express");
const server = express();

function start() {
  server.listen(1439, () => {
    console.log("Web Server is Ready!");
  });
}

server.all("/", (req, res) => {
  res.send(` `);
});

module.exports = { start };

//--------------------------------
// If u wanna have fancy website
/*
var http = require('http');
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
