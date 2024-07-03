const customLevels = { discord: 0, minecraft: 1, web: 2, warn: 3, error: 4, broadcast: 5, max: 6 };
const { createLogger, format, transports } = require("winston");
const config = require("../config.json");
const chalk = require("chalk");

const discordTransport = new transports.File({ level: "discord", filename: "./logs/discord.log" });
const minecraftTransport = new transports.File({ level: "minecraft", filename: "./logs/minecraft.log" });
const webTransport = new transports.File({ level: "web", filename: "./logs/web.log" });
const warnTransport = new transports.File({ level: "warn", filename: "./logs/warn.log" });
const errorTransport = new transports.File({ level: "error", filename: "./logs/error.log" });
const broadcastTransport = new transports.File({ level: "broadcast", filename: "./logs/broadcast.log" });
const combinedTransport = new transports.File({ level: "max", filename: "./logs/combined.log" });

const discordLogger = createLogger({
  level: "discord",
  levels: customLevels,
  format: format.combine(
    format.timestamp({ format: getCurrentTime }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()} > ${message}`;
    })
  ),
  transports: [discordTransport, combinedTransport],
});

const minecraftLogger = createLogger({
  level: "minecraft",
  levels: customLevels,
  format: format.combine(
    format.timestamp({ format: getCurrentTime }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()} > ${message}`;
    })
  ),
  transports: [minecraftTransport, combinedTransport],
});

const webLogger = createLogger({
  level: "web",
  levels: customLevels,
  format: format.combine(
    format.timestamp({ format: getCurrentTime }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()} > ${message}`;
    })
  ),
  transports: [webTransport, combinedTransport],
});

const warnLogger = createLogger({
  level: "warn",
  levels: customLevels,
  format: format.combine(
    format.timestamp({ format: getCurrentTime }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()} > ${message}`;
    })
  ),
  transports: [warnTransport, combinedTransport],
});

const errorLogger = createLogger({
  level: "error",
  levels: customLevels,
  format: format.combine(
    format.timestamp({ format: getCurrentTime }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()} > ${message}`;
    })
  ),
  transports: [errorTransport, combinedTransport],
});

const broadcastLogger = createLogger({
  level: "broadcast",
  levels: customLevels,
  format: format.combine(
    format.timestamp({ format: getCurrentTime }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()} > ${message}`;
    })
  ),
  transports: [broadcastTransport, combinedTransport],
});

function discordMessage(message) {
  if (config.other.logToFiles) {
    discordLogger.log("discord", message);
  }

  return console.log(chalk.bgMagenta.black(`[${getCurrentTime()}] Discord >`) + " " + chalk.magenta(message));
}

function minecraftMessage(message) {
  if (config.other.logToFiles) {
    minecraftLogger.log("minecraft", message);
  }

  return console.log(chalk.bgGreenBright.black(`[${getCurrentTime()}] Minecraft >`) + " " + chalk.greenBright(message));
}

function webMessage(message) {
  if (config.other.logToFiles) {
    webLogger.log("web", message);
  }

  return console.log(chalk.bgCyan.black(`[${getCurrentTime()}] Web >`) + " " + chalk.cyan(message));
}

function warnMessage(message) {
  if (config.other.logToFiles) {
    warnLogger.log("warn", message);
  }

  return console.log(chalk.bgYellow.black(`[${getCurrentTime()}] Warning >`) + " " + chalk.yellow(message));
}

function errorMessage(message) {
  if (config.other.logToFiles) {
    errorLogger.log("error", message);
  }
  
  return console.log(chalk.bgRedBright.black(`[${getCurrentTime()}] Error >`) + " " + chalk.redBright(message));
}

function broadcastMessage(message, location) {
  if (config.other.logToFiles) broadcastLogger.log("broadcast", `${location} | ${message}`);
  return console.log(chalk.inverse(`[${getCurrentTime()}] ${location} Broadcast >`) + " " + message);
}

function getCurrentTime() {
  return new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZoneName: "short",
    timeZone: "UTC",
  });
}

async function configUpdateMessage(message) {
  const columns = process.stdout.columns;
  const warning = "IMPORTANT!";
  const message2 = "Please update your Configuration file!";
  const padding = " ".repeat(Math.floor((columns - warning.length + 1) / 2));
  const padding2 = " ".repeat(Math.floor((columns - message2.length + 1) / 2));

  console.log(chalk.bgRed.black(" ".repeat(columns).repeat(3)));
  console.log(chalk.bgRed.black(padding + warning + padding));
  console.log(chalk.bgRed.black(padding2 + message2 + padding2));
  console.log(chalk.bgRed.black(" ".repeat(columns).repeat(3)));
  console.log();
  console.log(
    `${chalk.bgRedBright.black(`[${getCurrentTime()}] Config Update >`)} ${chalk.redBright("Added")} ${chalk.gray(
      message
    )} ${chalk.redBright("to config.json")}`
  );
}

async function updateMessage() {
  const columns = process.stdout.columns;
  const warning = "IMPORTANT!";
  const message2 = "Bot has been updated, please restart the bot to apply changes!";
  const padding = " ".repeat(Math.floor((columns - warning.length + 1) / 2));
  const padding2 = " ".repeat(Math.floor((columns - message2.length + 1) / 2));

  console.log(chalk.bgRed.black(" ".repeat(columns).repeat(3)));
  console.log(chalk.bgRed.black(padding + warning + padding));
  console.log(chalk.bgRed.black(padding2 + message2 + padding2));
  console.log(chalk.bgRed.black(" ".repeat(columns).repeat(3)));
}

module.exports = {
  discordMessage,
  minecraftMessage,
  webMessage,
  warnMessage,
  errorMessage,
  broadcastMessage,
  getCurrentTime,
  configUpdateMessage,
  updateMessage,
};
