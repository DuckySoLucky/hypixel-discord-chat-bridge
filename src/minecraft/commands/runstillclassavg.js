const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatNumber } = require("../../contracts/helperFunctions.js");
const { getDungeons } = require("../../../API/stats/dungeons.js");
const { get } = require("axios");

const FloorsBaseExp = {
  m7: 300_000,
  m6: 110_000,
  m5: 70_000,
  m4: 55_000,
  m3: 35_000,
  m2: 20_000,
  m1: 15_000
}

// CREDITS: by @MattyHD0 (https://github.com/MattyHD0) for adaptation and 
// CREDITS: https://github.com/aidn3/hypixel-guild-discord-bridge for the original algorithm

class RunsTillsClassAverageCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "runstillclassavg";
    this.aliases = ["rtca", "runstillca", "runtillclassavg", "runtillca"];
    this.description = "Skyblock Dungeons Stats of specified user.";
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

      const { username, profile, profileData } = await getLatestProfile(player);

      let selectedFloor = args[1]?.toLocaleLowerCase() || "m7"
      if (!(selectedFloor in FloorsBaseExp)) return `Invalid floor selected: ${selectedFloor}`
      const xpPerRun = FloorsBaseExp[selectedFloor]
      
      const selectedProfile = profile;
      let targetAverage = args[2]  ? Number.parseInt(args[2], 10) : 50
      if(targetAverage <= 0 || targetAverage > 50 || isNaN(targetAverage)) targetAverage = 50

      if (selectedProfile.dungeons?.player_classes === undefined) {
        this.send(`${player} has never played dungeons on ${profileData.cute_name}.`);
        return;
      }

      // TODO: fix perks changed location into "leveling" section.
      //  As it is right now, all the values here are 0.
      //  however, the rtca is accurate as it is right now.
      //  Further testing should be done later when volatile perks like Aura mayor are gone.

      const heartOfGold = selectedProfile.essence?.perks?.heart_of_gold ?? 0
      const unbridledRage = selectedProfile.essence?.perks?.unbridled_rage ?? 0
      const coldEfficiency = selectedProfile.essence?.perks?.cold_efficiency ?? 0
      const toxophilite = selectedProfile.essence?.perks?.toxophilite ?? 0
      const diamondInTheRough = selectedProfile.essence?.perks?.diamond_in_the_rough ?? 0

      /*
      * Bonuses:
      * - Scarf Shards 20%
      * - Scarf accessory Grimoire 6%
      * - 50% XP boost when did runs on selected floor maxed at 26 runs (50% on MM) (https://wiki.hypixel.net/Dungeoneering#Dungeoneering_XP_Gain)
      * - 10% Expert Ring
      * - 2% Maxed Hecatomb Enchantment
      *
      *  All stats are set to max assuming that the player who is using the command is already prepared to do hundreds of runs
      */

      const GlobalBoost = 0.2 + 0.06 + 0.5 + 0.1 + 0.02
      const additionalBoost = await this.getAdditionalBoost()

      const classExpBoosts = {
        healer: (heartOfGold * 2) / 100 + 1 + GlobalBoost + additionalBoost,
        berserk: (unbridledRage * 2) / 100 + 1 + GlobalBoost + additionalBoost,
        mage: (coldEfficiency * 2) / 100 + 1 + GlobalBoost + additionalBoost,
        archer: (toxophilite * 2) / 100 + 1 + GlobalBoost + additionalBoost,
        tank: (diamondInTheRough * 2) / 100 + 1 + GlobalBoost + additionalBoost
      }

      let totalRuns = 0
      const runsDone = {
        healer: 0,
        berserk: 0,
        mage: 0,
        archer: 0,
        tank: 0
      }
      const classesExperiences = {
        healer: 0,
        berserk: 0,
        mage: 0,
        archer: 0,
        tank: 0
      }

      for (const [className, classObject] of Object.entries(selectedProfile.dungeons.player_classes)) {
        classesExperiences[className] = classObject?.experience ?? 0
      }

      let currentClassAverage = this.getClassAverage(classesExperiences, targetAverage)
      const classes = Object.keys(runsDone)

      while (currentClassAverage < targetAverage) {
        let currentClassPlaying
        for (const key of classes) {
          classesExperiences[key] += xpPerRun * 0.25 * classExpBoosts[key]
          if (currentClassPlaying === undefined || classesExperiences[key] < classesExperiences[currentClassPlaying]) {
            currentClassPlaying = key
          }
        }

        //assert.ok(currentClassPlaying)
        classesExperiences[currentClassPlaying] += xpPerRun * 0.75 * classExpBoosts[currentClassPlaying]
        runsDone[currentClassPlaying]++

        currentClassAverage = this.getClassAverage(classesExperiences, targetAverage)
        totalRuns++

        if (totalRuns > 15_000) {
          this.send(`${player} needs more than 15,000 runs to reach the average class level of ${targetAverage}.`)
        }
      }

      if (totalRuns === 0) {
        this.send(`${player} has reached c.a. ${targetAverage} already!`)
        return
      }

      this.send(`${player} is ${totalRuns} ${selectedFloor.toUpperCase()} away from c.a. ${targetAverage} (${classes
        .filter((c) => runsDone[c] > 0)
        .map((c) => `${c} ${runsDone[c]}`)
        .join(' | ')})`);
    
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
    
  }

  getClassAverage(classData, targetAverage) {
    const classesXp = Object.values(classData)
    return (
      classesXp
        .map((xp) => this.getDungeonLevelWithOverflow(xp))
        .map((level) => Math.min(level, targetAverage))
        .reduce((a, b) => a + b, 0) / classesXp.length
    )
  }

  async getAdditionalBoost() {
    let totalBoost = 0

    const response = await get(`https://api.hypixel.net/v2/resources/skyblock/election`);
    if (response === undefined || response.data === undefined || response.data.success === false) {
      throw "Request to Hypixel API failed. Please try again!";
    }

    /** @type {import("../../../types/election.js").Mayor} */
    const government = response.data;
    if (government.mayor.key === 'aura') {
      totalBoost += 0.55
    } else if (government.mayor.key === 'derpy') {
      totalBoost += 0.5
    }

    return totalBoost
  }

  getDungeonLevelWithOverflow(experience) {
    const DungeonXp = [
      50, 75, 110, 160, 230, 330, 470, 670, 950, 1340, 1890, 2665, 3760, 5260, 7380, 10_300, 14_400, 20_000, 27_600,
      38_000, 52_500, 71_500, 97_000, 132_000, 180_000, 243_000, 328_000, 445_000, 600_000, 800_000, 1_065_000, 1_410_000,
      1_900_000, 2_500_000, 3_300_000, 4_300_000, 5_600_000, 7_200_000, 9_200_000, 1.2e7, 1.5e7, 1.9e7, 2.4e7, 3e7, 3.8e7,
      4.8e7, 6e7, 7.5e7, 9.3e7, 1.1625e8
    ]
    const PerLevel = 200_000_000
    const Max50Xp = 569_809_640

    if (experience > Max50Xp) {
      // account for overflow
      const remainingExperience = experience - Max50Xp
      const extraLevels = Math.floor(remainingExperience / PerLevel)
      const fractionLevel = (remainingExperience % PerLevel) / PerLevel

      return 50 + extraLevels + fractionLevel
    }

    let totalLevel = 0
    let remainingXP = experience

    for (const [index, levelXp] of DungeonXp.entries()) {
      if (remainingXP > levelXp) {
        totalLevel = index + 1
        remainingXP -= levelXp
      } else {
        break
      }
    }

    const fractionLevel = remainingXP / DungeonXp[totalLevel]
    return totalLevel + fractionLevel
  }

}

module.exports = RunsTillsClassAverageCommand;
