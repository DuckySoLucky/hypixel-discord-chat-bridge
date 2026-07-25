import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber, replaceVariables } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";
import type { Rarity, SkyBlockInventoryItem } from "hypixel-api-reborn";

class AccessoriesCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("accessories")
      .setDescription("Accessories of specified user.")
      .setAliases(["acc", "talismans", "talisman", "mp", "magicpower"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  static getAccessories(accessories: SkyBlockInventoryItem[]) {
    try {
      const output: { amount: number; recombed: number; enriched: number; rarities: { [key in Rarity]: number } } = {
        amount: 0,
        recombed: 0,
        enriched: 0,
        rarities: { COMMON: 0, UNCOMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0, MYTHIC: 0, DIVINE: 0, SPECIAL: 0, VERY_SPECIAL: 0 }
      };

      if (!accessories?.length) return output;
      for (const accessory of accessories) {
        output.amount++;
        output.rarities[accessory.rarity]++;
        if (accessory.recombobulated) output.recombed++;
        output.enriched += accessory.raw.tag.ExtraAttributes.rarity_upgrades ? 1 : 0;
      }

      return output;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;

    const { username, profile } = await getSelectedProfile(player);
    if (profile.me.inventory.bags.talisman.base64 === undefined || profile.me.inventory.inventory.base64 === null) {
      throw new HypixelDiscordChatBridgeError(`${username} has Inventory API off.`);
    }

    const decoded = await profile.me.inventory.bags.talisman.decodeData();
    if (!decoded) throw new HypixelDiscordChatBridgeError(`${username} has no SkyBlock profiles.`);
    const talismans = AccessoriesCommand.getAccessories(decoded.items);
    if (!talismans) throw new HypixelDiscordChatBridgeError(replaceVariables("Couldn't parse {username}'s talismans", { username }));

    const { recombed, amount, enriched, rarities } = talismans;
    const { COMMON, RARE, EPIC, LEGENDARY, MYTHIC, SPECIAL } = rarities;
    this.send(
      `${username}'s Accessories: ${amount} (${formatNumber(decoded.magicalPower)} MP), Recombed: ${recombed}, Enriched: ${enriched} (${COMMON}C, ${RARE}R, ${EPIC}E, ${
        LEGENDARY
      }L, ${MYTHIC}M, ${SPECIAL}S)`
    );
  }
}

export default AccessoriesCommand;
