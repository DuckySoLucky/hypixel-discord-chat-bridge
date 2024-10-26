const updateChannels = require("../commands/forceUpdateChannelsCommand.js");
const config = require("../../../config.json");
const cron = require("node-cron");

if (config.statsChannels.enabled) {
  console.log("Stats channels enabled");
  cron.schedule(`*/${config.verification.autoUpdaterInterval} * * * *`, () => updateChannels.execute(null, true));
}
