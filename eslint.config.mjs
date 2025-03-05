import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";
import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.es2021,
        ...globals.node,
        bot: "readonly",
        client: "readonly",
        guild: "readonly",
        imgurUrl: "writeable"
      }
    },
    rules: {
      "no-constant-condition": ["error", { checkLoops: false }],
      "import/extensions": ["warn", "always", { ts: "never" }],
      "prefer-const": ["warn", { destructuring: "all" }],
      "no-unused-vars": ["error", { args: "none" }],
      curly: ["warn", "multi-line", "consistent"]
    }
  }
];
