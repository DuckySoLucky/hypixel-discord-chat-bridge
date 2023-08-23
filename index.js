process.on("uncaughtException", (error) => console.log(error));
var readline = require('readline');
const app = require("./src/Application.js");

("use strict");

app
  .register()
  .then(() => {
    app.connect();
  })
  .catch((error) => {
    console.error(error);
  });


rl = readline.createInterface(process.stdin, process.stdout);
var waitForUserInput = function() {
  rl.question("Command: ", function(answer) {
    if (answer == "exit"){
        rl.close();
    } else {
        eval(answer);
        waitForUserInput();
    }
  });
}
