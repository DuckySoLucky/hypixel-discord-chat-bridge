import chalk from "chalk";
import { Logger, createLogger, format, transports } from "winston";
import { TitleCase } from "../Utils/StringUtils.js";
import type { LogData } from "../Types/Misc.js";

const otherLog = { level: "other", background: chalk.bgCyan.black, color: chalk.reset.cyan };

const logs: LogData[] = [
  { level: "discord", background: chalk.bgMagenta.black, color: chalk.reset.magenta },
  { level: "minecraft", background: chalk.bgGreen.black, color: chalk.reset.green },
  { level: "broadcast", background: chalk.inverse, color: chalk.reset },
  otherLog,
  { level: "warn", background: chalk.bgYellow.black, color: chalk.reset.yellow },
  { level: "error", background: chalk.bgRedBright.black, color: chalk.reset.redBright },
  { level: "max", background: chalk.bgBlack.black, color: chalk.reset.black }
];

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
    timeZone: "UTC"
  });
}

function getErrorString(error: Error): string {
  return `${error.toString()}${error.stack?.replaceAll(error.toString(), "").replaceAll("Hypixel Discord Guild Chat Bridge:", "\nHypixel Discord Guild Chat Bridge:")}`;
}

function logSomething(message: string, log: LogData): void {
  console.log(log.background(`[${getCurrentTime()}] ${TitleCase(log.level)} > ${log.color(message)}`));
}

const combinedTransport = new transports.File({ level: "max", filename: "./logs/combined.log" });
const loggers: { [key: string]: Logger } = {};
logs.forEach((log) => {
  loggers[log.level] = createLogger({
    level: log.level,
    levels: logs.reduce(
      (acc, name, index) => {
        acc[name.level] = index;
        return acc;
      },
      {} as Record<string, number>
    ),
    format: format.combine(
      format.printf(({ timestamp, level, message }) => {
        return `[${getCurrentTime()}] ${TitleCase(log.level)} > ${message}`;
      })
    ),
    transports: [new transports.File({ level: log.level, filename: `./logs/${log.level}.log` }), combinedTransport]
  });
});

console.discord = (message: string): void => {
  const log = logs.find((log) => log.level === "discord") || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger) logger.log(log.level, message);
};

console.minecraft = (message: string): void => {
  const log = logs.find((log) => log.level === "minecraft") || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger) logger.log(log.level, message);
};

console.broadcast = (message: string, location: string): void => {
  message = `${location} | ${message}`;
  const log = logs.find((log) => log.level === "broadcast") || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger) logger.log(log.level, message);
};

console.other = (message: string): void => {
  const log = logs.find((log) => log.level === "other") || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger) logger.log(log.level, message);
};

console.warn = (message: string): void => {
  const log = logs.find((log) => log.level === "warn") || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger) logger.log(log.level, message);
};

console.error = (message: Error): void => {
  const log = logs.find((log) => log.level === "error") || otherLog;
  const errorString = getErrorString(message);
  logSomething(errorString, log);
  const logger = loggers[log.level];
  if (logger) logger.log(log.level, errorString);
};

export function configUpdateMessage(message: string) {
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
    `${chalk.bgRedBright.black(`[${getCurrentTime()}] Config Update >`)} ${chalk.redBright("Added")} ${chalk.gray(message)} ${chalk.redBright("to config.json")}`
  );
}

export function updateMessage() {
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
