const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");
const { getStats } = require("../../contracts/helperFunctions.js");
const fetch = (...args) =>
  import("node-fetch")
    .then(({ default: fetch }) => fetch(...args))
    .catch((err) => console.log(err));

class WeeklyStatsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "weekly";
    this.aliases = [""];
    this.description = "Get your weekly stats";
    this.options = ["name", "gamemode"];
    this.optionsDescription = ["Minecraft Username", "Hypixel Gamemode"];
  }

  async onCommand(username, message) {
    const args = this.getArgs(message);
    let mode, player = username;

    if (["bw", "bedwars", "bedwar", "bws", "sw", "skywars", "skywar", "sws", "duels", "duel", "d"].includes(args[0])) {
      mode = args[0];
      if (args[1]) player = args[1];
    } 
    if (["bw", "bedwars", "bedwar", "bws", "sw", "skywars", "skywar", "sws", "duels", "duel", "d"].includes(args[1])) {
      mode = args[1];
      player = args[0];
    }

    const uuid = await getUUID(player);

    try {
      this.send(await getStats(player, uuid, mode, 'weekly', username));
    } catch (error) {
      if (error.response?.data?.error == "Player not in database") {
        this.send(
          `/gc ${
            player == username ? "You are" : `${player} is`
          } not in the database. ${
            player == username ? "You are" : `${player} is`
          } being added to the database..`
        );

        fetch(`https://api.pixelic.de/v1/player/register?uuid=${uuid}`, {
          method: "POST",
        }).then((res) => {
          if (res.status == 201) {
            this.send(`/gc Successfully registered ${player} in the database!`);
          } else if (res.status == 400) {
            this.send(`/gc ${player} is already registered in the database!`);
          } else {
            this.send(
              `/gc An error occured while registering ${player} in the database! Please try again in few seconds.`
            );
          }
        });
      }
    }
  }
}

module.exports = WeeklyStatsCommand;
