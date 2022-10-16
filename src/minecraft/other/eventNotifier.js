const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const { timeSince, toFixed } = require('../../contracts/helperFunctions');
const config = require('../../../config.json');
const axios = require('axios');
const { getSkyblockCalendar } = require('../../../API/functions/getCalendar');

if (config.event.enabled) {
    setInterval(async () => {
        const EVENTS = getSkyblockCalendar();
        for (const event of Object.keys(EVENTS.data.events)) {
            if (!config.event.notifiers[event]) continue;
            const eventInfo = EVENTS.data.events[event];
            if (eventInfo.events[0].start_timestamp < Date.now()) continue;
            if (event == "JACOBS_CONTEST") {
                if (toFixed((eventInfo.events[0].start_timestamp - Date.now()) / 1000 / 60, 0) == 5 || toFixed((eventInfo.events[0].start_timestamp - Date.now()) / 1000 / 60, 0) == 30) {
                    const jacobResponse = (await axios.get('https://dawjaw.net/jacobs')).data;
                    const jacobCrops = jacobResponse.find(crop => crop.time == toFixed(eventInfo.events[0].start_timestamp / 1000, 0));
                    bot.chat(`/gc [EVENT] ${eventInfo.name} (${jacobCrops.crops[0] + ", " + jacobCrops.crops[1] + " & " + jacobCrops.crops[2]}) » ${timeSince(eventInfo.events[0].start_timestamp)}`);
                    await delay(1000);
                }   
            } else {
                if (toFixed((eventInfo.events[0].start_timestamp - Date.now()) / 1000 / 60, 0) == 5 || toFixed((eventInfo.events[0].start_timestamp - Date.now()) / 1000 / 60, 0) == 30) {
                    bot.chat(`/gc [EVENT] ${eventInfo.name} » ${timeSince(eventInfo.events[0].start_timestamp)}`);
                    await delay(1000);
                }
            }
        }
    }, 5000);
}