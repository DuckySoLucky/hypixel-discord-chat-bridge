import BasicScript from "../../BasicScript.js";
import { ScriptLogState, intervalSchedule } from "../../../types/scripts.js";
import type ScriptManager from "../../ScriptsManager.js";

class UpdateLinkedUsersScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, {
      id: "updateLinkedUsers",
      enabled: scripts.application.config.verification.roles.autoUpdater.enabled,
      schedule: intervalSchedule(scripts.application.config.verification.roles.autoUpdater.interval)
    });
  }

  override async execute() {
    const linkedUsers = await this.scripts.application.data.linked.getFullData();
    for (const linkedUser of linkedUsers) {
      const response = await linkedUser.updateRoles();
      if (response === null) {
        await this.log(
          `Unable to update roles for <@${linkedUser.discordId}> (${linkedUser.discordId} - ${linkedUser.uuid}). Removing them from linked users`,
          ScriptLogState.Bad
        );
        continue;
      }
      await this.log(`Updated roles for <@${linkedUser.discordId}> (${linkedUser.discordId} - ${linkedUser.uuid})`);
    }
  }
}

export default UpdateLinkedUsersScript;
