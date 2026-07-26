import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class CalculateCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("calculate")
      .setAliases(["math", "calc"])
      .setOptions([new MinecraftCommandDataOption().setName("calculation").setRequired(true)]);
  }

  override execute(player: string, message: string) {
    const calculation = message.replace(/[^-()\d/*+.]/g, "");
    if (calculation.trim() === "9+10") return this.send(translate("minecraft.commands.calculate.execute.success.21"));
    const answer = eval(calculation);
    if (answer === Infinity) return this.send(translate("minecraft.commands.calculate.execute.error"));
    this.send(
      translate(answer > 1000000 ? "minecraft.commands.calculate.execute.success.fullMessage" : "minecraft.commands.calculate.execute.success.message", {
        answer: formatNumber(answer),
        fullAnswer: answer.toLocaleString()
      })
    );
  }
}

export default CalculateCommand;
