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
        bot.chat(`/gc [HYPIXEL STATUS] ${data.title} - ${content.split(' - ')[1]} | ${data.link}`);
      }
    }

  } catch (error) {
    console.log(error);
  }
}

async function checkForSkyblockUpdates() {
  try {
    const [ response, response1 ] = await Promise.all([
      parser.parseURL('https://hypixel.net/forums/news-and-announcements.4/index.rss'),
      parser.parseURL('https://hypixel.net/forums/skyblock-patch-notes.158/index.rss')
    ]);

    const feed = response.items.concat(response1.items);
    for (const data of feed) {
      const currentUpdates = (JSON.parse(fs.readFileSync('data/skyblockNotifer.json'))).skyblockUpdates;
      if (currentUpdates.includes(`${data.title} | ${data.link}`) === true) continue;

      currentUpdates.push(`${data.title} | ${data.link}`);
      await writeAt('data/skyblockNotifer.json', 'skyblockUpdates', currentUpdates);
      bot.chat(`/gc [HYPIXEL UPDATE] ${data.title} | ${data.link}`);
    }

  } catch (error) {
    console.log(error);
  }
}