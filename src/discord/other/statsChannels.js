const updateChannels = require("../commands/updateChannels.js");
const config = require("../../../config.json");
const cron = require("node-cron");

if (config.statsChannels.enabled) {
  cron.schedule(`*/${config.statsChannels.autoUpdaterInterval} * * * *`, () => updateChannels.execute(null, { hidden: true }));
  console.discord(`StatsChannels ready, executing every ${config.statsChannels.autoUpdaterInterval} minutes.`);
}
