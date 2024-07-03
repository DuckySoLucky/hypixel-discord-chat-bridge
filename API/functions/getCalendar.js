//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const { buildSkyblockCalendar } = require("../constants/calendar.js");

function getSkyblockCalendar() {
  try {
    const calendar = buildSkyblockCalendar(null, Date.now(), Date.now() + 10710000000, 1, false);

    return calendar;
  } catch (error) {
    return null;
  }
}

module.exports = { getSkyblockCalendar };
