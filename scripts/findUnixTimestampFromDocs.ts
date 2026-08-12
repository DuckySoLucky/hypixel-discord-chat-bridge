import { readFile } from "node:fs/promises";

const regex = /This document was last updated (?<parsedTimestamp>.+) \((?<unixTimestamp>[0-9]+)\)/;
const readme = await readFile("docs/README.md", "utf-8");
const timestampLine = readme.split("\n").filter((line) => regex.test(line))[0];
if (!timestampLine) throw new Error("Could not find timestamp line");
const match = regex.exec(timestampLine);
if (!match) throw new Error("Could not find timestamp line");
if (!match.groups) throw new Error("Could not find the unix timestamp");
if (!match.groups.unixTimestamp) throw new Error("Could not find the unix timestamp");
console.log(match.groups.unixTimestamp);
