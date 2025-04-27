const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatNumber } = require("../../contracts/helperFunctions.js");
const { ProfileNetworthCalculator } = require("skyhelper-networth");

class NetWorthCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "networth";
    this.aliases = ["nw"];
    this.description = "Networth of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false
      }
    ];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile, museum, profileData } = await getLatestProfile(player, { museum: true });
      const bankingBalance = profileData.banking?.balance ?? 0;

      const networthManager = new ProfileNetworthCalculator(profile, museum, bankingBalance);
      const networthData = await networthManager.getNetworth({ onlyNetworth: true });
      const nonCosmeticNetworthData = await networthManager.getNonCosmeticNetworth({ onlyNetworth: true });

      if (networthData.noInventory === true) {
        return this.send(`${username} has an Inventory API off!`);
      }

      const networth = formatNumber(networthData.networth);
      const unsoulboundNetworth = formatNumber(networthData.unsoulboundNetworth);
      const nonCosmeticNetworth = formatNumber(nonCosmeticNetworthData.networth);
      const nonCosmeticUnsoulboundNetworth = formatNumber(nonCosmeticNetworthData.unsoulboundNetworth);

      const purse = formatNumber(networthData.purse);
      const bank = profileData.banking?.balance ? formatNumber(profileData.banking.balance) : "N/A";
      const personalBank = profile.profile?.bank_account ? formatNumber(profile.profile.bank_account) : "N/A";
      const museumData = museum ? formatNumber(networthData.types.museum?.total ?? 0) : "N/A";

      this.send(
        `${username}'s Networth is ${networth} | Non-Cosmetic Networth: ${nonCosmeticNetworth} | Unsoulbound Networth: ${unsoulboundNetworth} | Non-Cosmetic Unsoulbound Networth: ${nonCosmeticUnsoulboundNetworth} | Purse: ${purse} | Bank: ${bank} + ${personalBank} | Museum: ${museumData}`
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = NetWorthCommand;
