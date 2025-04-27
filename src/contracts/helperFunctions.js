const moment = require("moment");

/**
 * Replaces all ranks in a string with an empty string
 * @param {string} input
 * @returns {string}
 */
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

/**
 * Generates a random ID
 * @param {number} length
 * @returns {string}
 */
function generateID(length) {
  let result = "";
  const characters = "abcde0123456789",
    charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

/**
 * Returns a humanized string representing the time since the given
 * @param {number} endTime
 * @param {number} startTime
 * @returns {string}
 */
function timeSince(endTime, startTime = new Date().getTime()) {
  return moment.duration(endTime - startTime).humanize();
}

/**
 * Returns the ordinal suffix for a given number
 * @param {number} i
 * @returns {string}
 */
function nth(i) {
  return i + ["st", "nd", "rd"][((((i + 90) % 100) - 10) % 10) - 1] || `${i}th`;
}

const units = new Set(["y", "M", "w", "d", "h", "m", "s"]);

/**
 * Parses a date
 * @param {string} mathString
 * @param {moment.Moment} time
 * @returns
 */
function parseDateMath(mathString, time) {
  const strippedMathString = mathString.replace(/\s/g, "");
  const dateTime = time;
  let i = 0;
  const { length } = strippedMathString;

  while (i < length) {
    const c = strippedMathString.charAt(i);
    i += 1;
    let type;
    let number;

    if (c === "/") {
      type = 0;
    } else if (c === "+") {
      type = 1;
    } else if (c === "-") {
      type = 2;
    } else {
      return;
    }

    if (Number.isNaN(Number.parseInt(strippedMathString.charAt(i), 10))) {
      number = 1;
    } else if (strippedMathString.length === 2) {
      number = strippedMathString.charAt(i);
    } else {
      const numberFrom = i;
      while (!Number.isNaN(Number.parseInt(strippedMathString.charAt(i), 10))) {
        i += 1;
        if (i > 10) {
          return;
        }
      }
      number = Number.parseInt(strippedMathString.slice(numberFrom, i), 10);
    }

    if (type === 0 && number !== 1) {
      return;
    }

    const unit = strippedMathString.charAt(i);
    i += 1;

    if (!units.has(unit)) {
      return;
    }
    if (type === 0) {
      // @ts-ignore
      dateTime.startOf(unit);
    } else if (type === 1) {
      // @ts-ignore
      dateTime.add(number, unit);
    } else if (type === 2) {
      // @ts-ignore
      dateTime.subtract(number, unit);
    }
  }

  return dateTime;
}

/**
 * Parses a timestamp
 * @param {string} text
 * @returns {number | moment.Moment | undefined}
 */
function parseTimestamp(text) {
  if (!text) return;

  if (typeof text !== "string") {
    if (moment.isMoment(text)) {
      return text;
    }
    if (moment.isDate(text)) {
      return moment(text);
    }
    return;
  }

  let time;
  let mathString = "";
  let index;
  let parseString;

  if (text.slice(0, 3) === "now") {
    time = moment.utc();
    mathString = text.slice(3);
  } else {
    index = text.indexOf("||");
    if (index === -1) {
      parseString = text;
      mathString = "";
    } else {
      parseString = text.slice(0, Math.max(0, index));
      mathString = text.slice(Math.max(0, index + 2));
    }

    time = moment(parseString, moment.ISO_8601);
  }

  if (mathString.length === 0) {
    return time.valueOf();
  }

  const dateMath = parseDateMath(mathString, time);

  return dateMath ? dateMath.valueOf() : undefined;
}

/**
 *  Formats a username based on the gamemode
 * @param {string} username
 * @param {string} gamemode
 * @returns {string}
 */
function formatUsername(username, gamemode) {
  if (gamemode === "ironman") return `♲ ${username}`;
  if (gamemode === "bingo") return `Ⓑ ${username}`;
  if (gamemode === "island") return `	☀ ${username}`;

  return username;
}

/**
 * Formats a number
 * @param {number} number
 * @param {number} decimals
 * @returns
 */
function formatNumber(number, decimals = 2) {
  if (number === undefined || number === 0) return 0;

  const isNegative = number < 0;

  if (number < 100000 && number > -100000) {
    return Number(number).toLocaleString();
  }

  const abbrev = ["", "K", "M", "B", "T", "Qa", "Qi", "S", "O", "N", "D"];
  const unformattedNumber = Math.abs(number);

  const abbrevIndex = Math.floor(Math.log10(unformattedNumber) / 3);
  const shortNumber = (unformattedNumber / Math.pow(10, abbrevIndex * 3)).toFixed(decimals);

  return `${isNegative ? "-" : ""}${shortNumber}${abbrev[abbrevIndex]}`;
}

/**
 * Replaces variables in a string
 * @param {string} template
 * @param {object} variables
 * @returns
 */
function replaceVariables(template, variables) {
  // @ts-ignore
  return template.replace(/\{(\w+)\}/g, (match, name) => variables[name] ?? match);
}

/**
 * Splits a message into multiple messages
 * @param {string} message
 * @param {number} amount
 * @returns {string[]}
 */
function splitMessage(message, amount) {
  const messages = [];
  for (let i = 0; i < message.length; i += amount) {
    messages.push(message.slice(i, i + amount));
  }

  return messages;
}

/**
 * Formats an error message
 * @param {Error | unknown} error
 * @returns {string}
 */
function formatError(error) {
  return error.toString().replace("[hypixel-api-reborn] ", "").replace("For help join our Discord Server https://discord.gg/NSEBNMM", "").replace("Error:", "[ERROR]");
}

/**
 * Returns a promise that resolves after the given time
 * @param {number} ms
 * @returns {Promise<void>}
 */
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Converts a string to title case
 * @param {string} str
 * @returns {string}
 */
function titleCase(str) {
  if (!str) return "";

  if (typeof str !== "string") {
    return "";
  }

  return str
    .toLowerCase()
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

module.exports = {
  replaceAllRanks,
  generateID,
  timeSince,
  nth,
  parseTimestamp,
  formatUsername,
  formatNumber,
  replaceVariables,
  splitMessage,
  formatError,
  delay,
  titleCase
};
