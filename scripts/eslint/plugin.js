/* eslint-disable import/no-anonymous-default-export */
import enforceDiscordCommandDataBuilder from "./rules/enforceDiscordCommandDataBuilder.js";
import enforceEmbedHelper from "./rules/enforceEmbedHelper.js";

export default { rules: { "enforce-embed-helper": enforceEmbedHelper, "enforce-discord-command-data-builder": enforceDiscordCommandDataBuilder } };
