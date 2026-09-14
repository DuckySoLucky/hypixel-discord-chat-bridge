/* eslint-disable import/no-anonymous-default-export */
import enforceDiscordCommandDataBuilder from "./rules/enforceDiscordCommandDataBuilder.js";
import enforceEmbedHelper from "./rules/enforceEmbedHelper.js";
import enforceNoPluginAPIImports from "./rules/enforceNoPluginAPIImports.js";

export default {
  rules: {
    "enforce-discord-command-data-builder": enforceDiscordCommandDataBuilder,
    "enforce-embed-helper": enforceEmbedHelper,
    "enforce-no-plugin-api-imports": enforceNoPluginAPIImports
  }
};
