const minecraftCommand = require("../../contracts/minecraftCommand.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getTalismans = require("../../../API/stats/talismans.js");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");

class AccessoriesCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "accessories";
    this.aliases = ["talismans", "talisman"];
    this.description = "Accessories of specified user.";
    this.options = ["name"];
    this.optionsDescription = ["Minecraft Username"];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      const talismans = await getTalismans(data.profile);

      const talismanCount = Object.keys(talismans.talismans)
        .map((rarity) => talismans.talismans[rarity].length || 0)
        .reduce((a, b) => a + b, 0);

      const recombobulatedCount = Object.keys(talismans.talismans)
        .map((rarity) =>talismans.talismans[rarity].filter((talisman) => talisman.recombobulated).length)
        .reduce((a, b) => a + b, 0);

      const enrichmentCount = Object.keys(talismans.talismans)
        .map((rarity) =>talismans.talismans[rarity].filter((talisman) => talisman.enrichment !== undefined).length)
        .reduce((a, b) => a + b, 0);

      this.send(`/gc ${username}'s Accessories » ${talismanCount} | Recombobulated » ${recombobulatedCount} | Enriched » ${enrichmentCount}`);

      await delay(690);

      this.send(`/gc ${username}'s Accessories » Common - ${talismans.talismans["common"].length} | Uncommon - ${talismans.talismans["uncommon"].length} | Rare - ${talismans.talismans["rare"].length} | Epic - ${talismans.talismans["epic"].length} |  Legendary - ${talismans.talismans["legendary"].length} | Special - ${talismans.talismans["special"].length} | Very Special - ${talismans.talismans["very"].length}`);

    } catch (error) {
      this.send(`/gc Error: ${error}`);
    }
  }
}

module.exports = AccessoriesCommand;
