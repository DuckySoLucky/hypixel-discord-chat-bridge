const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getStats } = require("../../contracts/helperFunctions.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");
const config = require("../../../config.json");
const axios = require("axios");

class MonthlyStatsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "monthly";
    this.aliases = [""];
    this.description = "Get monthly stats of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
      {
        name: "gamemode",
        description: "Gamemode",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    const modes = [
      "bw",
      "bedwars",
      "bedwar",
      "bws",
      "sw",
      "skywars",
      "skywar",
      "sws",
      "duels",
      "duel",
      "d",
      "sb",
      "skyblock",
    ];
    const args = this.getArgs(message).map((arg) => arg.replaceAll("/", ""));

    const mode = modes.includes(args[0])
      ? args[0]
      : modes.includes(args[1])
      ? args[1]
      : null;
    username =
      (args[0] == mode
        ? args[1] === ""
          ? username
          : args[1]
        : args[0] === ""
        ? username
        : args[0]) || username;

    try {
      const uuid = await getUUID(username);

      this.send(await getStats(username, uuid, mode, "monthly"));
    } catch (error) {
      if (error === "Player not in database") {
        this.send(
          `/gc ${username} is not registered in the database! Adding them now..`
        );

        const uuid = await getUUID(username);
        let res;
        if (["sb", "skyblock"].includes(mode)) {
          res = await axios.post(
            `https://api.pixelic.de/player/skyblock/${uuid}/register?key=${config.minecraft.API.pixelicAPIkey}`
          );
        } else {
          res = await axios.post(
            `https://api.pixelic.de/player/${uuid}/register?key=${config.minecraft.API.pixelicAPIkey}`
          );
        }

        if (res.status == 201) {
          this.send(`/gc Successfully registered ${username} in the database!`);
        } else if (res.status == 404) {
          this.send(
            `/gc Uh oh, somehow this player is already registered in the database! Please try again in few seconds..`
          );
        } else if (res.status == 409) {
          this.send(
            `/gc Uh oh, this player is already queued to be registered! Please be patient and try again later.`
          );
        } else {
          this.send(
            `/gc Error: ${res.status} ${
              res?.statusText || "Something went wrong.."
            }`
          );
        }
      } else {
        this.send(`/gc Error: ${error}`);
      }
    }
  }
}

module.exports = MonthlyStatsCommand;
