import BasicScript from "../BasicScript.js";
import { ScriptLogState } from "../../types/scripts.js";
import type ScriptManager from "../ScriptsManager.js";

class UpdateLinkedUsersScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, {
      id: "updateLinkedUsers",
      enabled: scripts.application.config.verification.roles.autoUpdater.enabled,
      interval: scripts.application.config.verification.roles.autoUpdater.interval
    });
  }

  override async execute() {
    const linkedUsers = await this.scripts.application.data.linked.getFullData();
    for (const linkedUser of linkedUsers) {
      const response = await linkedUser.updateRoles();
      if (response === null) {
        this.log(
          `Unable to update roles for <@${linkedUser.discordId}> (${linkedUser.discordId} - ${linkedUser.uuid}). Removing them from linked users`,
          ScriptLogState.Bad
        );
        continue;
      }
      this.log(`Updated roles for <@${linkedUser.discordId}> (${linkedUser.discordId} - ${linkedUser.uuid})`);
    }
  }
}

export default UpdateLinkedUsersScript;
