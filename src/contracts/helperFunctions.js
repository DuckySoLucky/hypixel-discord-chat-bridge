const fs = require("fs-promise");
const { set } = require("lodash");
const mkdirp = require("mkdirp");
const getDirName = require("path").dirname;
const nbt = require("prismarine-nbt");
const util = require("util");
const parseNbt = util.promisify(nbt.parse);
const getLevel = require("../.././API/stats/hypixelLevel.js");
const axios = require("axios");
const config = require("../../config.json");

function replaceAllRanks(input) {
  input = input.replaceAll("[OWNER] ", "");
  input = input.replaceAll("[ADMIN] ", "");
  input = input.replaceAll("[MCP] ", "");
  input = input.replaceAll("[GM] ", "");
  input = input.replaceAll("[PIG+++] ", "");
  input = input.replaceAll("[YOUTUBE] ", "");
  input = input.replaceAll("[MVP++] ", "");
  input = input.replaceAll("[MVP+] ", "");
  input = input.replaceAll("[MVP] ", "");
  input = input.replaceAll("[VIP+] ", "");
  input = input.replaceAll("[VIP] ", "");
  return input;
}

function addNotation(type, value) {
  let returnVal = value;
  let notList = [];
  if (type === "shortScale") {
    notList = [
      " Thousand",
      " Million",
      " Billion",
      " Trillion",
      " Quadrillion",
      " Quintillion",
    ];
  }

  if (type === "oneLetters") {
    notList = [" K", " M", " B", " T"];
  }

  let checkNum = 1000;
  if (type !== "none" && type !== "commas") {
    let notValue = notList[notList.length - 1];
    for (let u = notList.length; u >= 1; u--) {
      notValue = notList.shift();
      for (let o = 3; o >= 1; o--) {
        if (value >= checkNum) {
          returnVal = value / (checkNum / 100);
          returnVal = Math.floor(returnVal);
          returnVal = (returnVal / Math.pow(10, o)) * 10;
          returnVal = +returnVal.toFixed(o - 1) + notValue;
        }
        checkNum *= 10;
      }
    }
  } else {
    returnVal = numberWithCommas(value.toFixed(0));
  }

  return returnVal;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generateID(length) {
  const result = "";
  const characters = "abcde0123456789",
    charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getRarityColor(rarity) {
  if (rarity.toLowerCase() == "mythic") return "d";
  if (rarity.toLowerCase() == "legendary") return "6";
  if (rarity.toLowerCase() == "epic") return "5";
  if (rarity.toLowerCase() == "rare") return "9";
  if (rarity.toLowerCase() == "uncommon") return "a";
  if (rarity.toLowerCase() == "common") return "f";
  else return "f";
}

function addCommas(num) {
  try {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch (error) {
    return 0;
  }
}

function toFixed(num, fixed) {
  const response = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(response)[0];
}

function timeSince(timeStamp) {
  var now = new Date(),
    secondsPast = (now.getTime() - timeStamp) / 1000;
  secondsPast = Math.abs(secondsPast);

  if (secondsPast < 60) {
    return parseInt(secondsPast) + "s";
  }
  if (secondsPast < 3600) {
    return parseInt(secondsPast / 60) + "m";
  }
  if (secondsPast <= 86400) {
    return parseInt(secondsPast / 3600) + "h";
  }
  if (secondsPast > 86400) {
    const d = toFixed(parseInt(secondsPast / 86400), 0);
    secondsPast -= 3600 * 24 * d;
    const h = toFixed(parseInt(secondsPast / 3600), 0);
    secondsPast -= 3600 * h;
    const m = toFixed(parseInt(secondsPast / 60), 0);
    secondsPast -= 60 * m;
    const s = toFixed(parseInt(secondsPast), 0);
    return d + "d " + h + "h " + m + "m " + s + "s";
  }
}

function writeAt(filePath, jsonPath, value) {
  mkdirp.sync(getDirName(filePath));

  return fs
    .readJson(filePath)
    .then(function (json) {
      set(json, jsonPath, value);
      return fs.writeJson(filePath, json);
    })
    .catch(function (error) {
      const json = {};
      set(json, jsonPath, value);
      return fs.writeJson(filePath, json);
    });
}

function capitalize(str) {
  const words = str.replace(/_/g, " ").toLowerCase().split(" ");

  const upperCased = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.substr(1);
  });

  return upperCased.join(" ");
}

async function decodeData(buffer) {
  const parsedNbt = await parseNbt(buffer);
  return nbt.simplify(parsedNbt);
}

// Bedwars Level Calculator
const EASY_LEVELS = 4;
const EASY_LEVELS_XP = 7000;
const XP_PER_PRESTIGE = 96 * 5000 + EASY_LEVELS_XP;
const LEVELS_PER_PRESTIGE = 100;
const HIGHEST_PRESTIGE = 10;

function getExpForLevel(level) {
  if (level == 0) return 0;

  var respectedLevel = getLevelRespectingPrestige(level);
  if (respectedLevel > EASY_LEVELS) {
    return 5000;
  }

  switch (respectedLevel) {
    case 1:
      return 500;
    case 2:
      return 1000;
    case 3:
      return 2000;
    case 4:
      return 3500;
  }
  return 5000;
}

function getLevelRespectingPrestige(level) {
  if (level > HIGHEST_PRESTIGE * LEVELS_PER_PRESTIGE) {
    return level - HIGHEST_PRESTIGE * LEVELS_PER_PRESTIGE;
  } else {
    return level % LEVELS_PER_PRESTIGE;
  }
}

function getBedwarsLevel(exp) {
  var prestiges = Math.floor(exp / XP_PER_PRESTIGE);
  var level = prestiges * LEVELS_PER_PRESTIGE;
  var expWithoutPrestiges = exp - prestiges * XP_PER_PRESTIGE;

  for (let i = 1; i <= EASY_LEVELS; ++i) {
    var expForEasyLevel = getExpForLevel(i);
    if (expWithoutPrestiges < expForEasyLevel) {
      break;
    }
    level++;
    expWithoutPrestiges -= expForEasyLevel;
  }

  return level + expWithoutPrestiges / 5000;
}

function getSkywarsLevel(exp) {
  var xps = [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000];
  let exactLevel = 0;
  if (exp >= 15000) {
    exactLevel = (exp - 15000) / 10000 + 12;
  } else {
    for (let i = 0; i < xps.length; i++) {
      if (exp < xps[i]) {
        exactLevel = i + (exp - xps[i - 1]) / (xps[i] - xps[i - 1]);
        break;
      }
    }
  }

  return exactLevel;
}

async function getStats(player, uuid, mode, time, username) {
  const [response, response24H] = await Promise.all([
    axios.get(
      `https://api.hypixel.net/player?uuid=${uuid}&key=${config.api.hypixelAPIkey}`
    ),
    axios.get(`https://api.pixelic.de/v1/player/${time}?uuid=${uuid}`),
  ]);

  if (!mode || mode.includes("/")) {
    this.send(
      `/gc ${player == username ? "You have" : `${player} has`} gained ${
        response.data.player.karma - response24H.data.General.karma
      } karma and gained ${(
        getLevel(response.data.player) - response24H.data.General.levelRaw
      ).toFixed(3)} levels in the last 24 hours.`
    );
  } else if (["bw", "bedwars", "bedwar", "bws"].includes(mode.toLowerCase())) {
    const bedwarsData = response.data.player.stats.Bedwars;
    const oldBedwarsData = response24H.data.Bedwars;

    const experience = bedwarsData.Experience - oldBedwarsData.EXP;
    const level = getBedwarsLevel(experience);

    const FK =
      bedwarsData.final_kills_bedwars - oldBedwarsData.overall.finalKills;
    const FD =
      bedwarsData.final_deaths_bedwars - oldBedwarsData.overall.finalDeaths + 1;

    const wins = bedwarsData.wins_bedwars - oldBedwarsData.overall.wins;
    const losses =
      bedwarsData.losses_bedwars - oldBedwarsData.overall.losses + 1;

    const BB =
      bedwarsData.beds_broken_bedwars - oldBedwarsData.overall.bedsBroken;
    const BL =
      bedwarsData.beds_lost_bedwars - oldBedwarsData.overall.bedsLost + 1;

    return `/gc [${level}✫] ${player} FK: ${addCommas(FK)} FKDR: ${(
      FK / FD || 0
    ).toFixed(2)} Wins: ${wins} WLR: ${(wins / losses || 0).toFixed(
      2
    )} BB: ${BB} BLR: ${(BB / BL || 0).toFixed(2)}`;
  } else if (["sw", "skywars", "skywar", "sws"].includes(mode.toLowerCase())) {
    const skywarsData = response.data.player.stats.SkyWars;
    const oldSkywarsData = response24H.data.Skywars;

    const experience = skywarsData.skywars_experience - oldSkywarsData.EXP;
    const level = getSkywarsLevel(experience) - 1;

    const kills = skywarsData.kills - oldSkywarsData.overall.kills;
    const deaths = skywarsData.deaths - oldSkywarsData.overall.deaths + 1;

    const wins = skywarsData.wins - oldSkywarsData.overall.wins;
    const losses = skywarsData.losses - oldSkywarsData.overall.losses + 1;

    const coins = skywarsData.coins - oldSkywarsData.coins;

    return `/gc [${level}✫] ${player} Kills: ${addCommas(kills)} KDR: ${(
      kills / deaths || 0
    ).toFixed(2)} Wins: ${wins} WLR: ${(wins / losses || 0).toFixed(
      2
    )} Coins: ${addCommas(coins || 0)}`;
  } else if (["duels", "duel", "d"].includes(mode.toLowerCase())) {
    const duelsData = response.data.player.stats.Duels;
    const oldDuelsData = response24H.data.Duels;

    const gamesPlayed =
      duelsData.games_played_duels - oldDuelsData.overall.gamesPlayed;

    const wins = duelsData.wins - oldDuelsData.overall.wins;
    const losses = duelsData.losses - oldDuelsData.overall.losses + 1;

    const kills = duelsData.kills - oldDuelsData.overall.kills;
    const deaths = duelsData.deaths - oldDuelsData.overall.deaths + 1;

    const coins = duelsData.coins - oldDuelsData.coins;

    return `/gc ${player} Games: ${addCommas(
      gamesPlayed
    )} Wins: ${wins} WLR: ${(wins / losses || 0).toFixed(2)} Kills: ${addCommas(
      kills
    )} KDR: ${(kills / deaths || 0).toFixed(2)} Coins: ${addCommas(
      coins || 0
    )}`;
  }
}

module.exports = {
  replaceAllRanks,
  addNotation,
  generateID,
  getRarityColor,
  addCommas,
  toFixed,
  timeSince,
  writeAt,
  capitalize,
  decodeData,
  numberWithCommas,
  getStats,
};
