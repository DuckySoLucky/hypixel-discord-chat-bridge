const updateRolesCommand = require("../commands/forceUpdateEveryone.js");
const config = require("../../../config.json");
const cron = require("node-cron");

if (config.verification.autoUpdate) {
  cron.schedule(`0 */${config.verification.autoUpdaterInterval} * * *`, () => updateRolesCommand.execute(null, true));
}
