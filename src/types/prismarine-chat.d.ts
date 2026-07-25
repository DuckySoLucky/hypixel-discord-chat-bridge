// Credit: https://github.com/aidn3/hypixel-guild-discord-bridge/blob/a31353fbd8c37e013c419eec0ba640040d503767/src/instance/minecraft/client-session.ts#L21-L67
// Thank you aidn for letting me skid your shit

// Package official index.d.ts is incorrect.
// This fixes some of those mistakes
declare module "prismarine-chat" {
  // This is only declared for "json" property to be not "any"
  export declare class ChatMessage {
    json: Record<string, unknown>;
    toMotd: () => string;
    toString: () => string;
  }

  // Functions are not static.
  // They require an object created via the default function
  export interface PrismarineChatFormatter {
    fromNotch: (message: string) => ChatMessage;
    fromNetwork: (messageType: number, parameters: Record<string, object>) => ChatMessage;
  }

  // argument can not only be string but also a Registry object
  type PrismarineChatConstructor = (registryOrVersion: string | object) => PrismarineChatFormatter;
  declare const constructor: PrismarineChatConstructor;

  // The loader is directly accesses not via "_default"
  export = constructor;
}
