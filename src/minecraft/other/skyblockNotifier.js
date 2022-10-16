const { writeAt } = require("../../contracts/helperFunctions");
const fs = require('fs');
const Rss = require('rss-parser');
const parser = new Rss();

setInterval(checkForSkyblockUpdates, 10000);
setInterval(checkForIncidents, 10000);

async function checkForIncidents() {
    try {
        const status = await parser.parseURL('https://status.hypixel.net/history.rss');
        for (const data of status.items) {
            const currentStatus = (JSON.parse(fs.readFileSync('data/skyblockNotifer.json'))).skyblockStatus;
            const content = JSON.stringify(data.contentSnippet).replaceAll('"', '').replaceAll('  ', ' ').split('\\n');
            for (let i = 0; i < content.length; i++) {
                const incident = content[i];
                if (i % 2 === 0) continue;
                if (!currentStatus.includes(`${data.title} | ${incident} | ${content[i-1]}`)) {
                    currentStatus.push(`${data.title} | ${incident} | ${content[i-1]}`);
                    await writeAt('data/skyblockNotifer.json', 'skyblockStatus', currentStatus);
                    bot.chat(`/gc [SKYBLOCK STATUS] ${data.title} - ${incident.split(' - ')[1]} | ${data.link}`);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function checkForSkyblockUpdates() {
    try {
        const feed = await parser.parseURL('https://hypixel.net/forums/skyblock-patch-notes.158/index.rss');
        for (const data of feed.items) {
            const currentUpdates = (JSON.parse(fs.readFileSync('data/skyblockNotifer.json'))).skyblockNews;
            if (!currentUpdates.includes(`${data.title} | ${data.link}`)) {
                currentUpdates.push(`${data.title} | ${data.link}`);
                await writeAt('data/skyblockNotifer.json', 'skyblockNews', currentUpdates);
                bot.chat(`/gc [SKYBLOCK UPDATE] ${data.title} ${data.link}`);
            }
        }
     } catch (error) {
        console.log(error);
    }
}
