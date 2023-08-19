const { exec } = require("child_process");
const Logger = require("./Logger.js");
const cron = require("node-cron");

function updateCode() {
  exec("git pull", (error, stdout, stderr) => {
    if (error) {
      console.error(`Git pull error: ${error}`);
      return;
    }

    // console.log(`Git pull output: ${stdout}`);

    if (stdout === "Already up to date.\n") {
      return;
    }

    Logger.updateMessage();
  });
}

cron.schedule("0 */12 * * *", () => updateCode());
updateCode();
