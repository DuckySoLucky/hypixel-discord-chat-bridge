import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator((name) => name);

export default createRule({
  name: "eslint-enforce-no-plugin-api-imports",
  defaultOptions: [{ always: true }],
  meta: {
    docs: { description: "Block importing thigns from the plugin api" },
    messages: { usingImport: "Imports should not come from the plugin api" },
    schema: [],
    type: "problem",
    fixable: "code"
  },

  create(context) {
    return {
      /**
       * @param {import("@typescript-eslint/utils").TSESTree.ImportDeclaration} node
       */
      ImportDeclaration(node) {
        if (node.source.type !== AST_NODE_TYPES.Literal) return;
        const value = node.source.value.replace(/\.(ts|js)$/, "");
        if (value.endsWith("plugin-api") && value.startsWith(".")) return context.report({ node, messageId: "usingImport" });
      }
    };
  }
});
