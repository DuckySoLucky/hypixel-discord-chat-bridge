const Rss = require("rss-parser");
const parser = new Rss();

setInterval(checkForSkyblockUpdates, 10000);
setInterval(checkForIncidents, 10000);

const hypixelIncidents = {};
async function checkForIncidents() {
  try {
    const { items: status } = await parser.parseURL("https://status.hypixel.net/history.rss");

    const latestIcidents = status.filter((data) => new Date(data.pubDate).getTime() / 1000 + 43200 > Date.now() / 1000);

    for (const incident of latestIcidents) {
      const { title, link } = incident;

      if (hypixelIncidents[title]?.notified !== true) {
        hypixelIncidents[title] = { notified: true };
        bot.chat(`/gc [HYPIXEL STATUS] ${title} | ${link}`);
      }

      const updates = JSON.stringify(incident.contentSnippet)
        .split("\\n")
        .filter((_, index) => index % 2 !== 0);

      for (const update of updates) {
        if (hypixelIncidents[title]?.updates?.includes(update) === true) continue;

        hypixelIncidents[title].updates ??= [];
        if (bot !== undefined && bot._client.chat !== undefined) {
          hypixelIncidents[title].updates.push(update);
          bot.chat(`/gc [HYPIXEL STATUS UPDATE] ${title} | ${update}`);
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

const hypixelUpdates = {};
async function checkForSkyblockUpdates() {
  try {
    const [{ items: news }, { items: skyblockNews }] = await Promise.all([
      parser.parseURL("https://hypixel.net/forums/news-and-announcements.4/index.rss"),
      parser.parseURL("https://hypixel.net/forums/skyblock-patch-notes.158/index.rss"),
    ]);

    const latestFeed = news
      .concat(skyblockNews)
      .filter((data) => new Date(data.pubDate).getTime() / 1000 + 43200 > Date.now() / 1000);

    for (const news of latestFeed) {
      const { title, link } = news;

      if (hypixelUpdates[title] === true) continue;

      if (bot !== undefined && bot._client.chat !== undefined) {
        hypixelUpdates[title] = true;
        bot.chat(`/gc [HYPIXEL UPDATE] ${title} | ${link}`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  } catch (error) {
    console.log(error);
  }
}
