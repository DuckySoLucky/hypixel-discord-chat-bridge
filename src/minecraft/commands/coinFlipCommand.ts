import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";

class CoinFlipCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData().setName("coinflip").setDescription("Flips a coin.").setAliases(["coin"]).setAuthors(["CarsonCodess"]);

  override execute(player: string, message: string) {
    const randNum = Math.random();
    if (randNum <= 0.5) this.send("Heads!");
    else this.send("Tails!");
  }
}

export default CoinFlipCommand;
