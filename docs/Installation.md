# Installation Guide

## Manual Setup

### Prerequisites

- [Git](https://git-scm.com/install)
- [Node.js](https://nodejs.org/en/download) >= v22.22.3
- [pnpm](https://pnpm.io/installation) >= v11.0.0
- [A Minecraft account](https://minecraft.net)

### Installation Steps

1. Clone the repository:

```bash
  git clone https://github.com/DuckySoLucky/hypixel-discord-chat-bridge.git
  cd hypixel-discord-chat-bridge
```

2. Install dependencies:

```bash
  pnpm install --frozen-lockfile
```

3. Create your configuration:

To create a config there are two main ways

Use the config generator script:

```bash
  pnpm generate:config
```

or manually set everything

- Copy `config.example.json` to `config.json`
- Edit `config.json` with your settings (see [Configuration](Configuration.md) for help)

4. Start the bot:

```bash
  pnpm start
```

To sign into a minecraft account please see the [FAQ](./FAQ.md#how-do-i-add-a-minecraft-account) questio we have on it

---

## Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) >= 20
  - Older versions may also work, but have not been tested.
- [A Minecraft account](https://minecraft.net)

1. Clone the repository:

```bash
  git clone https://github.com/DuckySoLucky/hypixel-discord-chat-bridge.git
  cd hypixel-discord-chat-bridge
```

2. Create your configuration:

To create a config there are two main ways

Use the config generator script:

```bash
  pnpm generate:config
```

or manually set everything

- Copy `config.example.json` to `config.json`
- Edit `config.json` with your settings (see [Configuration](Configuration.md) for help)

3. Run the container:

```bash
  docker container run -it --rm -v ./config.json:/app/config.json ghcr.io/DuckySoLucky/hypixel-discord-chat-bridge:latest
```

Note that the path of the configuration source file must either be relative (with the `./`) or absolute.

4. Stop and remove the container when needed:

```bash
  docker stop hypixel-discord-chat-bridge
  docker rm hypixel-discord-chat-bridge
```

5. Start it again:

```bash
  docker start hypixel-discord-chat-bridge
```

To sign into a Minecraft account please see the [FAQ](./FAQ.md#how-do-i-add-a-minecraft-account) question.

---

If you need any help help consider checking out the [FAQ](FAQ.md)

Feel free to reach out to the maintainers directly on Discord. [@duckysolucky](https://discord.com/users/486155512568741900) and
[@.kathund](https://discord.com/users/1276524855445164098)
