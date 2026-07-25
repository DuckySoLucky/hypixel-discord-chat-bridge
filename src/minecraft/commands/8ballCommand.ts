import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class EightBallCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("8ball")
      .setDescription("Ask an 8ball a question.")
      .setAliases(["8b"])
      .setOptions([new MinecraftCommandDataOption().setName("question").setRequired(true)]);
  }

  override async execute(player: string, message: string) {
    if (this.getArgs(message).length === 0) throw new HypixelDiscordChatBridgeError("You must provide a question.");
    const request = await fetch("https://www.eightballapi.com/api");
    if (request.status !== 200) throw new HypixelDiscordChatBridgeError("Wouldn't you like to know weather boy.");
    const data = await request.json();
    if (data === undefined) throw new HypixelDiscordChatBridgeError("Wouldn't you like to know weather boy.");
    this.send(`${data.reading}`);
  }
}

export default EightBallCommand;
