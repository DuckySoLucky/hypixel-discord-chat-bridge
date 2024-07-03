const { getSkyblockCalendar } = require("../../../API/functions/getCalendar.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const config = require("../../../config.json");
const axios = require("axios");

if (config.minecraft.skyblockEventsNotifications.enabled) {
  const { notifiers, customTime } = config.minecraft.skyblockEventsNotifications;

  setInterval(async () => {
    try {
      const eventBOT = new minecraftCommand(bot);
      const EVENTS = getSkyblockCalendar();

      for (const event in EVENTS.events) {
        const eventData = EVENTS.events[event];
        if (notifiers[event] === false) {
          continue;
        }

        if (eventData.events[0].start_timestamp < Date.now()) {
          continue;
        }

        const minutes = Math.floor((eventData.events[0].start_timestamp - Date.now()) / 1000 / 60);

        let extraInfo = "";
        if (event == "JACOBS_CONTEST") {
          const { data: jacobResponse } = await axios.get("https://dawjaw.net/jacobs");
          const jacobCrops = jacobResponse.find(
            (crop) => crop.time >= Math.floor(eventData.events[0].start_timestamp / 1000)
          );

          if (jacobCrops?.crops !== undefined) {
            extraInfo = ` (${jacobCrops.crops.join(", ")})`;
          }
        }

        const cTime = getCustomTime(customTime, event);
        if (cTime.length !== 0 && cTime.includes(minutes.toString())) {
          eventBOT.send(`/gc [EVENT] ${eventData.name}${extraInfo}: ${minutes}m`);
          await delay(1500);
        }

        if (minutes == 0) {
          eventBOT.send(`/gc [EVENT] ${eventData.name}${extraInfo}: NOW`);
          await delay(1500);
        }
      }
    } catch (e) {
      console.log(e);
      /* empty */
    }
  }, 60000);
}

function getCustomTime(events, value) {
  if (events === undefined || value === undefined) {
    return false;
  }

  return Object.keys(events).filter((key) => events[key].includes(value));
}
