//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const { buildSkyblockCalendar } = require("../constants/calendar");

function getSkyblockCalendar() {
  try {
    const calendar = buildSkyblockCalendar(
      null,
      Date.now(),
      Date.now() + 10710000000,
      1,
      false
    );

    return { status: 200, data: calendar };
  } catch (error) {
    return { status: 404, reason: error };
  }
}

module.exports = { getSkyblockCalendar };
