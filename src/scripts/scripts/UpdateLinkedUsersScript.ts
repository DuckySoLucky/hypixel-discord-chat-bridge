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
        this.log("scripts.updateLinkedUsers.execute.error", linkedUser, ScriptLogState.Bad);
        continue;
      }
      this.log("scripts.updateLinkedUsers.execute.success", linkedUser);
    }
  }
}

export default UpdateLinkedUsersScript;
