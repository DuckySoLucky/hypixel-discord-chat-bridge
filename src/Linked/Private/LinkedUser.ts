import HypixelAPIReborn from "../../Private/HypixelAPIReborn.js";
import HypixelDiscordChatBridgeError from "../../Private/Error.js";
import { FormatNumber, ReplaceVariables } from "../../Utils/StringUtils.js";
import type LinkedManager from "../LinkedManager.js";
import type { Guild, GuildMember as HypixelGuildMember, Player } from "hypixel-api-reborn";
import type { GuildMember } from "discord.js";
import type { LinkedUserData } from "../../Types/Linked.js";

class LinkedUser {
  private linked: LinkedManager;
  discordId: string;
  uuid: string;
  constructor(data: LinkedUserData, linked: LinkedManager) {
    this.linked = linked;
    this.discordId = data.discordId;
    this.uuid = data.uuid;
  }

  save(): LinkedUser[] {
    const linked = this.linked.getLinkedUsers();
    const user = this.linked.getUser(this);
    if (user) return this.linked.getLinkedUsers();
    linked.push(this);
    return this.linked.writeLinkedUsersParsed(linked);
  }

  async reset(): Promise<void> {
    if (!this.linked.app.minecraft.isBotOnline()) return;
    if (!this.linked.app.discord.isClientOnline()) return;
    if (!this.linked.app.discord.isGuildReady()) return this.linked.app.discord.stateHandler.loadGuild();

    try {
      const member = await this.linked.app.discord.guild.members.fetch(this.discordId);
      if (!member) return;
      if (this.linked.app.config.verification.nickname.enabled && member.nickname) await member.setNickname(null);
      const verificationRoles = this.linked.app.config.verification.roles;
      const roles = [verificationRoles.guildMember.roleId, ...verificationRoles.custom.flatMap((r) => r.roleId)];
      for (const role of roles) {
        if (member.roles.cache.has(role)) await member.roles.remove(role, "Updated Roles");
      }
    } catch (error) {
      console.error(`Failed to completely clean up roles for ${this.discordId}:`, error);
    }
  }

  delete(): LinkedUser[] {
    const linked = this.linked.getLinkedUsers();
    const updated = linked.filter((u) => u.uuid !== this.uuid && u.discordId !== this.discordId);
    return this.linked.writeLinkedUsersParsed(updated);
  }

  async updateRoles(): Promise<this | null> {
    if (!this.linked.app.minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError("Bot doesn't seem to be connected to Hypixel. Please try again.");
    if (!this.linked.app.discord.isClientOnline()) throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    if (!this.linked.app.discord.isGuildReady()) {
      this.linked.app.discord.stateHandler.loadGuild();
      throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
    }

    const member = await this.getDiscordUser();
    if (!member) {
      this.delete();
      return null;
    }

    if (this.linked.app.discord.guild.ownerId === member.user.id) throw new HypixelDiscordChatBridgeError("This user owns the server thus the bot cannot update it");

    const verificationRoles = this.linked.app.config.verification.roles;
    const rolesToAdd: string[] = [];
    const rolesToRemove: string[] = [];

    if (verificationRoles.verified.enabled) rolesToAdd.push(verificationRoles.verified.roleId);
    const hypixelGuild = await this.linked.app.getBotGuild();
    const stats = await this.linked.getPlayerVariableStats(this.uuid, hypixelGuild);
    const guildMember = await this.isUserInHypixelGuild(hypixelGuild);
    if (guildMember) {
      if (verificationRoles.guildMember.enabled) rolesToAdd.push(verificationRoles.guildMember.roleId);

      const guildRank = verificationRoles.custom.find((r) =>
        r.requirements
          .filter((req) => r.enabled !== false && req.type === "guildRank")
          .map((req) => req.value)
          .includes(guildMember.rank)
      );
      if (guildRank && guildRank.enabled !== false) rolesToAdd.push(guildRank.roleId);
    } else if (verificationRoles.guildMember.enabled) {
      rolesToRemove.push(verificationRoles.guildMember.roleId);
    }

    if (verificationRoles.custom.length > 0) {
      for (const role of verificationRoles.custom.filter((r) => r.requirements.some((req) => req.type !== "guildRank"))) {
        if (role.enabled === false) continue;
        const meetsRequirements = role.requirements.every((req) => req.value <= (stats[req.type] ?? 0));
        if (meetsRequirements) rolesToAdd.push(role.roleId);
      }
    }

    if (this.linked.app.config.verification.nickname.enabled) {
      member.setNickname(
        ReplaceVariables(
          this.linked.app.config.verification.nickname.nickname,
          Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, typeof value === "number" ? FormatNumber(value) : value]))
        ).replace(/,/g, this.linked.app.config.verification.nickname.removeCommas ? "" : ","),
        "Updated Roles"
      );
    }

    await member.roles.add(rolesToAdd, "Updated Roles");
    await member.roles.remove(
      [verificationRoles.guildMember.roleId, ...verificationRoles.custom.flatMap((r) => r.roleId), ...rolesToRemove].filter((role) => !rolesToAdd.includes(role)),
      "Updated Roles"
    );
    return this;
  }

  async getDiscordUser(): Promise<GuildMember | null> {
    if (!this.linked.app.discord.isClientOnline()) throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    if (!this.linked.app.discord.isGuildReady()) {
      this.linked.app.discord.stateHandler.loadGuild();
      throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
    }

    return await this.linked.app.discord.guild.members.fetch(this.discordId).catch((e) => {
      console.log(e);
      return null;
    });
  }

  async getHypixelPlayer(): Promise<Player> {
    return await HypixelAPIReborn.getPlayer(this.uuid).then((playerData) => {
      if (playerData.isRaw()) throw new HypixelDiscordChatBridgeError("Failed to fetch Player data.");
      return playerData;
    });
  }

  async isUserInHypixelGuild(hypixelGuild: Guild | null = null): Promise<HypixelGuildMember | undefined> {
    const guild = hypixelGuild ?? (await this.linked.app.getBotGuild());
    return guild.members.find((member) => member.uuid === this.uuid);
  }

  toJSON(): LinkedUserData {
    return { uuid: this.uuid, discordId: this.discordId };
  }
}

export default LinkedUser;
