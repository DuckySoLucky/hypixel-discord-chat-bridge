const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getNetworth } = require("skyhelper-networth");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { formatNumber, formatUsername } = require("../../contracts/helperFunctions.js");

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

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username, { museum: true });

      username = formatUsername(username, data.profileData?.game_mode);

      const profile = await getNetworth(data.profile, data.profileData?.banking?.balance || 0, {
        museumData: data.museum,
        onlyNetworth: true,
        v2Endpoint: true,
        cache: true
      });

      if (profile.noInventory === true) {
        return this.send(`/gc ${username} has an Inventory API off!`);
      }

      const networth = formatNumber(profile.networth);
      const unsoulboundNetworth = formatNumber(profile.unsoulboundNetworth);
      const purse = formatNumber(profile.purse);
      const bank = profile.bank ? formatNumber(profile.bank) : "N/A";
      const museum = data.museum ? formatNumber(profile.types.museum?.total ?? 0) : "N/A";

      this.send(
        `/gc ${username}'s Networth is ${networth} | Unsoulbound Networth: ${unsoulboundNetworth} | Purse: ${purse} | Bank: ${bank} | Museum: ${museum}`
      );
    } catch (error) {
      console.log(error);
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = NetWorthCommand;
