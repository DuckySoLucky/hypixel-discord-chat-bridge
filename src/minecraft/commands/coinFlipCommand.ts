import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @CarsonCodes (https://github.com/CarsonCodess)
class CoinFlipCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData().setName("coinflip").setAliases(["coin"]);
  }

  override execute(player: string, message: string) {
    const randomNumber = Math.random();
    this.send(translate(randomNumber >= 0.5 ? "minecraft.commands.coinflip.execute.success.head" : "minecraft.commands.coinflip.execute.success.tail"));
  }
}

export default CoinFlipCommand;
