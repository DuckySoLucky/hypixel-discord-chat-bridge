import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class CalculateCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("calculate")
      .setDescription("Calculate.")
      .setAliases(["math", "calc"])
      .setOptions([new MinecraftCommandDataOption().setName("calculation").setRequired(true)]);
  }

  override execute(player: string, message: string) {
    const calculation = message.replace(/[^-()\d/*+.]/g, "");
    if (calculation.trim() === "9+10") return this.send("9 + 10 = 21");
    const answer = eval(calculation);
    if (answer === Infinity) return this.send("Something went wrong.. Somehow you broke it (the answer was infinity)");
    if (answer > 1000000) return this.send(`${calculation} = ${formatNumber(answer)} (${answer.toLocaleString()})`);
    return this.send(`${calculation} = ${formatNumber(answer)}`);
  }
}

export default CalculateCommand;
