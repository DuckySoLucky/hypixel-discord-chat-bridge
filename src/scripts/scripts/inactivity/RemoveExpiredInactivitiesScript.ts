import BasicScript from "../../BasicScript.js";
import { intervalSchedule } from "../../../types/scripts.js";
import type ScriptManager from "../../ScriptsManager.js";

class RemoveExpiredInactivitiesScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, { id: "removeExpiredInactivities", enabled: scripts.application.config.verification.inactivity.enabled, schedule: intervalSchedule("1m") });
  }

  override async execute() {
    const users = await this.scripts.application.data.inactivity.getFullData().then((users) => users.filter((user) => user.isExpired));
    for (const user of users) await user.delete();
  }
}

export default RemoveExpiredInactivitiesScript;
