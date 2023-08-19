const chalk = require("chalk");

async function discordMessage(message) {
  return console.log(chalk.bgMagenta.black(`[${await getCurrentTime()}] Discord >`) + " " + chalk.magenta(message));
}

async function minecraftMessage(message) {
  return console.log(
    chalk.bgGreenBright.black(`[${await getCurrentTime()}] Minecraft >`) + " " + chalk.greenBright(message)
  );
}

async function webMessage(message) {
  return console.log(chalk.bgCyan.black(`[${await getCurrentTime()}] Web >`) + " " + chalk.cyan(message));
}

async function warnMessage(message) {
  return console.log(chalk.bgYellow.black(`[${await getCurrentTime()}] Warning >`) + " " + chalk.yellow(message));
}

async function errorMessage(message) {
  return console.log(chalk.bgRedBright.black(`[${await getCurrentTime()}] Error >`) + " " + chalk.redBright(message));
}

async function broadcastMessage(message, location) {
  return console.log(chalk.inverse(`[${await getCurrentTime()}] ${location} Broadcast >`) + " " + message);
}

async function getCurrentTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
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
    `${chalk.bgRedBright.black(`[${await getCurrentTime()}] Config Update >`)} ${chalk.redBright("Added")} ${chalk.gray(
      message
    )} ${chalk.redBright("to config.json")}`
  );
}

async function updateMessage() {
  const columns = process.stdout.columns;
  const warning = "IMPORTANT!";
  const message2 = "Bot has updated, please restart the bot to apply changes!";
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
