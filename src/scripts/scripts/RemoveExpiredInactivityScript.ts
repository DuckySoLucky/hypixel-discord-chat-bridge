import BasicScript from "../BasicScript.js";
import type ScriptManager from "../ScriptsManager.js";

class RemoveExpiredInactivityScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, { id: "removeExpiredInactivity", enabled: scripts.application.config.verification.inactivity.enabled, interval: "1m" });
  }

  override async execute() {
    const users = await this.scripts.application.data.inactivity.getFullData().then((users) => users.filter((user) => user.isExpired));
    for (const user of users) await user.delete();
  }
}

export default RemoveExpiredInactivityScript;
