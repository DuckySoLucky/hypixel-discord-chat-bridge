import BasicScript from "../../BasicScript.js";
import { emptySchedule } from "../../../types/scripts.js";
import type ScriptManager from "../../ScriptsManager.js";

class ResetAllLinkedUsersScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, { id: "resetAllLinkedUsers", enabled: true, schedule: emptySchedule() });
  }

  override async execute() {
    const linkedUsers = await this.scripts.application.data.linked.getFullData();
    for (const linkedUser of linkedUsers) {
      await linkedUser.reset();
      await this.log(`Reset link for <@${linkedUser.discordId}> (${linkedUser.discordId} - ${linkedUser.uuid})`);
    }
  }
}

export default ResetAllLinkedUsersScript;
