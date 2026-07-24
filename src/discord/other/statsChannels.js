const updateChannels = require("../commands/updateChannels.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json"));
const cron = require("node-cron");

if (config.statsChannels.enabled) {
  cron.schedule(`*/${config.statsChannels.autoUpdaterInterval} * * * *`, () => updateChannels.execute(null, { hidden: true }), { timezone: config.other.timezone });
  console.discord(`StatsChannels ready, executing every ${config.statsChannels.autoUpdaterInterval} minutes.`);
}
