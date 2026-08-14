# Discord Command Structure

This guide will explain definding the metadata of a discord command and explain how options work

We use our own custom abstract `DiscordCommand` class system that allows us to have preset options/data that can be read inside of the CommandHandler. This involves stuff
like Command Permissions, Command Flags and Command Responses

## Defining a Command

When creating a command you will want to extend the `DiscordCommand` class and create your own class. From here you can set your command data (see
[Discord Command Data Guide](/docs/Development/Discord/Commands/Structure.md) for more information)

This is an example of how you would create something from the basic template

<!-- prettier-ignore -->
```ts
class ExampleCommand extends DiscordCommand {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("example")
    .setDescription("This is an example command")

  override async execute(interaction: ChatInputCommandInteractionWithGuild): Promise<void> {
    await interaction.followUp("Hello from a discord command!");
  }
}
```

### Permissions

Commands can have permissions set on them. These permissions will always be checked before reaching your execute method so you don't need to worry about it. By default
commands will allow anyone to use it unless you override that and set it

Permissions can be set by overriding the permission

<!-- prettier-ignore -->
```ts
class ExampleCommand extends DiscordCommand {
  override readonly permission: CommandPermission = CommandPermission.Admin;
}
```

List of Permissions:

| Name         | Internal Name | Description                                                                                                             |
| ------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Admin        | Admin         | Your admin team. This is the person (/team) that owns the bot. It also includes the people you have added in the config |
| Staff        | Staff         | Your staff team. Members who have the config role decalred in your config                                               |
| Guild Member | GuildMember   | Your guild members. Members who are inside of the guild and verified                                                    |
| Verified     | Linked        | Verified Users. Members who have been verified and been given the verified role                                         |
| Anyone       | Anyone        | Kinda in the title. Any user                                                                                            |

Permissions will fall down. This means any Admin will also be able to use any staff command and anything down

---

If you need any help help consider checking out the [FAQ](/docs/FrequentlyAskedQuestions.md)

Feel free to reach out to the maintainers directly on Discord. [@duckysolucky](https://discord.com/users/486155512568741900) and
[@.kathund](https://discord.com/users/1276524855445164098)
