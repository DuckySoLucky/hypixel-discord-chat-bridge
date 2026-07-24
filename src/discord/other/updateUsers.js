const updateRolesCommand = require("../commands/forceUpdateCommand.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json"));
const cron = require("node-cron");

if (config.verification.autoRoleUpdater.enabled) {
  console.discord(`RoleSync ready, executing every ${config.verification.autoRoleUpdater.interval} hours.`);
  cron.schedule(
    `0 */${config.verification.autoRoleUpdater.interval} * * *`,
    async () => {
      try {
        await updateRolesCommand.execute(null, { everyone: true, hidden: true });
      } catch (error) {
        console.error(error);
      }
    },
    { timezone: config.other.timezone }
  );
}
