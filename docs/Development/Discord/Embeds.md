# Discord Embeds

## EmbedHelper vs EmbedBuilder

Instead of using the native discord.js `EmbedBuilder` we are using our own custom `EmbedHelper` class as a wrapper around it. This allows for custom methods and provide
embeds with a custom template

One of the big changes is that we make it so every embed has a dev credits footer. While you can remove this if you want it is heavly discouraged

You can disable the dev footers by setting `other.hideDevFooters` to `true` inside of your config file

## Creating Embeds

Since discord.js itself already has a pretty good guide on embeds and we aren't changing much about them please consider checking out their guide.
[Linked here](https://discordjs.guide/legacy/popular-topics/embeds#embed-preview)

## Embed Styles

Embed styles are basically templates that embeds can use to preset stuff. There are currently 4 embed styles and they can be seen all through the bot

1. Generic Embed Template

- This is the default/generic embed style. All embeds should be based start from this style. It sets the color to blue, sets the timestamp to the current time sets the
  footer to the DuckySoLucky dev footer

2. Warning Embed Style

- When ever warnings are meant to be sent back this is the template that gets used. It sets the color to yellow and it sets the author name to `An Warning has occurred`.
  It also extends the Generic Template

3. Error Embed Template

- When ever an error is meant to be sent back this is the template that gets used. It sets the color to red and it sets the author name to `An Error has occurred`. It
  also extends the Generic Template

---

If you need any help help consider checking out the [FAQ](/docs/FrequentlyAskedQuestions.md)

Feel free to reach out to the maintainers directly on Discord. [@duckysolucky](https://discord.com/users/486155512568741900) and
[@.kathund](https://discord.com/users/1276524855445164098)
