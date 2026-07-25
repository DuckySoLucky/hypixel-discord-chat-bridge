import GenericData from "../GenericData.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MowojangAPI from "../../private/MowojangAPI.js";
import { formatNumber, replaceVariables } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type LinkedManager from "./LinkedManager.js";
import type { Guild, GuildMember as HypixelGuildMember, Player } from "hypixel-api-reborn";
import type { GuildMember } from "discord.js";
import type { LinkedData, LinkedUserData } from "../../types/linked.js";

class LinkedUser extends GenericData<LinkedUserData, LinkedData, LinkedManager> {
  readonly discordId: string;
  readonly uuid: string;
  constructor(data: LinkedUserData, manager: LinkedManager) {
    super(manager);
    this.discordId = data.discordId;
    this.uuid = data.uuid;
  }

  async getUsername(): Promise<string> {
    const username = await MowojangAPI.getUsername(this.uuid);
    if (username === null) throw new HypixelDiscordChatBridgeError("User doesn't exist");
    return username;
  }

  override async save(): Promise<typeof this> {
    const linked = await this.manager.getFullData();
    const user = await this.manager.getData(this);
    if (user) return user;
    linked.push(this);
    await this.manager.writeUsersParsed(linked);
    return this;
  }

  private getLinkedRoles(): string[] {
    const verificationRoles = this.manager.data.application.config.verification.roles;
    return [verificationRoles.verified.roleId, verificationRoles.guildMember.roleId, ...verificationRoles.custom.flatMap((r) => r.roleId)].filter(
      (role) => role !== null
    );
  }

  async reset() {
    if (!this.manager.data.application.minecraft.isBotOnline()) return;
    if (!this.manager.data.application.discord.isClientOnline()) return;
    if (!this.manager.data.application.discord.isGuildReady()) return this.manager.data.application.discord.stateHandler.loadGuild();

    try {
      const member = await this.manager.data.application.discord.guild.members.fetch(this.discordId);
      if (!member) return;
      if (this.manager.data.application.config.verification.nickname.enabled && member.nickname) await member.setNickname(null);
      await member.roles.remove(this.getLinkedRoles(), "Updated Roles");
    } catch (error) {
      console.error(`Failed to completely clean up roles for ${this.discordId}:`, error);
    }
  }

  override async delete(): Promise<LinkedUser[]> {
    const linked = await this.manager.getFullData();
    const updated = linked.filter((u) => u.uuid !== this.uuid && u.discordId !== this.discordId);
    return await this.manager.writeUsersParsed(updated);
  }

  async updateRoles(): Promise<this | null> {
    try {
      if (!this.manager.data.application.minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError(this.manager.data.application.messages.minecraftBotOffline);
      if (!this.manager.data.application.discord.isClientOnline()) {
        throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
      }
      if (!this.manager.data.application.discord.isGuildReady()) {
        this.manager.data.application.discord.stateHandler.loadGuild();
        throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
      }

      const member = await this.getDiscordUser();
      if (!member) {
        this.delete();
        return null;
      }

      if (this.manager.data.application.discord.guild.ownerId === member.user.id) {
        throw new HypixelDiscordChatBridgeError("This user owns the server thus no one can edit their roles");
      }

      const verificationRoles = this.manager.data.application.config.verification.roles;
      const rolesToAdd: string[] = [];

      if (verificationRoles.verified.enabled) rolesToAdd.push(verificationRoles.verified.roleId);
      const hypixelGuild = await this.manager.data.application.getBotGuild();
      const stats = await this.manager.getPlayerVariableStats(this.uuid, hypixelGuild);
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
      }

      if (verificationRoles.custom.length > 0) {
        for (const role of verificationRoles.custom.filter((r) => r.requirements.some((req) => req.type !== "guildRank"))) {
          if (role.enabled === false) continue;
          const meetsRequirements = role.requirements.every((req) => req.value <= (stats[req.type] ?? 0));
          if (meetsRequirements) rolesToAdd.push(role.roleId);
        }
      }

      if (this.manager.data.application.config.verification.nickname.enabled) {
        await member.setNickname(
          replaceVariables(
            this.manager.data.application.config.verification.nickname.nickname,
            Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, typeof value === "number" ? formatNumber(value) : value]))
          ).replace(/,/g, this.manager.data.application.config.verification.nickname.removeCommas ? "" : ","),
          "Updated Roles"
        );
      }

      await member.roles.add(rolesToAdd, "Updated Roles");
      await member.roles.remove(
        this.getLinkedRoles().filter((role) => !rolesToAdd.includes(role)),
        "Updated Roles"
      );
      return this;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getDiscordUser(): Promise<GuildMember | null> {
    if (!this.manager.data.application.discord.isClientOnline()) {
      throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    }
    if (!this.manager.data.application.discord.isGuildReady()) {
      this.manager.data.application.discord.stateHandler.loadGuild();
      throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
    }

    return await this.manager.data.application.discord.guild.members.fetch(this.discordId).catch((e) => {
      console.error(e);
      return null;
    });
  }

  async getHypixelPlayer(): Promise<Player> {
    return await getPlayer(this.uuid);
  }

  async isUserInHypixelGuild(hypixelGuild: Guild | null = null): Promise<HypixelGuildMember | undefined> {
    const guild = hypixelGuild ?? (await this.manager.data.application.getBotGuild());
    return guild.members.find((member) => member.uuid === this.uuid);
  }

  toJSON(): LinkedUserData {
    return { uuid: this.uuid, discordId: this.discordId };
  }
}

export default LinkedUser;
