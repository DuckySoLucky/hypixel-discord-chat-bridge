const { exec } = require("child_process");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json"));
const Logger = require("./Logger.js");
const cron = require("node-cron");

function updateCode() {
  if (config.other.autoUpdater === false) {
    return;
  }

  exec("git pull", (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }

    // console.log(`Git pull output: ${stdout}`);

    if (stdout === "Already up to date.\n") {
      return;
    }

    Logger.updateMessage();
  });
}

cron.schedule(`0 */${config.other.autoUpdaterInterval} * * *`, () => updateCode(), { timezone: config.other.timezone });
updateCode();
