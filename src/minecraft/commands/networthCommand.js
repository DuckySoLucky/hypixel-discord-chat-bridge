const { formatNumber } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getNetworth } = require("skyhelper-networth");

class NetWorthCommand extends minecraftCommand {
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

  async onCommand(player, message) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile, museum, profileData } = await getLatestProfile(player, { museum: true });

      const networthData = await getNetworth(profile, profileData?.banking?.balance || 0, {
        museumData: museum,
        onlyNetworth: true,
        v2Endpoint: true,
        cache: true
      });

      if (profile.noInventory === true) {
        return this.send(`${username} has an Inventory API off!`);
      }

      const networth = formatNumber(networthData.networth);
      const unsoulboundNetworth = formatNumber(networthData.unsoulboundNetworth);
      const purse = formatNumber(networthData.purse);
      const bank = networthData.bank ? formatNumber(networthData.bank) : "N/A";
      const museumData = museum ? formatNumber(networthData.types.museum?.total ?? 0) : "N/A";

      this.send(
        `${username}'s Networth is ${networth} | Unsoulbound Networth: ${unsoulboundNetworth} | Purse: ${purse} | Bank: ${bank} | Museum: ${museumData}`
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = NetWorthCommand;
