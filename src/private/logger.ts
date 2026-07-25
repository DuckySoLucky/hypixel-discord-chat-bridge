import chalk from "chalk";
import { Logger, createLogger, format, transports } from "winston";
import { access, readFile } from "node:fs/promises";
import { getTimestamp, titleCase } from "../utils/stringUtils.js";
import type { LogData } from "../types/misc.js";

const otherLog = { level: "other", background: chalk.bgCyan.black, color: chalk.reset.cyan };
const logs: LogData[] = [
  { level: "discord", background: chalk.bgMagenta.black, color: chalk.reset.magenta },
  { level: "minecraft", background: chalk.bgGreen.black, color: chalk.reset.green },
  { level: "scripts", background: chalk.bgBlue.black, color: chalk.reset.blue },
  { level: "broadcast", background: chalk.inverse, color: chalk.reset },
  otherLog,
  { level: "warn", background: chalk.bgYellow.black, color: chalk.reset.yellow },
  { level: "error", background: chalk.bgRedBright.black, color: chalk.reset.redBright },
  { level: "max", background: chalk.bgBlack.black, color: chalk.reset.black }
];

function getErrorString(error: Error): string {
  const message = error.toString();
  const stack = error.stack?.replaceAll(message, "").replaceAll("Hypixel Discord Guild Chat Bridge:", "\nHypixel Discord Guild Chat Bridge:");
  return [message, stack, error.cause ? `Cause: ${String(error.cause)}` : undefined].filter(Boolean).join("");
}

function logSomething(message: string, log: LogData): void {
  console.log(log.background(`[${getTimestamp()}] ${titleCase(log.level)} >${log.color(` ${message}`)}`));
}

try {
  await access("config.json");
} catch {
  const log = logs.find((log) => log.level === "error") || otherLog;
  logSomething("`config.json` does not exist. Please use `pnpm generate:config` to generate a config", log);
  process.exit(0);
}
const config = JSON.parse(await readFile("config.json", "utf-8"));

const defaultPath = `./logs/${new Date().toISOString()}`;
const fileLoggingEnabled = config.other?.logToFiles;
const fullTransport = fileLoggingEnabled ? new transports.File({ level: "max", filename: `${defaultPath}/full.log` }) : undefined;
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
        return `[${getTimestamp()}] ${titleCase(log.level)} > ${message}`;
      })
    ),
    transports: fileLoggingEnabled
      ? [new transports.File({ level: log.level, filename: `${defaultPath}/${log.level}.log` }), fullTransport as transports.FileTransportInstance]
      : []
  });
});

console.discord = (message: string): void => {
  const log = logs.find((log) => log.level === "discord") || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger && fileLoggingEnabled) logger.log(log.level, message);
};

console.minecraft = (message: string): void => {
  const log = logs.find((log) => log.level === "minecraft") || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger && fileLoggingEnabled) logger.log(log.level, message);
};

console.scripts = (message: string): void => {
  const log = logs.find((log) => log.level === "scripts") || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger && fileLoggingEnabled) logger.log(log.level, message);
};

console.broadcast = (message: string, location: string): void => {
  message = `${location} | ${message}`;
  const log = logs.find((log) => log.level === "broadcast") || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger && fileLoggingEnabled) logger.log(log.level, message);
};

console.other = (message: string): void => {
  const log = logs.find((log) => log.level === "other") || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger && fileLoggingEnabled) logger.log(log.level, message);
};

console.warn = (message: string): void => {
  const log = logs.find((log) => log.level === "warn") || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger && fileLoggingEnabled) logger.log(log.level, message);
};

console.error = (message: Error): void => {
  const log = logs.find((log) => log.level === "error") || otherLog;
  const errorString = getErrorString(message);
  logSomething(errorString, log);
  const logger = loggers[log.level];
  if (logger && fileLoggingEnabled) logger.log(log.level, errorString);
};

// eslint-disable-next-line import/prefer-default-export
export function displayBigMessage(message: string) {
  const columns = process.stdout.columns;
  const warning = "IMPORTANT!";
  const padding = " ".repeat(Math.floor((columns - warning.length + 1) / 2));
  const padding2 = " ".repeat(Math.floor((columns - message.length + 1) / 2));

  console.log(chalk.bgRed.black(" ".repeat(columns).repeat(3)));
  console.log(chalk.bgRed.black(padding + warning + padding));
  console.log(chalk.bgRed.black(padding2 + message + padding2));
  console.log(chalk.bgRed.black(" ".repeat(columns).repeat(3)));
}
