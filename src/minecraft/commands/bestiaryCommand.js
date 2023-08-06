const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getBestiary } = require("../../../API/stats/bestiary.js");

class EightBallCommand extends minecraftCommand {
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

  async onCommand(username, message) {
    try {
      const playerUsername = username;
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      const bestiary = getBestiary(data.profile);

      this.send(
        `/gc ${username}'s Bestiary Milestone: ${bestiary.milestone} / ${bestiary.maxMilestone} | Unlocked Tiers: ${bestiary.tiersUnlocked} / ${bestiary.totalTiers}`
      );

      if (playerUsername === username) {
        const bestiaryData = Object.keys(bestiary.categories)
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
          .filter((mob) => mob?.nextTierKills != null)
          .sort((a, b) => a.nextTierKills - a.kills - (b.nextTierKills - b.kills));

        const topFive = bestiaryData.slice(0, 5);
        const topFiveMobs = topFive.map((mob) => {
          return `${mob.name}: ${mob.kills} / ${mob.nextTierKills} (${mob.nextTierKills - mob.kills})`;
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        this.send(`/gc Closest to level up: ${topFiveMobs.join(", ")}`);
      }
    } catch (error) {
      console.log(error);
      this.send(`/gc Error: ${error}`);
    }
  }
}

module.exports = EightBallCommand;
