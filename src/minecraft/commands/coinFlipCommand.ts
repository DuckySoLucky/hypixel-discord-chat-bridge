import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @CarsonCodes (https://github.com/CarsonCodess)
class CoinFlipCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData().setName("coinflip").setDescription("Flips a coin.").setAliases(["coin"]);
  }

  override execute(player: string, message: string) {
    const randNum = Math.random();
    if (randNum <= 0.5) this.send("Heads!");
    else this.send("Tails!");
  }
}

export default CoinFlipCommand;
