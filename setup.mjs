import { confirm, input, password } from "@inquirer/prompts";
import { Client, GatewayIntentBits } from "discord.js";
import chalk from "chalk";
import fs from "fs";

async function createChannels(token, serverId) {
  try {
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
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
      debugChannel: debugChannel.id
    };
  } catch (error) {
    console.log(error);
    return {
      guildChatChannel: "",
      officerChannel: "",
      loggingChannel: "",
      debugChannel: ""
    };
  }
}
function capitalize(str) {
  if (!str) return null;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const regexValues = {
  token: {
    regex: /[a-zA-Z0-9]{24}.[a-zA-Z0-9]{6}.[a-zA-Z0-9]{27}/g,
    format: "xxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  },
  hypixelAPIkey: {
    regex: /[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}/g,
    format: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  },
  imgurAPIkey: { regex: /[a-zA-Z0-9]{15}/g, format: "15 characters long, consisting of letters and numbers" }
};

const presetConfigValues = { test: "meow" };

function validate(value, regexData = null) {
  return new Promise((resolve) => {
    if (value.length === 0) resolve("This is required!");
    if (regexData) {
      if (!regexData.regex.test(value)) {
        resolve(`Input Invalid Format! Your input should be following this format: ${regexData.format}`);
      }
    }
    resolve(true);
  });
}

async function parseConfig(config, path = null) {
  const fixedConfig = {};
  if (path) console.log(chalk.magenta(`Now showing options for ${chalk.bold.greenBright(path)}`));
  for (const [key, value] of Object.entries(config)) {
    const message = path ? `${path} ${capitalize(key)}` : capitalize(key);
    if (typeof config[key] === "object") {
      fixedConfig[key] = await parseConfig(config[key], message);
    } else if (typeof config[key] === "string") {
      fixedConfig[key] = await input({
        message,
        default: presetConfigValues?.[key] ?? value ?? "",
        validate: (input) => validate(input, regexValues?.[key] ?? null)
      });
    } else if (typeof config[key] === "boolean") {
      fixedConfig[key] = await confirm({
        message: `Do you want to enable ${message}?`,
        default: presetConfigValues?.[key] ?? value ?? "",
        validate: (input) => validate(input, regexValues?.[key] ?? null)
      });
      if (key === "enable" && fixedConfig[key] === false) {
        config[key] = false;
        console.log(config);
        return config;
      }
    }
  }
  return fixedConfig;
}

(async () => {
  console.log(
    chalk.bold(
      `Welcome to the Quick Setup for Hypixel-Discord-Chat-Bridge created by ${chalk.greenBright("Kathund!")}\nBot Made by ${chalk.magenta("DuckySoLucky")}!`
    )
  );

  console.log("");

  if (fs.existsSync("config.json")) {
    console.log(chalk.bold.red("Config file already exists."));
    const check = await confirm({
      message: "Do you want to overwrite the current config file?",
      default: false
    });
    if (check === false) {
      console.log(chalk.bold.red("Exiting..."));
      process.exit(0);
    }
    console.log(chalk.bold.red("Overwriting current config file..."));
    fs.unlinkSync("config.json");
  }

  if (!fs.existsSync("./auth-cache")) {
    const minecraftBotSigninCheck = await confirm({
      message: "Do you want to sign into an minecraft account?",
      default: true
    });

    if (minecraftBotSigninCheck) {
      console.log("I'm bad at coding so this doesn't exist");
    }
  }

  const discordChannelsAutoSetup = await confirm({
    message: "Do you want to auto setup discord channels?",
    default: true
  });

  if (discordChannelsAutoSetup) {
    const botToken = await input({
      message: "Discord Bot Token",
      validate: (input) => validate(input, regexValues.botToken)
    });
    const serverId = await input({ message: "Discord Server Id", validate: (input) => validate(input) });
    const discordChannels = await createChannels(botToken, serverId);

    presetConfigValues["token"] = botToken;
    presetConfigValues["serverID"] = serverId;
    for (const [key, value] of Object.entries(discordChannels)) {
      presetConfigValues[key] = value;
    }
  }

  const defaultConfig = JSON.parse(fs.readFileSync("config.example.json", "utf-8"));
  const parsed = await parseConfig(defaultConfig);
  console.log(parsed);
})();
