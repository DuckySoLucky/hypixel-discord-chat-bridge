import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { delay } from "../../utils/miscUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Zickles (https://github.com/Zickles)
class BooCommand extends MinecraftCommand {
  isOnCooldown: boolean;
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("boo")
      .setDescription("Boo someone!")
      .setOptions([new MinecraftCommandDataOption().setName("username").setRequired(true)]);

    this.isOnCooldown = false;
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      if (args.length === 0) throw new HypixelDiscordChatBridgeError("You must provide a user to boo!'");
      if (new Date().getMonth() !== 9) throw new HypixelDiscordChatBridgeError("You can only do this during Halloween!");
      if (this.isOnCooldown) throw new HypixelDiscordChatBridgeError(`${player} Command is on cooldown`);

      this.isOnCooldown = true;
      this.minecraft.bot.chat(`/boo ${args[0]}`);
      await delay(1000);
      this.minecraft.bot.chat(`/msg ${args[0]} ${player} Booed You!`);
      await delay(1000);
      this.send(`Booed ${args[0]}!`);
      setTimeout(() => (this.isOnCooldown = false), 30000);
    } catch (error) {
      this.isOnCooldown = false;
      throw error;
    }
  }
}

export default BooCommand;
