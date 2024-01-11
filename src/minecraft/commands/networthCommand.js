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
        required: false,
      },
    ];
  }

  async onCommand(username, message, channel = "gc") {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username, { museum: true });

      username = formatUsername(username, data.profileData?.game_mode);

      let should_cache = true;
      let cache_message = "Cached";

      if (this.getArgs(message)[1] == "force") {
        should_cache = false;
        cache_message = "Refreshed";
      }

      const profile = await getNetworth(data.profile, data.profileData?.banking?.balance || 0, {
        cache: should_cache,
        onlyNetworth: true,
        museumData: data.museum,
      });

      if (profile.noInventory === true) {
        return this.send(`/${channel} ${username} has an Inventory API off!`);
      }

      const networth = formatNumber(profile.networth);
      const unsoulboundNetworth = formatNumber(profile.unsoulboundNetworth);
      const purse = formatNumber(profile.purse);
      const bank = profile.bank ? formatNumber(profile.bank) : "N/A";
      const museum = data.museum ? formatNumber(profile.types.museum?.total ?? 0) : "N/A";

      this.send(
        `/${channel} ${username}'s Networth is ${networth} | Unsoulbound Networth: ${unsoulboundNetworth} | Purse: ${purse} | Bank: ${bank} | Museum: ${museum} | ${cache_message}`
      );
    } catch (error) {
      console.log(error);
      this.send(`/${channel} [ERROR] ${error}`);
    }
  }
}

module.exports = NetWorthCommand;
