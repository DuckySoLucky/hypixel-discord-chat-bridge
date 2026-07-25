import BlacklistManager from "./blacklist/BlacklistManager.js";
import InactivityManager from "./inactivity/InactivityManager.js";
import LinkedManager from "./linked/LinkedManager.js";
import { mkdir } from "node:fs/promises";
import type Application from "../Application.js";

class DataManager {
  readonly blacklist: BlacklistManager;
  readonly inactivity: InactivityManager;
  readonly linked: LinkedManager;
  constructor(readonly application: Application) {
    this.init();
    this.blacklist = new BlacklistManager(this);
    this.inactivity = new InactivityManager(this);
    this.linked = new LinkedManager(this);
  }

  private async init() {
    await mkdir("./data/", { recursive: true });
  }
}

export default DataManager;
