import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator((name) => name);

export default createRule({
  name: "eslint-enforce-discord-command-data-builder",
  defaultOptions: [{ always: true }],
  meta: {
    docs: { description: "Enforce using the DiscordCommandDataBuilder  class" },
    messages: {
      usingSlashCommandBuilder:
        "Using the DiscordCommandDataBuilder class is the preferred way to handle slash command data. See docs/Development/Discord/Commands/Data.md for more information"
    },
    schema: [],
    type: "problem",
    fixable: "code"
  },

  create(context) {
    return {
      /**
       * @param {import("@typescript-eslint/utils").TSESTree.NewExpression} node
       */
      NewExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.name === "SlashCommandBuilder") {
          return context.report({
            node,
            messageId: "usingSlashCommandBuilder",
            fix: (fixer) => {
              return fixer.replaceText(node, context.sourceCode.getText(node).replace(/new SlashCommandBuilder\(\)/g, "new DiscordCommandDataBuilder()"));
            }
          });
        }
      }
    };
  }
});
