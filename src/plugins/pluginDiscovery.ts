import { basename } from "node:path";

function isPluginEntry(relativePath: string): boolean {
  return relativePath === basename(relativePath) || /^index\.(?:js|ts)$/u.test(basename(relativePath));
}

export default isPluginEntry;
