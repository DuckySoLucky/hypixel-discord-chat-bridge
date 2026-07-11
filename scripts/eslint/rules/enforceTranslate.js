import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator((name) => name);

export default createRule({
  name: "eslint-enforce-translate",
  defaultOptions: [{ always: true }],
  meta: {
    docs: { description: "enforce using the translate function" },
    messages: { missingTranslate: "Use the translate function when parsing in strings for the end user" },
    schema: [],
    type: "problem"
  },

  create(context) {
    /**
     * @param {import("@typescript-eslint/utils").TSESTree.Node} expression
     * @returns {boolean}
     */
    function isConsoleFunctionExpression(expression) {
      if (expression.type !== AST_NODE_TYPES.CallExpression) return;
      if (expression.callee.type !== AST_NODE_TYPES.MemberExpression) return;
      if (expression.callee.object.type !== AST_NODE_TYPES.Identifier) return;
      if (expression.callee.object.name !== "console") return;
      if (expression.callee.property.type !== AST_NODE_TYPES.Identifier) return;
      if (expression.callee.property.name === "error") {
        if (expression.parent.type !== AST_NODE_TYPES.ExpressionStatement) return;
        if (expression.parent.parent.type !== AST_NODE_TYPES.BlockStatement) return;
        if (expression.parent.parent.parent.type !== AST_NODE_TYPES.CatchClause) return;
        if (expression.parent.parent.parent.param.type !== AST_NODE_TYPES.Identifier) return;
        if (["e", "err", "error"].includes(expression.parent.parent.parent.param.name)) return;
      }
      return ["warn", "error", "discord", "minecraft", "scripts", "broadcast", "other"].includes(expression.callee.property.name);
    }

    /**
     * @param {import("@typescript-eslint/utils").TSESTree.Node} expression
     * @returns {boolean}
     */
    function isSendFunctionExpression(expression) {
      return (
        expression.type === AST_NODE_TYPES.CallExpression &&
        expression.callee.type === AST_NODE_TYPES.MemberExpression &&
        expression.callee.object.type === AST_NODE_TYPES.ThisExpression &&
        expression.callee.property.type === AST_NODE_TYPES.Identifier &&
        expression.callee.property.name === "send"
      );
    }

    /**
     * @param {import("@typescript-eslint/utils").TSESTree.Node} expression
     * @returns {boolean}
     */
    function isEmbedMethodExpression(expression) {
      if (expression.type !== AST_NODE_TYPES.CallExpression) return false;
      if (expression.callee.type !== AST_NODE_TYPES.MemberExpression) return false;
      if (expression.callee.object.type !== AST_NODE_TYPES.NewExpression) return false;
      if (expression.callee.object.callee.type !== AST_NODE_TYPES.Identifier) return false;
      if (!["Embed", "WarningEmbed", "ErrorEmbed", "SuccessEmbed"].includes(expression.callee.object.callee.name)) return false;
      if (expression.callee.property.type !== AST_NODE_TYPES.Identifier) return false;
      if (["setDescription", "setTitle"].includes(expression.callee.property.name)) return true;
      if (expression.callee.property.name === "setAuthor") {
        if (expression.arguments.length !== 1) return false;
        if (expression.arguments[0].type !== AST_NODE_TYPES.ObjectExpression) return false;
        if (!(expression.arguments[0].properties.length >= 1)) return false;
        const author = expression.arguments[0].properties.filter((prop) => prop.type === AST_NODE_TYPES.Property).find((prop) => prop.key.name === "name");
        if (!author) return false;
        return true;
      }
      return false;
    }

    /**
     * @param {import("@typescript-eslint/utils").TSESTree.CallExpression | import("@typescript-eslint/utils").TSESTree.NewExpression} node
     */
    function validateTranslateCall(node) {
      if (node.arguments.length !== 1) return context.report({ node, messageId: "missingTranslate" });
      let value = node.arguments[0];

      // Handle Embed().setAuthor({ name: "x" });
      if (
        node.type === AST_NODE_TYPES.CallExpression &&
        node.callee.type === AST_NODE_TYPES.MemberExpression &&
        node.callee.property.type === AST_NODE_TYPES.Identifier &&
        node.callee.property.name === "setAuthor"
      ) {
        if (value.type !== AST_NODE_TYPES.ObjectExpression) return context.report({ node, messageId: "missingTranslate" });
        const name = value.properties.find((prop) => prop.type === AST_NODE_TYPES.Property && prop.key.type === AST_NODE_TYPES.Identifier && prop.key.name === "name");
        if (!name || name.type !== AST_NODE_TYPES.Property) return context.report({ node, messageId: "missingTranslate" });
        value = name.value;
      }

      if (value.type === AST_NODE_TYPES.Literal && value.value === null) return;
      const isUsingTranslate = value.type === AST_NODE_TYPES.CallExpression && value.callee.type === AST_NODE_TYPES.Identifier && value.callee.name === "translate";
      if (!isUsingTranslate) context.report({ node, messageId: "missingTranslate" });
    }

    return {
      /**
       * @param {import("@typescript-eslint/utils").TSESTree.ReturnStatement} node
       */
      ReturnStatement(node) {
        if (!node.argument) return;
        if (isSendFunctionExpression(node.argument) || isEmbedMethodExpression(node.argument) || isConsoleFunctionExpression(node.argument)) {
          validateTranslateCall(node.argument);
        }
      },

      /**
       * @param {import("@typescript-eslint/utils").TSESTree.ExpressionStatement} node
       */
      ExpressionStatement(node) {
        if (isSendFunctionExpression(node.expression) || isEmbedMethodExpression(node.expression) || isConsoleFunctionExpression(node.expression)) {
          validateTranslateCall(node.expression);
        }
      },

      /**
       * @param {import("@typescript-eslint/utils").TSESTree.ThrowStatement} node
       */
      ThrowStatement(node) {
        const arg = node.argument;
        if (arg && arg.type === AST_NODE_TYPES.NewExpression && arg.callee.type === AST_NODE_TYPES.Identifier && arg.callee.name === "HypixelDiscordChatBridgeError") {
          validateTranslateCall(arg);
        }
      },

      /**
       * @param {import("@typescript-eslint/utils").TSESTree.CallExpression} node
       */
      CallExpression(node) {
        if (isEmbedMethodExpression(node)) validateTranslateCall(node);
      }
    };
  }
});
