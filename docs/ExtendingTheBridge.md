# Extending The Bridge

The bridge supports class-based Discord commands, Minecraft commands, buttons, modals, scheduled scripts, bridge event listeners, and project-level plugins. Extensions
can be registered programmatically without changing core handlers.

## Built-In Extensions

Built-in extensions remain in their platform directories and are discovered relative to the compiled module. Development loads `.ts` modules and production loads the
emitted `.js` modules.

- Discord commands: `src/discord/commands/`
- Discord buttons: `src/discord/buttons/`
- Discord modals: `src/discord/modals/`
- Minecraft commands: `src/minecraft/commands/`
- Scripts: `src/scripts/scripts/`

Every module must default-export a constructable extension class. Duplicate command names, aliases, button IDs, modal IDs, script IDs, and plugin IDs fail registration
with an error that includes the source module.

## Plugins

Place plugin modules in the project-level `plugins/` directory. A plugin registers extensions before Discord command deployment, starts after Discord and Minecraft are
ready, and stops during application shutdown.

```ts
import {
  BridgePlugin,
  type ChatInputCommandInteractionWithGuild,
  DiscordCommand,
  DiscordCommandData,
  type DiscordManagerWithPlugin
} from "hypixel-discord-chat-bridge/plugin-api";

class ExampleCommand extends DiscordCommand<DiscordManagerWithPlugin<ExamplePlugin>> {
  override readonly data = new DiscordCommandData().setName("example").setDescription("Example plugin command");

  override async execute(interaction: ChatInputCommandInteractionWithGuild): Promise<void> {
    await interaction.followUp("Hello from a plugin.");
  }
}

class ExamplePlugin extends BridgePlugin<ExamplePlugin> {
  override readonly metadata = { name: "Example Plugin", description: "Example Plugins", version: "1.0.0", author: "DuckySoLucky" } as const;

  constructor(context: BridgePluginContext) {
    super(context);
  }

  override async registerExtensions(): Promise<void> {
    this.context.registerDiscordCommand((discord) => new ExampleCommand(discord));
  }

  override async start(): Promise<void> {
    // Subscribe to events or acquire resources here.
  }

  override async stop(): Promise<void> {
    // Remove listeners and release resources here.
  }
}
```

Registration methods accept factories. The bridge supplies the correct manager when it constructs an extension, so plugins do not need access to the complete
`Application` object. Plugins can call `registerDiscordCommand`, `registerMinecraftCommand`, `registerButton`, `registerModal`, and `registerScript`. Registration is
intentionally separate from `start()` so commands are available when Discord deploys its application commands.

## Complete Showcase

`examples/showcase-plugin/` is a copy-ready, modular plugin demonstrating every supported extension behavior. Its entrypoint only coordinates lifecycle and registration;
commands, components, event subscriptions, shared IDs, and scripts live in focused modules.

- Discord slash command registration and deferred reply editing.
- A button that opens a modal without acknowledging the interaction first.
- An ephemeral modal submission response.
- A Minecraft command with aliases and invocation-local guild/officer replies.
- A disabled-by-default interval script with overlap prevention and cancellation support.
- Subscriptions to every typed bridge event.
- Idempotent plugin startup and disposer-based listener cleanup.
- Plugin-scoped logging.

The entire showcase plugin and all example extensions are disabled by default. To try it in development, copy it into the auto-loaded plugin directory:

```sh
mkdir -p plugins
cp -R examples/showcase-plugin plugins/showcase-plugin
pnpm start
```

Then set the top-level `enabled` value in `plugins/showcase-plugin/config.ts` to `true`. The scheduled showcase script has a separate `enabled` value and remains disabled
until explicitly enabled.

## Bridge Events

`BridgeEventBus` provides typed publish and subscribe operations for Discord messages, Minecraft messages, player toggles, and embeds. `on()` returns a disposer that
plugins must call from `stop()`.

```ts
private disposeMinecraftMessages?: () => void;

override async start(): Promise<void> {
  this.disposeMinecraftMessages = this.context.events.on(
    "minecraft-message",
    async (event) => {
      if (event.chatType === "Debug") return;
      console.log(event.username, event.message);
    }
  );
}

override async stop(): Promise<void> {
  this.disposeMinecraftMessages?.();
  this.disposeMinecraftMessages = undefined;
}
```

## Lifecycle Rules

- Constructors only establish valid object state; they must not connect clients, register permanent listeners, or schedule work.
- Acquire resources in `start()` and release them in `stop()`.
- Make lifecycle methods idempotent where practical.
- Await promises unless concurrency is intentional. Detached promises must use the shared async error boundary.
- Keep invocation-specific state in command context objects rather than singleton command fields.
- Use the Minecraft request broker instead of temporary `systemChat` listeners.

## Production

Build and start the compiled application with:

```sh
pnpm build
pnpm start:prod
```

Production extension discovery operates from `build/` and does not depend on source `.ts` files.

## Plugin Showcases

Got a cool plugin that could be shown off? Feel free to pull request a link to it here

Looking for plugins? One of the maintainers has an entire list of them. Check it out https://github.com/Kathund/hypixel-discord-chat-bridge-plugins/

---

If you need any help help consider checking out the [FAQ](/docs/FrequentlyAskedQuestions.md)

Feel free to reach out to the maintainers directly on Discord. [@duckysolucky](https://discord.com/users/486155512568741900) and
[@.kathund](https://discord.com/users/1276524855445164098)
