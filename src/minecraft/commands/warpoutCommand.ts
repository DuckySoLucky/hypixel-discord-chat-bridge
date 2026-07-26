import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { MinecraftRequestTimeoutError } from "../MinecraftRequestBroker.js";
import { delay } from "../../utils/miscUtils.js";
import { runDetached } from "../../utils/asyncUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class WarpoutCommand extends MinecraftCommand {
  override readonly data: MinecraftCommandData;
  private isOnCooldown: boolean;
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("warpout")
      .setDescription("Warp player out of the game")
      .setAliases(["warp"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

    this.isOnCooldown = false;
  }

  enableCooldown() {
    this.isOnCooldown = true;
    this.minecraft.messageHandler.setAllowLimbo(false);
  }

  disableCooldown() {
    this.isOnCooldown = false;
    this.minecraft.messageHandler.setAllowLimbo(true);
  }

  override async execute(player: string, message: string) {
    try {
      if (this.isOnCooldown) throw new HypixelDiscordChatBridgeError(`${player} Command is on cooldown`);
      this.enableCooldown();

      const username = this.getArgs(message)[0];
      if (username === undefined) throw new HypixelDiscordChatBridgeError("Please provide a username!");
      this.minecraft.bot.chat("/lobby megawalls");
      await delay(500);
      this.minecraft.bot.chat("/play skyblock");
      await delay(500);
      this.minecraft.bot.chat("/warp home");
      await delay(500);

      const reply = this.context.reply;
      let outcome: { command?: "/p disband" | "/p leave"; reply: string } | undefined;
      const response = this.minecraft.requestBroker.request({
        description: `Warp ${username} out of SkyBlock`,
        timeoutMs: 30000,
        signal: this.context.signal,
        matches: (message) => {
          if (message.includes("You cannot invite that player since they're not online.")) {
            outcome = { reply: `${username} is offline` };
          } else if (message.includes("You cannot invite that player")) {
            outcome = { reply: `${username} has party requests disabled!` };
          } else if (message.includes("invited") && message.includes("to the party! They have 60 seconds to accept.")) {
            runDetached(reply(`Partying ${username}...`));
          } else if (message.includes(" joined the party.")) {
            this.minecraft.bot.chat("/p warp");
          } else if (message.includes("warped to your server")) {
            outcome = { command: "/p disband", reply: `Successfully warped ${username}!` };
          } else if (message.includes(" cannot warp from Limbo")) {
            outcome = { command: "/p disband", reply: `${username} cannot be warped from Limbo! Disbanding party...` };
          } else if (message.includes(" is not allowed on your server!")) {
            outcome = { command: "/p leave", reply: `${username} is not allowed on my server! Disbanding party...` };
          } else if (message.includes("You are not allowed to invite players.")) {
            outcome = { command: "/p disband", reply: "Somehow I'm not allowed to invite players? Disbanding party..." };
          } else if (message.includes("You are not allowed to disband this party.")) {
            outcome = { command: "/p leave", reply: "Somehow I'm not allowed to disband this party? Leaving party..." };
          } else if (message.includes("You can't party warp into limbo!")) {
            outcome = { command: "/p disband", reply: "Somehow I'm inside in limbo? Disbanding party..." };
          } else if (message.includes("Couldn't find a player with that name!")) {
            outcome = { command: "/p disband", reply: "Couldn't find a player with that name!" };
          } else if (message.includes("You cannot party yourself!")) {
            outcome = { reply: "I cannot party myself!" };
          } else if (message.includes("didn't warp correctly!")) {
            outcome = { command: "/p disband", reply: `${username} didn't warp correctly! Please try again...` };
          }
          return outcome !== undefined;
        },
        map: () => outcome
      });
      this.minecraft.bot.chat(`/p invite ${username} `);
      try {
        const result = await response;
        if (!result) throw new Error("Warp response matched without an outcome.");
        await reply(result.reply);
        if (result.command) this.minecraft.bot.chat(result.command);
      } catch (error: unknown) {
        if (!(error instanceof MinecraftRequestTimeoutError)) throw error;
        await reply("Party expired.");
        this.minecraft.bot.chat("/p disband");
      }
      this.disableCooldown();
    } catch (error) {
      this.disableCooldown();
      throw error;
    }
  }
}

export default WarpoutCommand;
