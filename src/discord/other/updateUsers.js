const updateRolesCommand = require("../commands/forceUpdateEveryone.js");
const config = require("../../../config.json");
const cron = require("node-cron");

if (config.verification.autoUpdater) {
  console.discord(`RoleSync ready, executing every ${config.verification.autoUpdaterInterval} hours.`);
  cron.schedule(`0 */${config.verification.autoUpdaterInterval} * * *`, async () => {
    try {
      console.discord("Executing RoleSync...");
      await updateRolesCommand.execute(null, true);
      console.discord("RoleSync successfully executed.");
    } catch (error) {
      console.error(error);
    }
  });
}
