const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getStats } = require("../../contracts/helperFunctions.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");
const config = require("../../../config.json");
const axios = require("axios");

class DailyStatsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "daily";
    this.aliases = [""];
    this.description = "Get your daily stats.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
      {
        name: "mode",
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
      "skyblock",
      "sb",
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

      this.send(await getStats(username, uuid, mode, "daily"));
    } catch (error) {
      console.log("catch", error);
      if (error === "Player not in database") {
        this.send(`/gc ${username} is not registered in the database! Adding them now..`);

        try {
          const uuid = await getUUID(username);
          const res = await axios.post(
            ["sb", "skyblock"].includes(mode)
              ? `https://api.pixelic.de/player/skyblock/${uuid}/register?key=${config.minecraft.API.pixelicAPIkey}`
              : `https://api.pixelic.de/player/${uuid}/register?key=${config.minecraft.API.pixelicAPIkey}`
          );


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
        } catch (e) {
          console.group(e.response.data)
          this.send(`/gc Error: ${e.response.data.cause}`);
        }
      } else {
        this.send(`/gc Error: ${error}`);
      }
    }
  }
}

module.exports = DailyStatsCommand;
