const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { titleCase } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");

class RenderCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "pet";
    this.aliases = ["pets"];
    this.description = "Sends an active pet of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false
      }
    ];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile } = await getLatestProfile(player);

      const pets = profile.pets_data?.pets ?? [];
      if (pets.length === 0) {
        return this.send(`${username} does not have any pets.`);
      }

      const activePet = pets.find((pet) => pet.active === true);
      if (activePet === undefined) {
        return this.send(`${username} does not have pet equiped.`);
      }

      this.send(`${username}'s Active Pet: ${titleCase(activePet.tier)} ${titleCase(activePet.type)}`);
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = RenderCommand;
