import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";

class BarkCommand extends MinecraftCommand {
  private variations: string[] = ["woof", "bork", "bwoof", "awruf", "arf", "awrf", "awooo"];
  override readonly data = new MinecraftCommandData().setName("bark").setDescription("bark").setAliases(this.variations).setAuthors(["it-pup"]);

  override async execute(username: string, message: string): Promise<void> {
    await this.send(this.variations[Math.floor(Math.random() * this.variations.length)] || "bark");
  }
}

export default BarkCommand;
