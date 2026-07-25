import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { delay } from "../../utils/miscUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class WarpoutCommand extends MinecraftCommand {
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

      const listener = (data: { positionId: number; formattedMessage: string }) => {
        const event = this.minecraft.prismarineChat.fromNotch(data.formattedMessage);
        const message = event.toString();
        if (message.includes("You cannot invite that player since they're not online.")) {
          this.minecraft.bot.removeListener("systemChat", listener);
          this.disableCooldown();
          this.send(`${username} is offline`);
        } else if (message.includes("You cannot invite that player")) {
          this.minecraft.bot.removeListener("systemChat", listener);
          this.disableCooldown();
          this.send(`${username} has party requests disabled!`);
        } else if (message.includes("invited") && message.includes("to the party! They have 60 seconds to accept.")) {
          this.send(`Partying ${username}...`);
        } else if (message.includes(" joined the party.")) {
          this.minecraft.bot.chat("/p warp");
        } else if (message.includes("warped to your server")) {
          this.minecraft.bot.removeListener("systemChat", listener);
          this.disableCooldown();
          this.send(`Successfully warped ${username}!`);
          this.minecraft.bot.chat("/p disband");
        } else if (message.includes(" cannot warp from Limbo")) {
          this.minecraft.bot.removeListener("systemChat", listener);
          this.disableCooldown();
          this.send(`${username} cannot be warped from Limbo! Disbanding party...`);
          this.minecraft.bot.chat("/p disband");
        } else if (message.includes(" is not allowed on your server!")) {
          this.minecraft.bot.removeListener("systemChat", listener);
          this.disableCooldown();
          this.send(`${username} is not allowed on my server! Disbanding party...`);
          this.minecraft.bot.chat("/p leave");
        } else if (message.includes("You are not allowed to invite players.")) {
          this.minecraft.bot.removeListener("systemChat", listener);
          this.disableCooldown();
          this.send("Somehow I'm not allowed to invite players? Disbanding party...");
          this.minecraft.bot.chat("/p disband");
        } else if (message.includes("You are not allowed to disband this party.")) {
          this.minecraft.bot.removeListener("systemChat", listener);
          this.disableCooldown();
          this.send("Somehow I'm not allowed to disband this party? Leaving party...");
          this.minecraft.bot.chat("/p leave");
        } else if (message.includes("You can't party warp into limbo!")) {
          this.minecraft.bot.removeListener("systemChat", listener);
          this.disableCooldown();
          this.send("Somehow I'm inside in limbo? Disbanding party...");
          this.minecraft.bot.chat("/p disband");
        } else if (message.includes("Couldn't find a player with that name!")) {
          this.minecraft.bot.removeListener("systemChat", listener);
          this.disableCooldown();
          this.send("Couldn't find a player with that name!");
          this.minecraft.bot.chat("/p disband");
        } else if (message.includes("You cannot party yourself!")) {
          this.minecraft.bot.removeListener("systemChat", listener);
          this.disableCooldown();
          this.send("I cannot party myself!");
        } else if (message.includes("didn't warp correctly!")) {
          this.minecraft.bot.removeListener("systemChat", listener);
          this.disableCooldown();
          this.send(`${username} didn't warp correctly! Please try again...`);
          this.minecraft.bot.chat("/p disband");
        }
      };

      this.minecraft.bot.on("systemChat", listener);
      this.minecraft.bot.chat(`/p invite ${username} `);

      setTimeout(() => {
        this.minecraft.bot.removeListener("systemChat", listener);
        if (this.isOnCooldown === true) {
          this.send("Party expired.");
          this.minecraft.bot.chat("/p disband");
          this.disableCooldown();
        }
      }, 30000);
    } catch (error) {
      this.disableCooldown();
      throw error;
    }
  }
}

export default WarpoutCommand;
