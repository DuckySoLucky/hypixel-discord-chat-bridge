const minecraftProtocol = require("minecraft-protocol");
const config = require("../../../config.json");

if (config.minecraft.hypixelUpdates.enabled === true && config.minecraft.hypixelUpdates.alphaPlayerCountTracker === true) {
  setInterval(checkAlphaPlayerCount, 15 * 60000); // 15 minute
  checkAlphaPlayerCount();
}

let lastPlayerCount = 0;
let lastMessageTime = 0;
const MESSAGE_COOLDOWN = 60 * 60 * 1000; // 1 hour

async function checkAlphaPlayerCount() {
  try {
    const response = await minecraftProtocol.ping({
      host: "alpha.hypixel.net",
      port: 25565,
      version: "1.8.9"
    });

    if (response && response.players) {
      const currentPlayerCount = response.players.online;
      const currentTime = Date.now();

      if (currentPlayerCount > 10 && lastPlayerCount <= 10 && currentTime - lastMessageTime >= MESSAGE_COOLDOWN) {
        bot.chat(`/gc [ALPHA] Alpha Hypixel is open, current player count: ${currentPlayerCount}`);
        lastMessageTime = currentTime;
      }

      lastPlayerCount = currentPlayerCount;
    }
  } catch (error) {
    console.error("Error checking Alpha Hypixel player count:", error);
  }
}
