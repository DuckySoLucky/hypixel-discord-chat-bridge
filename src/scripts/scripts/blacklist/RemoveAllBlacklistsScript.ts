import BasicScript from "../../BasicScript.js";
import { emptySchedule } from "../../../types/scripts.js";
import type ScriptManager from "../../ScriptsManager.js";

class RemoveAllBlacklistsScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, { id: "removeAllBlacklists", enabled: true, schedule: emptySchedule() });
  }

  override async execute() {
    const blacklistedUsers = await this.scripts.application.data.blacklist.getFullData();
    const reason = "No reason provided";
    const alertUser = this.scripts.application.config.blacklist.notifications.onBlacklistChange.enabled;
    const shareUser = this.scripts.application.config.blacklist.notifications.onBlacklistChange.shareBlacklister;
    const user = this.getUser();
    for (const blacklistUser of blacklistedUsers) await blacklistUser.delete({ alertUser, shareUser, user, reason });
  }
}

export default RemoveAllBlacklistsScript;
