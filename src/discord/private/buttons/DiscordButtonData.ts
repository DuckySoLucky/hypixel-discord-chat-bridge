class DiscordButtonData {
  ids: string[] = [];
  constructor(id: string | string[]) {
    if (Array.isArray(id)) this.ids = id;
    else this.ids.push(id);
  }
}

export default DiscordButtonData;
