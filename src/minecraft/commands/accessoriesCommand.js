const minecraftCommand = require("../../contracts/minecraftCommand.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getTalismans = require("../../../API/stats/talismans.js");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");

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
      const arg = this.getArgs(message);
      if (arg[0]) username = arg[0];
      const data = await getLatestProfile(username);
      if (data.status === 404) {
        return this.send(
          "/gc There is no player with the given UUID or name or the player has no Skyblock profiles."
        );
      }
      username = data.profileData?.game_mode ? `♲ ${username}` : username;
      const talismans = await getTalismans(data.profile);
      const common = talismans?.common?.length,
        uncommon = talismans?.uncommon?.length,
        rare = talismans?.rare?.length,
        epic = talismans?.epic?.length,
        legendary = talismans?.legendary?.length,
        mythic = talismans?.mythic?.length,
        special = talismans?.special?.length,
        verySpecial = talismans?.very?.length;
      let recombobulated = 0,
        enrichment = 0;
      const talismanCount =
        common +
        uncommon +
        rare +
        epic +
        legendary +
        mythic +
        special +
        verySpecial;

      for (const rarity of Object.keys(talismans)) {
        if (
          [
            "talismanBagUpgrades",
            "curretnReforge",
            "unlockedReforges",
            "tuningsSlots",
            "tunings",
          ].includes(rarity)
        ) {
          continue;
        }

        for (const talisman of talismans[rarity]) {
          if (talisman.recombobulated) recombobulated++;
          if (talisman.enrichment) enrichment++;
        }
      }

      this.send(
        `/gc ${username}'s Accessories » ${talismanCount} | Recombobulated » ${recombobulated} | Enriched » ${enrichment}`
      );
      await delay(690);
      this.send(
        `/gc ${username}'s Accessories » Common - ${common} | Uncommon - ${uncommon} | Rare - ${rare} | Epic - ${epic} |  Legendary - ${legendary} | Special - ${special} | Very Special - ${verySpecial}`
      );
    } catch (error) {
      console.log(error);
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = AccessoriesCommand;
