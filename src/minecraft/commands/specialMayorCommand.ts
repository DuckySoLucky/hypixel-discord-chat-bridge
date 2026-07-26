import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

/*
Derpy = 368 mod 24 = 8
Jerry = 376 mod 24 = 16
Scorpius = 384 mod 24 = 0
https://hypixel-skyblock.fandom.com/wiki/Mayor_Election#Special_Candidates_Election_Cycle
*/

const hourMs = 50_000;
const dayMs = 24 * hourMs;
const monthLength = 31;
const yearLength = 12;

const yearMs = yearLength * monthLength * dayMs;
const yearZero = 1560275700000;

// CREDITS: by @CarsonCodes (https://github.com/CarsonCodess)
class SpecialMayorCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData().setName("specialmayor").setAliases(["specmayor"]);
  }

  getYearsUntilSpecial(year: number): number {
    return (8 - (year % 8)) % 8;
  }

  timeToSkyblockYear(time: number): number {
    return Math.floor((time - yearZero) / yearMs) + 1;
  }

  getSpecialMayor(year: number): string | null {
    switch (year % 24) {
      case 8:
        return "Derpy";
      case 16:
        return "Jerry";
      case 0:
        return "Scorpius";
      default:
        return null;
    }
  }

  override execute(player: string, message: string) {
    const currentYear = this.timeToSkyblockYear(Date.now());
    const yearsUntil = this.getYearsUntilSpecial(currentYear);

    const targetYear = currentYear + yearsUntil;
    const mayor = this.getSpecialMayor(targetYear);

    if (yearsUntil === 0) this.send(translate("minecraft.commands.specialmayor.execute.success.current", { mayor }));
    else this.send(translate("minecraft.commands.specialmayor.execute.success.next", { mayor, yearsUntil }));
  }
}

export default SpecialMayorCommand;
