const Logger = require("./Logger.js");
const fs = require("fs");

const exampleConfig = JSON.parse(fs.readFileSync("config.example.json"));
const config = JSON.parse(fs.readFileSync("config.json"));

function checkConfig(object, examppleObject) {
  for (const [key, value] of Object.entries(examppleObject)) {
    if (object[key] === undefined) {
      object[key] = value;
      Logger.configUpdateMessage(`${key}: ${JSON.stringify(value)}`);
    }

    if (typeof value === "object") {
      checkConfig(object[key], examppleObject[key]);
    }
  }
}

for (const [key, value] of Object.entries(exampleConfig)) {
  if (config[key] === undefined) {
    config[key] = value;
    Logger.configUpdateMessage(`${key}: ${JSON.stringify(value)}`);
  }

  if (typeof value === "object") {
    checkConfig(config[key], exampleConfig[key]);
  }
}

fs.writeFileSync("config.json", JSON.stringify(config, null, 2));
