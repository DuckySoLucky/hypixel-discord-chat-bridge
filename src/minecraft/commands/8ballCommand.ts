import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class EightBallCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("8ball")
      .setAliases(["8b"])
      .setOptions([new MinecraftCommandDataOption().setName("question").setRequired(true)]);
  }

  override async execute(player: string, message: string) {
    if (this.getArgs(message).length === 0) throw new HypixelDiscordChatBridgeError(translate("minecraft.commands.8ball.execute.errors.no.question"));
    const request = await fetch("https://www.eightballapi.com/api");
    if (request.status !== 200) throw new HypixelDiscordChatBridgeError(translate("minecraft.commands.8ball.execute.errors.no.response"));
    const data = await request.json();
    if (data === undefined || data.reading === undefined) throw new HypixelDiscordChatBridgeError(translate("minecraft.commands.8ball.execute.errors.no.response"));
    this.send(translate("minecraft.commands.8ball.execute.response", { reading: data.reading }));
  }
}

export default EightBallCommand;
