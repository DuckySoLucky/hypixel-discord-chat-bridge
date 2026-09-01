import { type APIEmbed, type APIEmbedField, type ColorResolvable, EmbedBuilder, type EmbedData } from "discord.js";
import { CommonDevs, EmbedStyles } from "../../private/constants.js";
import { ConfigOtherColors } from "../../types/config.js";
import { readFileSync } from "node:fs";
import type BlacklistUser from "../../data/blacklist/BlacklistUser.ts";
import type InactiveUser from "../../data/inactivity/InactiveUser.ts";
import type { DevData, DevName } from "../../types/application.js";
import type { EmbedHelperField, EmbedStyleData, EmbedStyleName, MinecraftFieldData } from "../../types/discord.js";
import type { GuildMember, Player } from "hypixel-api-reborn";

const config = JSON.parse(readFileSync("config.json", "utf-8"));

export default class EmbedHelper extends EmbedBuilder {
  constructor(data?: EmbedData | APIEmbed) {
    super(data);
    if (data) return;
    this.setTimestamp();
    this.setStyle("Generic");
  }

  override setColor(color: ConfigOtherColors | ColorResolvable | null): this {
    if (ConfigOtherColors.safeParse(color).success) return super.setColor(config.other.colors[color as ConfigOtherColors] as ColorResolvable);
    return super.setColor(color as ColorResolvable);
  }

  setDevFooter(data: DevName | DevData | null, message: string = "/help [command] for more information"): this {
    if (data === null) return this.setFooter(null);
    const { username, iconURL } = typeof data === "string" ? CommonDevs[data] : data;
    return this.setFooter({ text: config.other.showDevFooters ? message : `by @${username} | ${message}`, iconURL: config.other.showDevFooters ? undefined : iconURL });
  }

  setStyle(data: EmbedStyleName | EmbedStyleData): this {
    const { title, author, description, color, footer } = typeof data === "string" ? EmbedStyles[data] : data;
    this.setTitle(title ?? null);
    this.setAuthor(author ?? null);
    this.setDescription(description ?? null);
    this.setColor(color ?? null);
    this.setDevFooter(footer ?? null);
    return this;
  }

  override setFields(...fields: EmbedHelperField[]): this {
    return super.setFields(fields.map((field) => this.formatField(field)));
  }

  override addFields(...fields: EmbedHelperField[]): this {
    return super.addFields(fields.map((field) => this.formatField(field)));
  }

  private formatField({ name, value, inline, blockValue, formatTimestamp }: EmbedHelperField): APIEmbedField {
    return { name, value: this.formatFieldValue({ name, value, inline, blockValue, formatTimestamp }), inline };
  }

  private formatFieldValue({ value, smallBlockValue, blockValue, formatTimestamp }: EmbedHelperField): string {
    if (smallBlockValue) return `\`${value}\``;
    if (blockValue) return `\`\`\`${value}\`\`\``;
    if (formatTimestamp) return `<t:${value}:F> (<t:${value}:R>)`;
    return value;
  }

  addDiscordFields(discordId: string): this {
    return this.addFields({ name: "Discord", value: `<@${discordId}>` }, { name: "Discord ID", value: discordId, blockValue: true });
  }

  addMinecraftFields({ formattedNickname, nickname, uuid }: MinecraftFieldData): this {
    this.addFields(
      { name: "Formatted Username", value: formattedNickname ?? "UNKNOWN", blockValue: true },
      { name: "Username", value: nickname ?? "UNKNOWN", blockValue: true },
      { name: "UUID", value: uuid ?? "UNKNOWN", blockValue: true }
    );
    return this;
  }
}

export class WarningEmbed extends EmbedHelper {
  constructor() {
    super();
    this.setStyle("Warning");
  }
}

export class ErrorEmbed extends EmbedHelper {
  constructor() {
    super();
    this.setStyle("Error");
  }
}

export class SuccessEmbed extends EmbedHelper {
  constructor() {
    super();
    this.setStyle("Success");
  }
}

export class BlacklistEmbed extends SuccessEmbed {
  constructor(user: BlacklistUser, player: Player | null = null, guildMember: GuildMember | undefined | null = null) {
    super();
    this.setAuthor({ name: "Found Blacklist" });
    this.addFields(
      { name: "Blacklisted Reason", value: user.reason, blockValue: true },
      { name: "Blacklisted By", value: `<@${user.by}>` },
      { name: "Blacklisted Timestamp", value: user.timestamp.toString(), formatTimestamp: true }
    );
    this.addDiscordFields(user.discordId ?? "UNKNOWN");
    this.addMinecraftFields({ formattedNickname: player?.formattedNickname, nickname: player?.nickname, uuid: player?.uuid });
    this.addFields(
      { name: "Is in Guild", value: guildMember === null ? "UNKNOWN" : guildMember !== undefined ? ":white_check_mark: Yes" : ":x: No" },
      { name: "Blacklist ID", value: user.blacklistId, blockValue: true }
    );
    this.setTimestamp(Date.now());
    this.setDevFooter("Kathund", "Last Updated");
  }
}

export class InactivityEmbed extends SuccessEmbed {
  constructor(user: InactiveUser, player: Player | null = null) {
    super();
    this.setAuthor({ name: "Found Inactivity" });
    this.setFields(
      { name: "Inactivity Reason", value: user.reason, blockValue: true },
      { name: "Start Time", value: user.start.toString(), formatTimestamp: true },
      { name: "Expire Time", value: user.expires.toString(), formatTimestamp: true }
    );
    this.addDiscordFields(user.discordId ?? "UNKNOWN");
    this.addMinecraftFields({ formattedNickname: player?.formattedNickname, nickname: player?.nickname, uuid: player?.uuid });
    this.addFields({ name: "Inactivity ID", value: user.inactivityId, blockValue: true });
    this.setTimestamp(Date.now());
    this.setDevFooter("Kathund", "Last Updated");
  }
}
