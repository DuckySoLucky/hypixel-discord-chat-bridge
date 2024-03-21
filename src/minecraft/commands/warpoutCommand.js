const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");
const { fetchGuildAPI } = require("../../../API/functions/GuildAPI");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class warpoutCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);
    this.name = "warpout";
    this.aliases = ["warp"];
    this.description = "Warp player out of the game";
    this.options = [];
    this.isOnCooldown = false;
  }
  async onCommand(username, message) {
    try {
      if (this.isOnCooldown) {
        return this.send(`/gc ${username} Command is on cooldown`);
      }

      this.isOnCooldown = true;

      const user = this.getArgs(message)[0];
      if (user === undefined) {
        // eslint-disable-next-line no-throw-literal
        throw "Please provide a username!";
      }

        // Fetch UUID for the command issuer
        const issuerUUID = await getUUID(username);

        if (!issuerUUID) {
            this.send (`/oc UUID not found for player ${username}.`);
        }

        // Fetch guild data
        const guildData = await fetchGuildAPI();

        // Get the guild member data for the command issuer
        const issuerMemberData = guildData.members.find(member => member.uuid === issuerUUID);

        if (!issuerMemberData) {
            this.send (`/oc Player ${username} not found in the guild data.`);
        }

        // Define the acceptable ranks
        const acceptableRanks = ["Guild Master", "Shadow Herald", "Shadow Council"];

        // Check if the player has an acceptable rank
        if (!acceptableRanks.includes(issuerMemberData.rank)) {
            await this.send(`/gc Player ${username} does not have the required rank to run this command.`);
            return;
        }    


      this.send("/lobby megawalls");
      await delay(250);
      this.send("/play skyblock");

      const warpoutListener = async (message) => {
        message = message.toString();

        if (message.includes("You cannot invite that player since they're not online.")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;

          this.send(`/gc ${user} is not online!`);
        } else if (message.includes("You cannot invite that player!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;

          this.send(`/gc ${user} has party requests disabled!`);
        } else if (message.includes("invited") && message.includes("to the party! They have 60 seconds to accept.")) {
          this.send(`/gc Succesfully invited ${user} to the party!`);
        } else if (message.includes(" joined the party.")) {
          this.send(`/gc ${user} joined the party! Warping them out of the game..`);
          this.send("/p warp");
        } else if (message.includes("warped to your server")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`/gc ${user} warped out of the game! Disbanding party..`);
          this.send("/p disband");

          await delay(1500);
          this.send("\u00a7");
        } else if (message.includes(" cannot warp from Limbo")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`/gc ${user} cannot be warped from Limbo! Disbanding party..`);
          this.send("/p disband");
        } else if (message.includes(" is not allowed on your server!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`/gc ${user} is not allowed on my server! Disbanding party..`);

          this.send("/p leave");
          await delay(1500);
          this.send("\u00a7");
        } else if (message.includes("You are not allowed to invite players.")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`/gc Somehow I'm not allowed to invite players? Disbanding party..`);

          this.send("/p disband");
          await delay(1500);
          this.send("\u00a7");
        } else if (message.includes("You are not allowed to disband this party.")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`/gc Somehow I'm not allowed to disband this party? Leaving party..`);

          this.send("/p leave");
          await delay(1500);
          this.send("\u00a7");
        } else if (message.includes("You can't party warp into limbo!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`/gc Somehow I'm inside in limbo? Disbanding party..`);
          this.send("/p disband");
        } else if (message.includes("Couldn't find a player with that name!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;

          this.send(`/gc Couldn't find a player with that name!`);
          this.send("/p disband");
        } else if (message.includes("You cannot party yourself!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;

          this.send(`/gc I cannot party yourself!`);
        } else if (message.includes("didn't warp correctly!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;

          this.send(`/gc ${user} didn't warp correctly! Please try again..`);
          this.send("/p disband");
        }
      };

      bot.on("message", warpoutListener);
      this.send(`/p invite ${user} `);
      setTimeout(() => {
        bot.removeListener("message", warpoutListener);

        if (this.isOnCooldown === true) {
          this.send("/gc Party timed out");
          this.send("/p disband");
          this.send("\u00a7");

          this.isOnCooldown = false;
        }
      }, 30000);
    } catch (error) {
      this.send(`/gc ${username} [ERROR] ${error || "Something went wrong.."}`);
      this.isOnCooldown = false;
    }
  }
}

module.exports = warpoutCommand;
