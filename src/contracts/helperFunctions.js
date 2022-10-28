const fs = require("fs-promise");
const { set } = require("lodash");
const mkdirp = require("mkdirp");
const getDirName = require("path").dirname;
const nbt = require("prismarine-nbt");
const util = require("util");
const parseNbt = util.promisify(nbt.parse);

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
  let result = "",
    characters = "abcde0123456789",
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
  let response = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
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
      let json = {};
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
};
