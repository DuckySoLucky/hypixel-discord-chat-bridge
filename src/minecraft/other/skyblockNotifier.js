const { writeAt } = require("../../contracts/helperFunctions.js");
// eslint-disable-next-line
const Rss = require('rss-parser');
const fs = require('fs');
const parser = new Rss();

setInterval(checkForSkyblockUpdates, 10000);
setInterval(checkForIncidents, 10000);

async function checkForIncidents() {
  try {
    const status = await parser.parseURL('https://status.hypixel.net/history.rss');
    for (const data of status.items) {
      const currentStatus = (JSON.parse(fs.readFileSync('data/skyblockNotifer.json'))).skyblockStatus;
      const contents = JSON.stringify(data.contentSnippet).trim().replaceAll('"', '').split('\\n')
      for (const content of contents) {
        if (contents.indexOf(content) % 2 === 0) continue;
        
        const date = contents[contents.indexOf(content) - 1];

        if (currentStatus.includes(`${data.title} | ${content} | ${date}`) === true) continue;

        currentStatus.push(`${data.title} | ${content} | ${date}`);
        await writeAt('data/skyblockNotifer.json', 'skyblockStatus', currentStatus);
        bot.chat(`/gc [SKYBLOCK STATUS] ${data.title} - ${content.split(' - ')[1]} | ${data.link}`);
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
      const currentUpdates = (JSON.parse(fs.readFileSync('data/skyblockNotifer.json'))).skyblockUpdates;
      if (currentUpdates.includes(`${data.title} | ${data.link}`) === true) continue;

      currentUpdates.push(`${data.title} | ${data.link}`);
      await writeAt('data/skyblockNotifer.json', 'skyblockUpdates', currentUpdates);
      bot.chat(`/gc [SKYBLOCK UPDATE] ${data.title} | ${data.link}`);
    }

  } catch (error) {
    console.log(error);
  }
}
