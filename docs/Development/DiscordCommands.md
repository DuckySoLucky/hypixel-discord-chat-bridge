# Discord Commands

## Command Class Structure

Every discord command is based of the same template class that presets information stuff making it easier to create new things

### Command Data

Instead of using the discord.js `SlashCommandBuilder` we are using our own custom `DiscordCommandDataBuilder` as a wrapper around it. By doing this we can set custom
preset data while taking advantage of the work from the discord.js devs in making it

One of the big changes that our custom `DiscordCommandDataBuilder` makes is that it **only allows commands to be ran inside of guild** and will only register that command
via the GuildInstall method.

#### Defining Data

When creating a command you will need to define the data such as the name, description and any options you want to give the command.

This is an example of how you would create something

```ts
class ExampleCommand extends DiscordCommand {
  <!-- prettier-ignore -->
  override readonly data = new DiscordCommandDataBuilder()
    .setName("example")
    .setDescription("This is an example command")
}
```

In that example we have set the name to be `example` and the description to be `This is an example command`

##### Command Options

Adding options to a command can be done by editing the data that we set.

```ts
class ExampleCommand extends DiscordCommand {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("example")
    .setDescription("This is an example command")
    // Adding a string option for hte user
    .addStringOption((option) => option.setName("option-name").setDescription("This is an option that only takes in a string"));
}
```

There are multiple types of

**Notes about a command's data**

- All commands are required to have a name and a description
- Names are required to be pass the following tests:
  - Be longer then 1 character in length
  - Cannot be longer then 32 characters in length
  - Must not include capital letters
  - Must not include spaces
  - Must not include special characters. Only exception is `-` and `_`
- Descriptions are required to pass the following tests:
  - Be longer then 1 character in length
  - Cannot be longer then 100 characters in length
- All options are required to pass the following tests:
  - Must have a name. This name also needs to pass the name requirements above
  - Must have a description. This description also needs to pass the name requirements above
  - Max of 25 options

## Creating a command

- **Base class:** Extend `DiscordCommand` and implement `async execute(interaction)`.
- **Command metadata:** Provide a `data` property using `DiscordCommandData` (a thin wrapper around Discord's `SlashCommandBuilder`) to set name, description and options.
- **Autocomplete:** Implement `autocomplete(interaction)` if your command uses autocomplete. The base class provides helpers like `respondToAutocomplete`.
- **Response type:** Commands can influence deferred replies via the `response` property (see `BasicInteractionResponse`). The `CommandHandler` will call `deferReply`
  automatically when appropriate.

**Creating a Command (example)**

- Create a file under [src/discord/commands](src/discord/commands) that looks like this:

- **Example:** see the `uptime` command at [src/discord/commands/uptimeCommand.ts](src/discord/commands/uptimeCommand.ts#L1-L17).

  - **Pattern:**
    - Export a class that extends `DiscordCommand`.
    - Set `readonly data = new DiscordCommandData().setName("...").setDescription("...")`.
    - Implement `async execute(interaction)` and use `interaction.reply` / `interaction.followUp`.

**Registration & Loading**

- Files placed in [src/discord/commands](src/discord/commands) are discovered by the extension loader and registered by `CommandHandler.loadCommands()`.
- Commands are converted using `command.data.toJSON()` and sent to Discord via the REST API in `deployRegisteredCommands()`.
- Plugins can register commands programmatically via the plugin API; see `PluginManager` and `BridgePlugin` which call `registerDiscordCommand`.

**Permissions & Error Handling**

- The `CommandHandler` calls `interactionHandler.checkPerms` before executing a command; implement permission checks on the command if needed.
- Errors thrown from `execute` are routed through the bot's `handleError` logic so users receive a consistent error response.

**Quick Checklist for New Commands**

- **File location:** [src/discord/commands](src/discord/commands)
- **Extend:** `DiscordCommand`
- **Define metadata:** `DiscordCommandData` with name + description
- **Implement:** `async execute(interaction)`
- **Optional:** `autocomplete(interaction)` for dynamic option suggestions
- **Test:** Run `deployCommands()` or restart the bot to reload commands

---

If you need any help help consider checking out the [FAQ](/docs/FrequentlyAskedQuestions.md)

Feel free to reach out to the maintainers directly on Discord. [@duckysolucky](https://discord.com/users/486155512568741900) and
[@.kathund](https://discord.com/users/1276524855445164098)
