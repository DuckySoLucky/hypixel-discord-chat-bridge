const { removeExpiredInactivity } = require("../commands/inactivityCommand.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json"));
const cron = require("node-cron");

if (config.verification.inactivity.enabled) (cron.schedule(`*/2 * * * *`, () => removeExpiredInactivity()), { timezone: config.other.timezone });
