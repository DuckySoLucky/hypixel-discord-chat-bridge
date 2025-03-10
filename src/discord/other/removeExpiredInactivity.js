const { removeExpiredInactivity } = require("../commands/inactivityCommand.js");
const config = require("../../../config.json");
const cron = require("node-cron");

if (config.verification.inactivity.enabled) cron.schedule(`*/2 * * * *`, () => removeExpiredInactivity());
