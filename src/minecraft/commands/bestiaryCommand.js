const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getBestiary } = require("../../../API/stats/bestiary.js");

class BestiaryCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "bestiary";
    this.aliases = ["be"];
    this.description = "Bestiary of specified user.";
    this.options = [
      {
        name: "username",
        description: "Mincraft Username",
        required: false,
      },
    ];
  }

  async onCommand(username, message, officer) {
    try {
      const args = this.getArgs(message);

      const playerUsername = username;
      const mob = args[1];
      username = args[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      const bestiary = getBestiary(data.profile);
      if (bestiary === null) {
        return this.send("This player has not yet joined SkyBlock since the bestiary update.", officer);
      }

      if (mob) {
        const mobData = this.getBestiaryObject(bestiary).find((m) => m.name.toLowerCase().includes(mob.toLowerCase()));

        if (mobData) {
          this.send(
            `${username}'s ${mobData.name} Bestiary: ${mobData.kills} / ${mobData.nextTierKills} (${
              mobData.nextTierKills - mobData.kills
            })`,
            officer,
          );

          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      this.send(
        `${username}'s Bestiary Milestone: ${bestiary.milestone} / ${bestiary.maxMilestone} | Unlocked Tiers: ${bestiary.tiersUnlocked} / ${bestiary.totalTiers}`,
        officer,
      );

      if (playerUsername === username) {
        const bestiaryData = this.getBestiaryObject(bestiary).sort(
          (a, b) => a.nextTierKills - a.kills - (b.nextTierKills - b.kills),
        );

        const topFive = bestiaryData.slice(0, 5);
        const topFiveMobs = topFive.map((mob) => {
          return `${mob.name}: ${mob.kills} / ${mob.nextTierKills} (${mob.nextTierKills - mob.kills})`;
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        this.send(`Closest to level up: ${topFiveMobs.join(", ")}`, officer);
      }
    } catch (error) {
      console.log(error);
      this.send(`[ERROR] ${error}`, officer);
    }
  }

  getBestiaryObject(bestiary) {
    return Object.keys(bestiary.categories)
      .map((category) => {
        if (category === "fishing") {
          Object.keys(bestiary.categories[category]).map((key) => {
            if (key === "name") return;
            return bestiary.categories[category][key].mobs.map((mob) => mob);
          });
        } else {
          return bestiary.categories[category].mobs.map((mob) => mob);
        }
      })
      .flat()
      .filter((mob) => mob?.nextTierKills != null);
  }
}

module.exports = BestiaryCommand;
