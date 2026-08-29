import BlacklistManager from "./blacklist/BlacklistManager.js";
import InactivityManager from "./inactivity/InactivityManager.js";
import LinkedManager from "./linked/LinkedManager.js";
import { mkdir } from "node:fs/promises";
import type Application from "../Application.js";
import type { Lifecycle } from "../core/Lifecycle.js";

class DataManager implements Lifecycle {
  readonly blacklist: BlacklistManager;
  readonly inactivity: InactivityManager;
  readonly linked: LinkedManager;
  constructor(readonly application: Application) {
    this.blacklist = new BlacklistManager(this);
    this.inactivity = new InactivityManager(this);
    this.linked = new LinkedManager(this);
  }

  async start(): Promise<void> {
    await mkdir("./data/", { recursive: true });
    await Promise.all([this.blacklist.start(), this.inactivity.start(), this.linked.start()]);
  }

  async stop(): Promise<void> {
    await Promise.all([this.blacklist.stop(), this.inactivity.stop(), this.linked.stop()]);
  }
}

export default DataManager;
