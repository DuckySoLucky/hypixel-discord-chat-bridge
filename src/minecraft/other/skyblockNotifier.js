const Rss = require("rss-parser");
const axios = require("axios");
const path = require("path");
const parser = new Rss();
const fs = require("fs");

setInterval(checkForHypixelUpdates, 10000);
setInterval(checkForIncidents, 10000);
setInterval(checkForSkyblockVersion, 10000);

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

const hypixelUpdates = JSON.parse(fs.readFileSync(path.join(__dirname, ".", "hypixelUpdates.json"), "utf-8") || "[]");
async function checkForHypixelUpdates(firstTime = false) {
  try {
    const [{ items: news }, { items: skyblockNews }] = await Promise.all([
      parser.parseURL("https://hypixel.net/forums/news-and-announcements.4/index.rss"),
      parser.parseURL("https://hypixel.net/forums/skyblock-patch-notes.158/index.rss"),
    ]);

    const latestFeed = news.concat(skyblockNews);
    for (const news of latestFeed) {
      const { pubDate, title, link } = news;
      if (hypixelUpdates.includes(title) === true) {
        continue;
      }

      hypixelUpdates.push(title);
      fs.writeFileSync(path.join(__dirname, ".", "hypixelUpdates.json"), JSON.stringify(hypixelUpdates, null, 2));

      if (bot !== undefined && bot._client.chat !== undefined && firstTime === false) {
        if (new Date(pubDate).getTime() + 43200000 < Date.now()) {
          continue;
        }

        bot.chat(`/gc [HYPIXEL UPDATE] ${title} | ${link}`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  } catch (error) {
    console.log(error);
  }
}

checkForHypixelUpdates(true);

let skyblockVersion;
async function checkForSkyblockVersion() {
  try {
    const { data } = await axios.get("https://api.hypixel.net/resources/skyblock/skills");

    if (skyblockVersion !== data.version) {
      if (skyblockVersion !== undefined) {
        bot.chat(
          `/gc [HYPIXEL SKYBLOCK] Skyblock version has been updated to ${data.version}! Server restarts might occur!`
        );
      }

      skyblockVersion = data.version;
    }
  } catch (error) {
    console.log(error);
  }
}
