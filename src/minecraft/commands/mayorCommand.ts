import HypixelAPIReborn from "../../private/HypixelAPIReborn.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import { delay } from "../../utils/miscUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class MayorCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData().setName("mayor").setDescription("Skyblock Mayor.");
  }

  override async execute(player: string, message: string) {
    const data = await HypixelAPIReborn.getSkyBlockElection().then((data) => {
      if (data.isRaw()) throw new HypixelDiscordChatBridgeError("Failed to fetch the SkyBlock Election data.");
      return data;
    });

    const mayor = data.lastElectionResults.candidates[0];
    const minister = data.lastElectionResults.candidates[1];

    if (!mayor || !minister) throw new HypixelDiscordChatBridgeError("Failed to fetch the SkyBlock Election data.");

    this.send(
      `[MAYOR] ${mayor.name} is the current mayor of Skyblock! Perks: ${mayor.perks
        .map((perk) => perk.name)
        .join(", ")}, Minister Perk: ${minister.perks[0]?.name ?? "Unknown"}`
        .replaceAll("ez", "e-z")
        .replaceAll("EZ", "E-Z")
    );

    if (data.currentElection === null) return;
    await delay(1000);
    const currentLeader = data.currentElection.candidates[0];
    if (!currentLeader) return this.send("[MAYOR] No current leader.");
    const totalVotes = data.currentElection.candidates.reduce((total, candidate) => total + candidate.votesReceived, 0);
    const percentage = ((currentLeader.votesReceived || 0) / totalVotes) * 100;
    this.send(`[MAYOR] Current Election: ${currentLeader.name} has ${percentage.toFixed(2)}% of the votes.`);
  }
}

export default MayorCommand;
