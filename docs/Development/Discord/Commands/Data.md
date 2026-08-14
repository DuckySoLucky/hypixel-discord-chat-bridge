# Discord Command Data

This guide will be explaining how we set the metadata for commands and will also explain options

Instead of using the discord.js `SlashCommandBuilder` we are using our own custom `DiscordCommandDataBuilder` as a wrapper around it. By doing this we can set custom
preset data while taking advantage of the work from the discord.js devs in making it

One of the big changes that our custom `DiscordCommandDataBuilder` makes is that it **only allows commands to be ran inside of guild** and will only register that command
via the GuildInstall method.

## Defining Data

When creating a command you will need to define the data such as the name, description and any options you want to give the command.

This is an example of how you would create something

<!-- prettier-ignore -->
```ts
class ExampleCommand extends DiscordCommand {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("example")
    .setDescription("This is an example command")
}
```

In that example we have set the name to be `example` and the description to be `This is an example command`

### Options

#### Defining Options

Adding options to a command can be done by editing the data that we set.

<!-- prettier-ignore -->
```ts
class ExampleCommand extends DiscordCommand {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("example")
    .setDescription("This is an example command")
    // Adding a string option for the user to input text
    .addStringOption((option) =>
      option
        .setName("required-option-name")
        .setDescription("This is an option that only takes in a string and is required to be filled out")
        .setRequired(true)
    )
    // Adding a second optional string option for the user to input text if they want
    .addStringOption((option) =>
      option
        .setName("option-name")
        .setDescription("This is an option that only takes in a string")
    );
}
```

There are multiple types of. Consider checking out the discord.js guide on them for more information.
[Linked here](https://discordjs.guide/legacy/slash-commands/advanced-creation#adding-options)

#### Reading Options

Inside of our execute method we can retrieve the option that we created from before from the `CommandInteractionOptionResolver` (`interaction.options`). Since we declared
a string option we need to call the `getString` option and input the name of the option from before

```ts
class ExampleCommand extends DiscordCommand {
  override async execute(interaction: ChatInputCommandInteractionWithGuild): Promise<void> {
    const stringOption = interaction.options.getString("option-name");
    await interaction.followUp(`Received \`${stringOption}\` from the command options`);
  }
}
```

By default options are return like this `THERE_TYPE | undefined`. Since the option we fetched was a string option it will be typed out like this `string | undefined`

If we wanted to fetch an required option (like `required-option-name`) we can do the exact same setup as before but mark it as required when we call the method

```ts
class ExampleCommand extends DiscordCommand {
  override async execute(interaction: ChatInputCommandInteractionWithGuild): Promise<void> {
    // Setting true is us marking that this option is required
    const requiredStringOption = interaction.options.getString("required-option-name", true);
    await interaction.followUp(`Received \`${requiredStringOption}\` from the command options`);
  }
}
```

Since required is set to `true` it will return the type `string`

## Extra notes

Below are some things that you should consider when defining the metadata of a command

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

---

If you need any help help consider checking out the [FAQ](/docs/FrequentlyAskedQuestions.md)

Feel free to reach out to the maintainers directly on Discord. [@duckysolucky](https://discord.com/users/486155512568741900) and
[@.kathund](https://discord.com/users/1276524855445164098)
