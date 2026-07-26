import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { delay } from "../../utils/miscUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Zickles (https://github.com/Zickles)
class BooCommand extends MinecraftCommand {
  isOnCooldown: boolean;
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData().setName("boo").setOptions([new MinecraftCommandDataOption().setName("username").setRequired(true)]);
    this.isOnCooldown = false;
  }

  override async execute(player: string, message: string) {
    try {
      if (new Date().getMonth() !== 9) throw new HypixelDiscordChatBridgeError(translate("minecraft.commands.boo.execute.errors.halloween"));
      const username = this.getArgs(message)[0];
      if (username === undefined) throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.no.username"));
      if (this.isOnCooldown) throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.command.cooldown", { player }));

      this.isOnCooldown = true;
      this.minecraft.bot.chat(`/boo ${username}`);
      await delay(1000);
      this.minecraft.bot.chat(`/msg ${username} ${player} Booed You!`);
      await delay(1000);
      this.send(translate("minecraft.commands.boo.execute.success", { username }));
      setTimeout(() => (this.isOnCooldown = false), 30000);
    } catch (error) {
      this.isOnCooldown = false;
      throw error;
    }
  }
}

export default BooCommand;
