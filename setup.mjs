import { Client, GatewayIntentBits } from "discord.js";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("config.example.json"));
const HypixelAPIKeyRegex = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/;
const ImgurAPIKeyRegex = /^[a-zA-Z0-9]{15}$/;
const discordTokenRegex = /^[a-zA-Z0-9]{24}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9]{27}$/;

async function createChannels(token, serverId) {
  try {
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });

    await client.login(token).catch(console.error);

    const guild = await client.guilds.fetch(serverId);
    const guildChatChannel = await guild.channels
      .create({ name: "guild-chat", reason: "Setting up Guild Channels" })
      .then(console.log("Created Guild Channel"))
      .catch(console.error);
    const officerChannel = await guild.channels
      .create({ name: "officer-chat", reason: "Setting up Guild Channels" })
      .then(console.log("Created Officer Channel"))
      .catch(console.error);
    const loggingChannel = await guild.channels
      .create({ name: "logging-channel", reason: "Setting up Guild Channels" })
      .then(console.log("Created Logging Channel"))
      .catch(console.error);
    const debugChannel = await guild.channels
      .create({ name: "debug-channel", reason: "Setting up Guild Channels" })
      .then(console.log("Created Debug Channel"))
      .catch(console.error);

    await client.destroy();

    return {
      guildChatChannel: guildChatChannel.id,
      officerChannel: officerChannel.id,
      loggingChannel: loggingChannel.id,
      debugMode: true,
      debugChannel: debugChannel.id,
      allowedBots: [],
    };
  } catch (error) {
    console.log(error);
    return {
      guildChatChannel: "",
      officerChannel: "",
      loggingChannel: "",
      debugMode: true,
      debugChannel: "",
      allowedBots: [],
    };
  }
}

(async () => {
  console.log(
    chalk.bold(
      `Welcome to the Quick Setup for Hypixel-Discord-Chat-Bridge created by ${chalk.greenBright("Kathund!")}\nBot Made by ${chalk.magenta("DuckySoLucky")}!\n`,
    ),
  );
  if (fs.existsSync("config.json")) {
    console.log(chalk.red(chalk.bold("\nConfig file already exists.")));
    const check = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "Do you want to overwrite the current config file?",
        default: false,
      },
    ]);
    if (check.overwrite === false) {
      console.log(chalk.red(chalk.bold("\nExiting...")));
      process.exit(0);
    } else {
      console.log(chalk.red(chalk.bold("Overwriting current config file...\n")));
      fs.unlinkSync("config.json");
    }
  }
  const minecraftBot = await inquirer.prompt([
    { type: "input", name: "prefix", message: "Minecraft Guild Commands Prefix", default: "!" },
  ]);
  const minecraftCommands = await inquirer.prompt([
    { type: "confirm", name: "normal", message: "Minecraft Guild Normal Commands", default: true },
    { type: "confirm", name: "soupy", message: "Minecraft Guild Soupy Commands", default: true },
  ]);
  const minecraftFragBot = await inquirer.prompt([
    { type: "confirm", name: "enabled", message: "Minecraft Frag Bot Enabled", default: true },
  ]);
  const minecraftAPI = await inquirer.prompt([
    {
      type: "password",
      name: "hypixelAPIkey",
      message: "Hypixel API Key",
      validate: (input) => {
        if (input.trim() === "") {
          return "You can receive Hypixel API key by going to the Hypixel Developer Dashboard (https://developer.hypixel.net/dashboard/) and creating new application.";
        }
        if (!HypixelAPIKeyRegex.test(input)) {
          return "Invalid API key format. The key should follow the pattern xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.";
        }
        return true;
      },
    },
    {
      type: "password",
      name: "imgurAPIkey",
      message: "Imgur API Key",
      validate: (input) => {
        if (input.trim() === "") {
          return "You can receive Imgur API key by going to the sign up page (https://api.imgur.com/oauth2/addclient) filling out the infomation.";
        }
        if (!ImgurAPIKeyRegex.test(input)) {
          return "Invalid API key format. The key should be 15 characters long, consisting of letters and numbers.";
        }
        return true;
      },
    },
  ]);
  console.log(
    chalk.bold(
      "\nThese are the requirements for the guild. If you don't want to enable the guild requirements checker, just press enter. The requirement -1 is disabled.",
    ),
  );
  const requirementsInputs = await inquirer.prompt([
    { type: "confirm", name: "enabled", message: "Guild Requirements checker", default: false },
    {
      type: "confirm",
      name: "autoAccept",
      message: "If someone has the requirements accept them automatically",
      default: false,
    },
  ]);
  const requirements = await inquirer.prompt([
    { type: "number", name: "bedwarsStars", message: "Bedwars Stars Requirement", default: -1 },
    { type: "number", name: "bedwarsStarsWithFKDR", message: "Bedwars Stars With FKDR Requirement", default: -1 },
    { type: "number", name: "bedwarsFKDR", message: "Bedwars FKDR Requirement", default: -1 },
    { type: "number", name: "skywarsStars", message: "Skywars Stars Requirement", default: -1 },
    { type: "number", name: "skywarsStarsWithKDR", message: "Skywars Stars With KDR Requirement", default: -1 },
    { type: "number", name: "skywarsKDR", message: "Skywars KDR Requirement", default: -1 },
    { type: "number", name: "duelsWins", message: "Duels Wins Requirement", default: -1 },
    { type: "number", name: "duelsWinsWithWLR", message: "Duels Wins With WLR Requirement", default: -1 },
    { type: "number", name: "duelsWLR", message: "Duels WLR Requirement", default: -1 },
    { type: "number", name: "senitherWeight", message: "Senither Weight Requirement", default: -1 },
    { type: "number", name: "lilyWeight", message: "Lily Weight Requirement", default: -1 },
    { type: "number", name: "skyblockLevel", message: "Skyblock Level Requirement", default: -1 },
  ]);
  console.log(
    chalk.bold(
      "\nSkyblock Event Notfications. These Notfications will go off when an event starts. Default options in on",
    ),
  );
  const skyblockNotificationsToggle = await inquirer.prompt([
    { type: "confirm", name: "enabled", message: "Global Toggle", default: true },
  ]);
  const skyblockNotifications = await inquirer.prompt([
    { type: "confirm", name: "BANK_INTEREST", message: "Bank Interest", default: true },
    { type: "confirm", name: "DARK_AUCTION", message: "Dark Auction", default: true },
    { type: "confirm", name: "ELECTION_BOOTH_OPENS", message: "Election Booth Opens", default: true },
    { type: "confirm", name: "ELECTION_OVER", message: "Election Over", default: true },
    { type: "confirm", name: "FALLEN_STAR_CULT", message: "Fallen Star Cult", default: true },
    { type: "confirm", name: "FEAR_MONGERER", message: "Fear Mongerer", default: true },
    { type: "confirm", name: "JACOBS_CONTEST", message: "Jacobs Contest", default: true },
    { type: "confirm", name: "JERRYS_WORKSHOP", message: "Jerrys Workshop", default: true },
    { type: "confirm", name: "NEW_YEAR_CELEBRATION", message: "New Year Celebration", default: true },
    { type: "confirm", name: "SEASON_OF_JERRY", message: "Season Of Jerry", default: true },
    { type: "confirm", name: "SPOOKY_FESTIVAL", message: "Spooky Festival", default: true },
    { type: "confirm", name: "TRAVELING_ZOO", message: "Traveling Zoo", default: true },
    { type: "confirm", name: "HOPPITY_HUNT", message: "Hoppity Hunt", default: true },
  ]);
  console.log(
    chalk.bold("\nHypixel Updates Notfications. These Notfications will go off when theres an update with hypixel"),
  );
  const hypixelNotfications = await inquirer.prompt([
    { type: "confirm", name: "enabled", message: "enabled", default: true },
    { type: "confirm", name: "hypixelNews", message: "Hypixel News", default: true },
    { type: "confirm", name: "statusUpdates", message: "Status Updates", default: true },
    { type: "confirm", name: "skyblockVersion", message: "Skyblock Version", default: true },
  ]);
  console.log(
    chalk.bold(
      "\nYour discord bot is required to have all 3 Gateway Intents (Presence, Server Members, Message Content)",
    ),
  );
  const discordBot = await inquirer.prompt([
    {
      type: "password",
      name: "token",
      message: "Discord Bot Token",
      validate: (input) => {
        if (input.trim() === "") {
          return "Token is required";
        }
        if (!discordTokenRegex.test(input)) {
          return "Invalid token format. The token should follow the pattern xxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "serverID",
      message: "Discord Server ID",
      validate: (input) => {
        if (input.trim() === "") {
          return "Server id is required";
        }
        return true;
      },
    },
  ]);
  const checks = await inquirer.prompt([{ type: "confirm", name: "inServer", message: "Is the bot in the server" }]);
  if (checks.inServer === false) {
    const id = Buffer.from(discordBot.token.split(".")[0], "base64").toString("ascii");
    console.log("Please invite the bot using this url");
    console.log(`https://discord.com/oauth2/authorize?client_id=${id}&permissions=8&integration_type=0&scope=bot`);
  }
  console.log(chalk.bold("\nNow lets setup your channels"));
  let channels = await inquirer.prompt([
    { type: "confirm", name: "channelSetup", message: "Do you already have the required channels created?" },
    {
      type: "confirm",
      name: "autoCreate",
      message: "Would you like the bot to create the channels for you?",
      when: (answers) => !answers.channelSetup,
    },
    {
      type: "input",
      name: "guildChatChannel",
      message: "Guild Chat Channel",
      when: (answers) => !answers.autoCreate,
      validate: (input) => {
        if (input.trim() === "") {
          return "Guild Chat Channel is required";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "officerChannel",
      message: "Officer Chat Channel",
      when: (answers) => !answers.autoCreate,
      validate: (input) => {
        if (input.trim() === "") {
          return "Officer Chat Channel is required";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "loggingChannel",
      message: "Logging Channel",
      when: (answers) => !answers.autoCreate,
      validate: (input) => {
        if (input.trim() === "") {
          return "Logging Channel is required";
        }
        return true;
      },
    },
    { type: "input", name: "debugChannel", message: "Debug Channel", when: (answers) => !answers.autoCreate },
  ]);
  if (channels.autoCreate === false) {
    channels = {
      guildChatChannel: channels.guildChatChannel,
      officerChannel: channels.officerChannel,
      loggingChannel: channels.loggingChannel,
      debugMode: true,
      debugChannel: channels.debugChannel,
      allowedBots: [],
    };
  } else if (channels.autoCreate === true) {
    channels = await createChannels(discordBot.token, discordBot.serverID);
  }
  console.log(chalk.bold("\nLets setup how your commands behave"));
  const commands = await inquirer.prompt([
    {
      type: "confirm",
      name: "checkPerms",
      message: "Staff commands check if the user has the correct role to run the command",
      default: true,
    },
    {
      type: "input",
      name: "commandRole",
      message: "Staff role id",
      validate: (input) => {
        if (input.trim() === "") {
          return "Staff role id is required";
        }
        return true;
      },
    },
    { type: "input", name: "blacklistRole", message: "Blacklist role id" },
  ]);
  console.log(chalk.bold("\nDiscord Other settings"));
  const discordOther = await inquirer.prompt([
    {
      type: "list",
      name: "messageMode",
      message: "Message Mode: Either embed minecraft or webhook",
      choices: ["minecraft", "embed", "webhook"],
      default: 0,
    },
    { type: "confirm", name: "filterMessages", message: "Filter Messages", default: true },
    { type: "confirm", name: "joinMessage", message: "Send a message when someone joins or leaves", default: true },
    { type: "confirm", name: "autoLimbo", message: "Auto Limbo", default: false },
  ]);
  console.log(chalk.bold("\nOther settings"));
  const other = await inquirer.prompt([
    { type: "confirm", name: "autoUpdater", message: "Should the bot check for updates", default: true },
    {
      type: "number",
      name: "autoUpdaterInterval",
      message: "How often in hours should the bot check for updates",
      default: 12,
    },
    { type: "confirm", name: "logToFiles", message: "Save logs to files", default: true },
  ]);
  const verificationToggle = await inquirer.prompt([
    {
      type: "confirm",
      name: "enabled",
      message: "determines whether the verification system is enabled",
      default: true,
    },
  ]);
  if (verificationToggle.enabled) {
    const verification = await inquirer.prompt([
      {
        type: "input",
        name: "role",
        message: "determines what role user will receive upon successful verification",
        validate: (input) => {
          if (input.trim() === "") {
            return "Role is required";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "guildMemberRole",
        message: "determines what role user will receive upon being member of the guild",
        validate: (input) => {
          if (input.trim() === "") {
            return "Guild Member Role is required";
          }
          return true;
        },
      },
      {
        type: "confirm",
        name: "autoUpdater",
        default: true,
        message: "option allows you to toggle the auto updating of all verified users",
      },
      {
        type: "number",
        name: "autoUpdaterInterval",
        default: 24,
        message: "allows you to change how often the autoUpdater runs. (in hours)",
      },
      {
        type: "confirm",
        name: "autoUnverify",
        default: true,
        message: "option allows you to toggle the auto unverifying the user  when they leave the discord",
      },
      { type: "input", name: "updateLogs", message: "Logs the auto updater will send to the channel" },
      {
        type: "input",
        name: "name",
        default: "{username}",
        message: "option lets you set what a verfied user has there nickname set to in the server",
      },
    ]);
    config.verification = verification;
    config.verification.enabled = true;
  }
  config.minecraft.bot.prefix = minecraftBot.prefix;
  config.minecraft.commands = minecraftCommands;
  config.minecraft.fragBot.enabled = minecraftFragBot.enabled;
  config.minecraft.API = minecraftAPI;
  config.minecraft.guildRequirements = { ...requirementsInputs, requirementsValues: requirements };
  config.minecraft.skyblockEventsNotifications = {
    ...skyblockNotificationsToggle,
    notifiers: skyblockNotifications,
    customTime: { 2: ["BANK_INTEREST", "DARK_AUCTION", "JACOBS_CONTEST"] },
  };
  config.minecraft.hypixelUpdates = hypixelNotfications;
  config.discord.bot = discordBot;
  config.discord.channels = channels;
  config.discord.commands = { ...commands, users: ["486155512568741900"] };
  config.discord.other = discordOther;
  config.other = other;
  fs.writeFileSync("config.json", JSON.stringify(config, null, 2));
  console.log(chalk.bold("Setup is complete!"));
})();
