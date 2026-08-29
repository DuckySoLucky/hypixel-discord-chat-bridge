import BasicScript from "../../BasicScript.js";
import { emptySchedule } from "../../../types/scripts.js";
import type ScriptManager from "../../ScriptsManager.js";

class RemoveAllInactivitiesScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, { id: "removeAllInactivities", enabled: true, schedule: emptySchedule() });
  }

  override async execute() {
    const users = await this.scripts.application.data.inactivity.getFullData();
    for (const user of users) await user.delete();
  }
}

export default RemoveAllInactivitiesScript;
