import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { ProfileNetworthCalculator } from "skyhelper-networth";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile, getSkyBlockMuseum } from "../../utils/hypixelUtils.js";

class NetworthCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("networth")
    .setDescription("Networth of specified user.")
    .setAliases(["nw"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setRequired(true)]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile, raw } = await getSelectedProfile(player);

    const selectedProfile = raw.rawData.profiles.find((profile: Record<string, any>) => profile.selected === true);
    if (selectedProfile === undefined) throw new HypixelDiscordChatBridgeError("Player doesn't have a skyblock profile selected.");
    const museum = await getSkyBlockMuseum(selectedProfile.profileId);

    const museumProfile = museum.raw.rawData.members[selectedProfile.me.uuid];
    if (museumProfile === undefined) throw new HypixelDiscordChatBridgeError("Player has museum API off.");

    const networthCalculator = new ProfileNetworthCalculator(selectedProfile, museumProfile, selectedProfile.banking.balance);

    const networthData = await networthCalculator.getNetworth({ onlyNetworth: true });
    const nonCosmeticNetworthData = await networthCalculator.getNonCosmeticNetworth({ onlyNetworth: true });

    const networth = formatNumber(networthData.networth);
    const unsoulboundNetworth = formatNumber(networthData.unsoulboundNetworth);
    const nonCosmeticNetworth = formatNumber(nonCosmeticNetworthData.networth);
    const nonCosmeticUnsoulboundNetworth = formatNumber(nonCosmeticNetworthData.unsoulboundNetworth);

    const purse = formatNumber(networthData.purse);
    const bank = profile.banking.balance !== 0 ? formatNumber(profile.banking.balance) : "N/A";
    const personalBank = profile.me.profileStats.bankAccount !== 0 ? formatNumber(profile.me.profileStats.bankAccount) : "N/A";
    const museumData = formatNumber(networthData.types.museum?.total ?? 0);

    await this.send(
      `${username}'s Networth is ${networth} | Non-Cosmetic Networth: ${nonCosmeticNetworth} | Unsoulbound Networth: ${
        unsoulboundNetworth
      } | Non-Cosmetic Unsoulbound Networth: ${nonCosmeticUnsoulboundNetworth} | Purse: ${purse} | Bank: ${bank} + ${personalBank} | Museum: ${museumData}`
    );
  }
}

export default NetworthCommand;
