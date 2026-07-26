/* eslint-disable import/no-anonymous-default-export */
import enforceEmbed from "./rules/enforceEmbed.js";
import enforceTranslate from "./rules/enforceTranslate.js";

export default { rules: { "enforce-translate": enforceTranslate, "enforce-embed": enforceEmbed } };
