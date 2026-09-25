import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile, getSkyBlockElection } from "../../utils/hypixelUtils.js";
import { removeDashesFromUUID } from "hypixel-api-reborn";

const FloorsBaseExp = { m7: 300_000, m6: 110_000, m5: 70_000, m4: 55_000, m3: 35_000, m2: 20_000, m1: 15_000 };

const DungeonXp = [
  50, 75, 110, 160, 230, 330, 470, 670, 950, 1340, 1890, 2665, 3760, 5260, 7380, 10_300, 14_400, 20_000, 27_600, 38_000, 52_500, 71_500, 97_000, 132_000, 180_000,
  243_000, 328_000, 445_000, 600_000, 800_000, 1_065_000, 1_410_000, 1_900_000, 2_500_000, 3_300_000, 4_300_000, 5_600_000, 7_200_000, 9_200_000, 1.2e7, 1.5e7, 1.9e7,
  2.4e7, 3e7, 3.8e7, 4.8e7, 6e7, 7.5e7, 9.3e7, 1.1625e8
];

const PerLevel = 200_000_000;
const Max50Xp = 569_809_640;

const GlobalBoost = 0.2 + 0.06 + 0.5 + 0.1 + 0.02;

class RunStillClassAvgCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("runstillclassavg")
    .setDescription("Calculate runs needed to reach target dungeon class average")
    .setAliases(["rtca", "runstillca", "runtillclassavg", "runtillca"])
    .setOptions([
      new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username"),
      new MinecraftCommandDataOption().setName("floor").setDescription("Floor (m1-m7)"),
      new MinecraftCommandDataOption().setName("target").setDescription("Target class average (1-50)")
    ]);

  override async execute(player: string, message: string): Promise<void> {
    try {
      const args = this.getArgs(message);
      const givenUsername = args[0] || player;

      const { username, profile, uuid, raw } = await getSelectedProfile(givenUsername);

      const selectedFloor = args[1]?.toLocaleLowerCase() || "m7";
      if (!(selectedFloor in FloorsBaseExp)) {
        await this.send(`Invalid floor selected: ${selectedFloor}`);
        return;
      }
      const xpPerRun = FloorsBaseExp[selectedFloor as keyof typeof FloorsBaseExp];

      if (profile.me.dungeons?.classes === undefined) {
        await this.send(`${username} has never played dungeons.`);
        return;
      }

      const rawProfile = raw.rawData.profiles.find((p: Record<string, any>) => p.selected === true);
      if (!rawProfile) {
        await this.send(`${username} has no selected SkyBlock profile.`);
        return;
      }
      const memberData = rawProfile.members[removeDashesFromUUID(uuid)];
      if (!memberData?.dungeons?.player_classes) {
        await this.send(`${username} has never played dungeons.`);
        return;
      }

      const selectedProfile = profile;
      let targetAverage = args[2] ? Number.parseInt(args[2], 10) : 50;
      if (targetAverage <= 0 || targetAverage > 50 || isNaN(targetAverage)) targetAverage = 50;

      const heartOfGold = selectedProfile.me.playerData.perks?.heart_of_gold ?? 0;
      const unbridledRage = selectedProfile.me.playerData.perks?.unbridled_rage ?? 0;
      const coldEfficiency = selectedProfile.me.playerData.perks?.cold_efficiency ?? 0;
      const toxophilite = selectedProfile.me.playerData.perks?.toxophilite ?? 0;
      const diamondInTheRough = selectedProfile.me.playerData.perks?.diamond_in_the_rough ?? 0;

      const additionalBoost = await this.getAdditionalBoost();

      const classExpBoosts = {
        healer: (heartOfGold * 2) / 100 + 1 + GlobalBoost + additionalBoost,
        berserk: (unbridledRage * 2) / 100 + 1 + GlobalBoost + additionalBoost,
        mage: (coldEfficiency * 2) / 100 + 1 + GlobalBoost + additionalBoost,
        archer: (toxophilite * 2) / 100 + 1 + GlobalBoost + additionalBoost,
        tank: (diamondInTheRough * 2) / 100 + 1 + GlobalBoost + additionalBoost
      };

      let totalRuns = 0;
      const runsDone = { healer: 0, berserk: 0, mage: 0, archer: 0, tank: 0 };
      const classesExperiences = { healer: 0, berserk: 0, mage: 0, archer: 0, tank: 0 };

      const rawClasses = memberData.dungeons.player_classes;
      for (const [className, classObject] of Object.entries(rawClasses)) {
        if (className in classesExperiences) {
          classesExperiences[className as keyof typeof classesExperiences] = (classObject as { experience?: number })?.experience ?? 0;
        }
      }

      let currentClassAverage = this.getClassAverage(classesExperiences, targetAverage);
      const classes = Object.keys(runsDone) as (keyof typeof runsDone)[];

      while (currentClassAverage < targetAverage) {
        let currentClassPlaying: keyof typeof runsDone | undefined;
        for (const key of classes) {
          classesExperiences[key] += xpPerRun * 0.25 * classExpBoosts[key];
          if (currentClassPlaying === undefined || classesExperiences[key] < classesExperiences[currentClassPlaying]) {
            currentClassPlaying = key;
          }
        }

        if (currentClassPlaying !== undefined) {
          classesExperiences[currentClassPlaying] += xpPerRun * 0.75 * classExpBoosts[currentClassPlaying];
          runsDone[currentClassPlaying]++;
        }

        currentClassAverage = this.getClassAverage(classesExperiences, targetAverage);
        totalRuns++;

        if (totalRuns > 15_000) {
          await this.send(`${username} needs more than 15,000 runs to reach the average class level of ${targetAverage}.`);
          return;
        }
      }

      if (totalRuns === 0) {
        await this.send(`${username} has reached c.a. ${targetAverage} already!`);
        return;
      }

      await this.send(
        `${username} is ${formatNumber(totalRuns)} ${selectedFloor.toUpperCase()} away from c.a. ${targetAverage} (${classes
          .filter((c) => runsDone[c] > 0)
          .map((c) => `${c} ${runsDone[c]}`)
          .join(" | ")})`
      );
    } catch (error) {
      console.error(error);
      await this.send(`[ERROR] ${error}`);
    }
  }

  getClassAverage(classData: Record<string, number>, targetAverage: number): number {
    const classesXp = Object.values(classData);
    return (
      classesXp
        .map((xp) => this.getDungeonLevelWithOverflow(xp))
        .map((level) => Math.min(level, targetAverage))
        .reduce((a, b) => a + b, 0) / classesXp.length
    );
  }

  async getAdditionalBoost(): Promise<number> {
    let totalBoost = 0;

    const response = await getSkyBlockElection();
    const lastElection = response.lastElectionResults;

    if (!lastElection || lastElection.candidates.length === 0) {
      return 0;
    }

    const currentMayor = lastElection.candidates[0]!;

    if (currentMayor.name === "Derpy") {
      totalBoost += 0.5;
    }

    return totalBoost;
  }

  getDungeonLevelWithOverflow(experience: number): number {
    if (experience > Max50Xp) {
      const remainingExperience = experience - Max50Xp;
      const extraLevels = Math.floor(remainingExperience / PerLevel);
      const fractionLevel = (remainingExperience % PerLevel) / PerLevel;
      return 50 + extraLevels + fractionLevel;
    }

    let totalLevel = 0;
    let remainingXP = experience;

    for (const [index, levelXp] of DungeonXp.entries()) {
      if (remainingXP > levelXp) {
        totalLevel = index + 1;
        remainingXP -= levelXp;
      } else {
        break;
      }
    }

    const nextLevelXp = DungeonXp[totalLevel] ?? PerLevel;
    const fractionLevel = remainingXP / nextLevelXp;
    return totalLevel + fractionLevel;
  }
}

export default RunStillClassAvgCommand;
