import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class MeowCommand extends MinecraftCommand {
  private variations: string[] = ["mrrp", "mrrow", "miau", "mauww", "meep", ":3", "nja", "nya", "awawa"];
  override readonly data = new MinecraftCommandData().setName("meow").setDescription("meow").setAliases(this.variations);

  override async execute(username: string, message: string): Promise<void> {
    await this.send(this.variations[Math.floor(Math.random() * this.variations.length)] || "meow");
  }
}

export default MeowCommand;
