import BasicScript from "../../BasicScript.js";
import { emptySchedule } from "../../../types/scripts.js";
import type ScriptManager from "../../ScriptsManager.js";

class RefreshBlacklistEmbedsScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, { id: "refreshBlacklistEmbeds", enabled: true, schedule: emptySchedule() });
  }

  override async execute() {
    const blacklistedUsers = await this.scripts.application.data.blacklist.getFullData();
    for (const blacklistUser of blacklistedUsers) {
      await blacklistUser.refreshMessage();
      await this.log(`Updated blacklist embed for <@${blacklistUser.discordId}> (${blacklistUser.discordId} - ${blacklistUser.uuid})`);
    }
  }
}

export default RefreshBlacklistEmbedsScript;
