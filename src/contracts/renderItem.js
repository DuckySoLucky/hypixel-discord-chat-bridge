const Canvas = require("canvas");
Canvas.registerFont("src/contracts/Fonts/2_Minecraft-Italic.otf", {
  family: "MinecraftItalic",
});
Canvas.registerFont("src/contracts/Fonts/MinecraftRegular-Bmg3.ttf", {
  family: "Minecraft",
});
Canvas.registerFont("src/contracts/Fonts/minecraft-bold.otf", {
  family: "MinecraftBold",
});
Canvas.registerFont("src/contracts/Fonts/unifont.ttf", {
  family: "MinecraftUnicode",
});

const RGBA_COLOR = {
  0: "rgba(0,0,0,1)",
  1: "rgba(0,0,170,1)",
  2: "rgba(0,170,0,1)",
  3: "rgba(0,170,170,1)",
  4: "rgba(170,0,0,1)",
  5: "rgba(170,0,170,1)",
  6: "rgba(255,170,0,1)",
  7: "rgba(170,170,170,1)",
  8: "rgba(85,85,85,1)",
  9: "rgba(85,85,255,1)",
  a: "rgba(85,255,85,1)",
  b: "rgba(85,255,255,1)",
  c: "rgba(255,85,85,1)",
  d: "rgba(255,85,255,1)",
  e: "rgba(255,255,85,1)",
  f: "rgba(255,255,255,1)",
};

async function getCanvasWidthAndHeight(lore) {
  const canvas = Canvas.createCanvas(1, 1);
  const ctx = canvas.getContext("2d");
  ctx.font = "24px Minecraft";

  let highestWidth = 0;
  if (!lore) return;
  for (let i = 0; i < lore.length; i++) {
    const width = ctx.measureText(
      lore[i].replace(/\u00A7[0-9A-FK-OR]/gi, "")
    ).width;
    if (width > highestWidth) {
      highestWidth = width;
    }
  }

  return { height: lore.length * 24 + 15, width: highestWidth + 20 };
}

async function renderLore(itemName, lore) {
  if (itemName) lore.unshift(itemName);
  const measurements = await getCanvasWidthAndHeight(lore);
  if (!measurements) return;
  const canvas = Canvas.createCanvas(measurements.width, measurements.height);
  const ctx = canvas.getContext("2d");
  // BACKGROUND
  ctx.fillStyle = "#100110";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // FONT
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowColor = "#131313";
  ctx.font = "24px Minecraft";
  ctx.fillStyle = "#ffffff";

  // TEXT
  for (const [index, item] of Object.entries(lore)) {
    let width = 10;
    const splitItem = item.split("§");
    if (splitItem[0].length == 0) splitItem.shift();

    for (const toRenderItem of splitItem) {
      ctx.fillStyle = RGBA_COLOR[toRenderItem[0]];

      if (toRenderItem.startsWith("l"))
        ctx.font = "24px MinecraftBold, MinecraftUnicode";
      else if (toRenderItem.startsWith("o"))
        ctx.font = "24px MinecraftItalic, MinecraftUnicode";
      else ctx.font = "24px Minecraft, MinecraftUnicode";

      ctx.fillText(toRenderItem.substring(1), width, index * 24 + 29);
      width += ctx.measureText(toRenderItem.substring(1)).width;
    }
  }

  return canvas.toBuffer();
}

module.exports = { renderLore };
