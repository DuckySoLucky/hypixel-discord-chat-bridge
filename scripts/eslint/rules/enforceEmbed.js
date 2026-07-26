import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator((name) => name);

export default createRule({
  name: "eslint-enforce-embed",
  defaultOptions: [{ always: true }],
  meta: {
    docs: { description: "enforce using the Embed class" },
    messages: {
      usingEmbed:
        "Using the Embed class is the preferred way to handle Embeds. The custom Embed class uses custom abstractions on top of the base EmbedBuilder and has custom presets"
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
        if (node.callee.name === "EmbedBuilder") {
          return context.report({
            node,
            messageId: "usingEmbed",
            fix: (fixer) => {
              return fixer.replaceText(node, context.sourceCode.getText(node).replace(/new EmbedBuilder\(\)/g, "new Embed()"));
            }
          });
        }
      }
    };
  }
});
