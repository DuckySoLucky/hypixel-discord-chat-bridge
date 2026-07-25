import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class MeowCommand extends MinecraftCommand {
  private variations: string[];
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.variations = ["mrrp", "mrrow", "miau", "mauww", "meep", ":3", "nja", "nya", "awawa"];
    this.data = new MinecraftCommandData().setName("meow").setDescription("meow").setAliases(this.variations);
  }

  override execute(username: string, message: string): void {
    this.send(this.variations[Math.floor(Math.random() * this.variations.length)] || "meow");
  }
}

export default MeowCommand;
