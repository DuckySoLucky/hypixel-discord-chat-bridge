const cron = require("node-cron");
const { exec } = require("child_process");
const nodemon = require("nodemon");

function updateCode() {
  exec("git pull", (error, stdout, stderr) => {
    console.log(error, stdout, stderr);
    if (error) {
      console.error(`Git pull error: ${error}`);
      return;
    }

    console.log(`Git pull output: ${stdout}`);

    nodemon.restart();
  });
}

cron.schedule("0 */12 * * *", () => updateCode());
updateCode();
