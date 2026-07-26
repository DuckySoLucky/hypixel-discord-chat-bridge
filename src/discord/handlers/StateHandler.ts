import Embed from "../private/Embed.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import { translate } from "../../translations/TranslationsManager.js";
import type DiscordManager from "../DiscordManager.js";

class StateHandler {
  constructor(private readonly discord: DiscordManager) {}

  async loadGuild() {
    if (!this.discord.isClientOnline()) throw new HypixelDiscordChatBridgeError(translate("discord.errors.offline"));
    this.discord.guild = await this.discord.client.guilds.fetch(this.discord.application.config.discord.serverId);
    console.discord(translate("discord.state.ready.guild", { name: this.discord.guild.name, id: this.discord.guild.id }));
  }

  async onReady() {
    if (!this.discord.isClientOnline() || !this.discord.client.user) return;
    console.discord(translate("discord.state.ready.client.message", this.discord.client.user));
    this.discord.client.user.setPresence({ activities: [{ name: "/help | by @duckysolucky" }] });

    await this.loadGuild();
    await this.discord.buttonHandler.loadButtons();
    await this.discord.modalHandler.loadModals();

    const channel = await this.discord.getChannel("Guild");
    if (channel === null || !channel.isSendable()) {
      return console.error(translate("discord.errors.no.channel", { type: translate("discord.channels.Guild") }));
    }
    await channel.send({
      embeds: [
        new Embed()
          .setAuthor({ name: translate("discord.state.online") })
          .setColor("Green")
          .setFooter(null)
      ]
    });

    const loggerChannel = await this.discord.getChannel("Logger-Event");
    if (loggerChannel === null || !loggerChannel.isSendable()) {
      return console.error(translate("discord.errors.no.channel", { type: translate("discord.channels.Logger-Event") }));
    }
    await loggerChannel.send({ embeds: [new Embed().setDescription(translate("discord.state.ready.client.full")).setColor("Green")] });
    console.discord(translate("discord.state.ready.client.full"));
  }

  async onClose() {
    const channel = await this.discord.getChannel("Guild");
    if (channel === null || !channel.isSendable()) {
      return console.error(translate("discord.errors.no.channel", { type: translate("discord.channels.Guild") }));
    }
    await channel.send({
      embeds: [
        new Embed()
          .setAuthor({ name: translate("discord.state.online") })
          .setColor("Red")
          .setFooter(null)
      ]
    });

    const loggerChannel = await this.discord.getChannel("Logger-Event");
    if (loggerChannel === null || !loggerChannel.isSendable()) {
      return console.error(translate("discord.errors.no.channel", { type: translate("discord.channels.Logger-Event") }));
    }
    await loggerChannel.send({ embeds: [new Embed().setDescription(translate("discord.state.online")).setColor("Red")] });
  }
}

export default StateHandler;
