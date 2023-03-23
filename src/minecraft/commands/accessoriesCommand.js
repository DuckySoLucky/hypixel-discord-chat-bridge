const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getTalismans = require("../../../API/stats/talismans.js");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");

class AccessoriesCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "accessories";
    this.aliases = ["acc", "talismans", "talisman"];
    this.description = "Accessories of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
    ];
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
        .map(
          (rarity) =>
            talismans.talismans[rarity].filter(
              (talisman) => talisman.recombobulated
            ).length
        )
        .reduce((a, b) => a + b, 0);

      const enrichmentCount = Object.keys(talismans.talismans)
        .map(
          (rarity) =>
            talismans.talismans[rarity].filter(
              (talisman) => talisman.enrichment !== undefined
            ).length
        )
        .reduce((a, b) => a + b, 0);

      this.send(
        `/gc ${username}'s Accessories: ${talismanCount} (${talismans.talismans["very"].length}V, ${talismans.talismans["special"].length}S, ${talismans.talismans["mythic"].length}M, ${talismans.talismans["legendary"].length}L, ${talismans.talismans["epic"].length}E, ${talismans.talismans["rare"].length}R, ${talismans.talismans["uncommon"].length}U, ${talismans.talismans["common"].length}C), Recombed: ${recombobulatedCount}, Enriched: ${enrichmentCount}`
      );
    } catch (error) {
      this.send(`/gc Error: ${error}`);
    }
  }
}

module.exports = AccessoriesCommand;
