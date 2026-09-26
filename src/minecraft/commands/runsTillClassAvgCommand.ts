import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { DUNGEONEERING_XP, type DungeonClass, DungeonClasses, type SkyBlockMemberPlayerData, type SkyblockProfileWithMe, removeDashesFromUUID } from "hypixel-api-reborn";
import { formatNumber, titleCase } from "../../utils/stringUtils.js";
import { getSelectedProfile, getSkyBlockElection } from "../../utils/hypixelUtils.js";

type ClassMap<T> = Record<DungeonClass, T>;
const FloorsBaseExp = { m7: 300_000, m6: 110_000, m5: 70_000, m4: 55_000, m3: 35_000, m2: 20_000, m1: 15_000 };
const DungeonXp = Object.values(DUNGEONEERING_XP).slice(0, -1);
const PerLevel = 200_000_000;
const Max50Xp = 569_809_640;
const MaxRuns = 15_000;

// Assumption made
// Has max Scarf Shard providing a 20% boost - https://hypixelskyblock.minecraft.wiki/w/Scarf_Shard
// Has Scarf's Grimoire providing a 6% boost - https://hypixelskyblock.minecraft.wiki/w/Scarf%27s_Grimoire
// Unknown source 50%
// Has Catacombs Expert Ring providing a 10% boost - https://hypixelskyblock.minecraft.wiki/w/Catacombs_Expert_Ring
// Has Hecatomb at max level (10) providing a 2% boost - https://hypixelskyblock.minecraft.wiki/w/Hecatomb
// Potentially better system would be reading player's api data to calculate what they have
const GlobalBoost = 0.2 + 0.06 + 0.5 + 0.1 + 0.02;

// CREDITS: by @MattyHD0 (https://github.com/MattyHD0)
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
    const args = this.getArgs(message);
    player = args[0] || player;

    const selectedFloor = args[1]?.toLocaleLowerCase() || "m7";
    if (!(selectedFloor in FloorsBaseExp)) return await this.send(`Invalid floor selected: ${selectedFloor}`);
    const xpPerRun = FloorsBaseExp[selectedFloor as keyof typeof FloorsBaseExp];
    const targetAverage = Number.parseInt(args[2] ?? "50", 10);
    if (!Number.isInteger(targetAverage) || targetAverage < 1 || targetAverage > 50) return this.send("Target class average must be an integer between 1 and 50.");

    const { username, profile, uuid, raw } = await getSelectedProfile(player);
    const rawProfile = raw.rawData.profiles.find((profile: Record<string, any>) => profile.selected === true);
    if (!rawProfile) return await this.send(`${username} has no selected SkyBlock profile.`);
    const memberData = rawProfile.members[removeDashesFromUUID(uuid)];
    if (!memberData?.dungeons?.player_classes) return await this.send(`${username} has never played dungeons.`);

    const runsCalculation = await this.calculateRuns(profile, xpPerRun, targetAverage);
    if (!runsCalculation) return this.send(`${username} needs more than ${formatNumber(MaxRuns)} runs to reach the average class level of ${targetAverage}.`);

    const { totalRuns, runsByClass } = runsCalculation;
    if (totalRuns === 0) return this.send(`${username} has reached class average ${targetAverage} already!`);

    const classSummary = DungeonClasses.filter((dungeonClass) => runsByClass[dungeonClass] > 0)
      .map((dungeonClass) => `${titleCase(dungeonClass)} ${runsByClass[dungeonClass]}`)
      .join(" | ");

    return this.send(`It will take ${formatNumber(totalRuns)} ${selectedFloor} runs for ${username} to reach class average ${targetAverage} (${classSummary})`);
  }

  private async calculateRuns(
    profile: SkyblockProfileWithMe,
    xpPerRun: number,
    targetAverage: number
  ): Promise<{ totalRuns: number; runsByClass: ClassMap<number> } | undefined> {
    const classesExperiences = Object.fromEntries(
      Object.entries(profile.me.dungeons.classes)
        .filter(([name]) => !["average", "selected", "toString"].includes(name))
        .filter(([_, data]) => data.currentXp > 1)
        .map(([name, data]) => [name, data.xp])
    ) as ClassMap<number>;
    const classExpBoosts = this.getClassExpBoosts(profile.me.playerData.perks, await this.getAdditionalBoost());
    const runsByClass = Object.fromEntries(DungeonClasses.map((dungeonClass) => [dungeonClass, 0])) as ClassMap<number>;

    let totalRuns = 0;

    while (this.getClassAverage(classesExperiences, targetAverage) < targetAverage) {
      let classPlayed: DungeonClass | undefined;

      for (const dungeonClass of DungeonClasses) {
        classesExperiences[dungeonClass] += xpPerRun * 0.25 * classExpBoosts[dungeonClass];
        if (classPlayed === undefined || classesExperiences[dungeonClass] < classesExperiences[classPlayed]) classPlayed = dungeonClass;
      }

      if (classPlayed !== undefined) {
        classesExperiences[classPlayed] += xpPerRun * 0.75 * classExpBoosts[classPlayed];
        runsByClass[classPlayed]++;
      }

      totalRuns++;
      if (totalRuns > MaxRuns) return undefined;
    }

    return { totalRuns, runsByClass };
  }

  private getClassAverage(classExperience: ClassMap<number>, targetAverage: number): number {
    const totalLevel = DungeonClasses.reduce((total, dungeonClass) => {
      return total + Math.min(this.getDungeonLevelWithOverflow(classExperience[dungeonClass]), targetAverage);
    }, 0);

    return totalLevel / DungeonClasses.length;
  }

  async getAdditionalBoost(): Promise<number> {
    let totalBoost = 0;
    const response = await getSkyBlockElection();
    const lastElection = response.lastElectionResults;
    if (!lastElection || lastElection.candidates.length === 0) return 0;
    const currentMayor = lastElection.candidates[0]!;
    if (currentMayor.name === "Derpy") totalBoost += 0.5;
    return totalBoost;
  }

  private getDungeonLevelWithOverflow(experience: number): number {
    if (experience > Max50Xp) {
      const overflowExperience = experience - Max50Xp;
      const extraLevels = Math.floor(overflowExperience / PerLevel);
      const fractionLevel = (overflowExperience % PerLevel) / PerLevel;
      return 50 + extraLevels + fractionLevel;
    }

    let totalLevel = 0;
    let remainingExperience = experience;

    for (const [index, levelExperience] of DungeonXp.entries()) {
      if (remainingExperience > levelExperience) {
        totalLevel = index + 1;
        remainingExperience -= levelExperience;
      } else {
        break;
      }
    }

    const nextLevelExperience = DungeonXp[totalLevel] ?? PerLevel;
    const fractionLevel = remainingExperience / nextLevelExperience;
    return totalLevel + fractionLevel;
  }

  private getClassExpBoosts(perks: SkyBlockMemberPlayerData["perks"], additionalBoost: number): ClassMap<number> {
    return {
      healer: ((perks?.heart_of_gold ?? 0) * 2) / 100 + 1 + GlobalBoost + additionalBoost,
      berserk: ((perks?.unbridled_rage ?? 0) * 2) / 100 + 1 + GlobalBoost + additionalBoost,
      mage: ((perks?.cold_efficiency ?? 0) * 2) / 100 + 1 + GlobalBoost + additionalBoost,
      archer: ((perks?.toxophilite ?? 0) * 2) / 100 + 1 + GlobalBoost + additionalBoost,
      tank: ((perks?.diamond_in_the_rough ?? 0) * 2) / 100 + 1 + GlobalBoost + additionalBoost
    };
  }
}

export default RunStillClassAvgCommand;
