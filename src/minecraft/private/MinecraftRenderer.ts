/*
 * @author jejebecarte <https://github.com/jejebecarte>
 * @license MIT <https://github.com/jejebecarte/minecraft-text-canvas/blob/ccbaf6f303d7b1d8f06379fba26c4489521a6056/LICENSE>
 * @see https://github.com/jejebecarte/minecraft-text-canvas/tree/ccbaf6f303d7b1d8f06379fba26c4489521a6056
 * Modified
 */

import { type CanvasRenderingContext2D, Image, createCanvas, loadImage, registerFont } from "canvas";
import { MinecraftChatCodes } from "../../private/constants.js";
import type MinecraftManager from "../MinecraftManager.ts";
import type { ConfigMinecraftFontRenderer } from "../../types/config.ts";

registerFont("src/private/fonts/2_Minecraft-Italic.otf", { family: "MinecraftItalic" });
registerFont("src/private/fonts/MinecraftRegular-Bmg3.ttf", { family: "Minecraft" });
registerFont("src/private/fonts/minecraft-bold.otf", { family: "MinecraftBold" });
registerFont("src/private/fonts/unifont.ttf", { family: "MinecraftUnicode" });

interface FormattingState {
  activeCodes: string;
  color: string;
  isBold: boolean;
  isStruckThrough: boolean;
  isUnderlined: boolean;
  isItalic: boolean;
}

class MinecraftRenderer {
  private static readonly SUPPORTED_FORMAT_CODES = /§(?:0|1|2|3|4|5|6|7|8|9|a|b|c|d|e|f|l|m|n|o|r)/g;
  private static readonly NEWLINE_REGEX = /$/gm;
  constructor(protected readonly minecraft: MinecraftManager) {}

  async getSkinHeadImage(username: string): Promise<Image> {
    const cached = this.minecraft.application.cache.get<Buffer>(`minecraft:skin:${username}`);
    if (cached) return loadImage(cached);

    const response = await this.minecraft.application.request<any>(`${this.minecraft.application.config.API.nmsr.baseURL}/face/${username}`, {
      responseType: "arraybuffer"
    });
    const buffer = Buffer.from(response.data);
    this.minecraft.application.cache.set(`minecraft:skin:${username}`, buffer);
    return loadImage(buffer);
  }

  private createFormattingState(): FormattingState {
    return { activeCodes: "", color: MinecraftChatCodes.WHITE.color, isBold: false, isStruckThrough: false, isUnderlined: false, isItalic: false };
  }

  private getFormatCode(text: string, index: number) {
    const nextChar = text[index + 1];
    return nextChar && text[index] === "§" && `§${nextChar}`.match(MinecraftRenderer.SUPPORTED_FORMAT_CODES)?.[0];
  }

  private applyFormatCode(state: FormattingState, code: string) {
    const codeChar = code[1];
    if (!codeChar) return;

    if (codeChar === MinecraftChatCodes.RESET.character) {
      Object.assign(state, { activeCodes: "", color: MinecraftChatCodes.WHITE.color, isBold: false, isStruckThrough: false, isUnderlined: false, isItalic: false });
    } else if ("0123456789abcdef".includes(codeChar)) {
      state.activeCodes = code;
      const color = Object.values(MinecraftChatCodes).find((entry) => "color" in entry && entry.character === codeChar);
      if (color && "color" in color) {
        state.color = color.color;
      }
    } else {
      state.activeCodes += code;
      state.isBold ||= codeChar === MinecraftChatCodes.BOLD.character;
      state.isStruckThrough ||= codeChar === MinecraftChatCodes.STRIKETHROUGH.character;
      state.isUnderlined ||= codeChar === MinecraftChatCodes.UNDERLINE.character;
      state.isItalic ||= codeChar === MinecraftChatCodes.ITALIC.character;
    }
  }

  private setFont(ctx: CanvasRenderingContext2D, state: FormattingState) {
    ctx.font = `${this.minecraft.application.config.minecraft.fontRenderer.fontSize}px ${state.isItalic ? "MinecraftItalic" : "Minecraft"}`;
  }

  private wrapText(text: string, ctx: CanvasRenderingContext2D, username: string | null) {
    return text
      .split(MinecraftRenderer.NEWLINE_REGEX)
      .map((line) => {
        let wrappedLine = "";
        let lineWidth = 0;
        const state = this.createFormattingState();

        let pendingWhitespace = "";
        let pendingWhitespaceWidth = 0;

        for (const token of line.match(/\s+|\S+/g) ?? []) {
          if (/^\s+$/.test(token)) {
            this.setFont(ctx, state);
            pendingWhitespace = token;
            pendingWhitespaceWidth = ctx.measureText(token).width;
            continue;
          }

          const wordStartCodes = state.activeCodes;
          const wordStartIsStruckThrough = state.isStruckThrough;
          const wordStartIsUnderlined = state.isUnderlined;
          let wordWidth = 0;

          for (let i = 0; i < token.length; i++) {
            const char = token[i] as string;
            if (username !== null && token.startsWith(this.minecraft.application.config.minecraft.fontRenderer.skinToken, i)) {
              wordWidth += this.minecraft.application.config.minecraft.fontRenderer.skinWidth;
              i += this.minecraft.application.config.minecraft.fontRenderer.skinToken.length - 1;
              continue;
            }

            const formatCode = this.getFormatCode(token, i);
            if (formatCode) {
              this.applyFormatCode(state, formatCode);
              i += 1;
              continue;
            }

            this.setFont(ctx, state);
            wordWidth += ctx.measureText(char).width;
            if (state.isBold) {
              wordWidth += this.minecraft.application.config.minecraft.fontRenderer.shadowOffset;
            }
          }

          if ((wordStartIsStruckThrough || wordStartIsUnderlined) && lineWidth === 0) {
            wordWidth += this.minecraft.application.config.minecraft.fontRenderer.shadowOffset;
          }

          if (lineWidth > 0 && lineWidth + pendingWhitespaceWidth + wordWidth > this.minecraft.application.config.minecraft.fontRenderer.maxLineWidth) {
            wrappedLine += `\n${wordStartCodes}`;
            lineWidth = 0;
            pendingWhitespace = "";
            pendingWhitespaceWidth = 0;
          }

          wrappedLine += pendingWhitespace + token;
          lineWidth += pendingWhitespaceWidth + wordWidth;
          pendingWhitespace = "";
          pendingWhitespaceWidth = 0;
        }

        wrappedLine += pendingWhitespace;

        return wrappedLine;
      })
      .join("\n");
  }

  private async renderTextModern(text: string, ctx: CanvasRenderingContext2D, username: string | null) {
    const skin = username !== null && text.includes(this.minecraft.application.config.minecraft.fontRenderer.skinToken) ? await this.getSkinHeadImage(username) : null;
    let cursorY =
      this.minecraft.application.config.minecraft.fontRenderer.yPadding +
      this.minecraft.application.config.minecraft.fontRenderer.fontSize -
      this.minecraft.application.config.minecraft.fontRenderer.shadowOffset;

    text.split(MinecraftRenderer.NEWLINE_REGEX).forEach((line) => {
      const state = this.createFormattingState();
      let cursorX = this.minecraft.application.config.minecraft.fontRenderer.xPadding;
      this.setFont(ctx, state);

      for (let i = 0; i < line.length; i++) {
        const char = line[i] as string;
        if (skin !== null && line.startsWith(this.minecraft.application.config.minecraft.fontRenderer.skinToken, i)) {
          ctx.save();
          ctx.shadowOffsetX = this.minecraft.application.config.minecraft.fontRenderer.shadowOffset;
          ctx.shadowOffsetY = this.minecraft.application.config.minecraft.fontRenderer.shadowOffset;
          ctx.shadowColor = "#131313";
          ctx.drawImage(
            skin,
            cursorX,
            cursorY - this.minecraft.application.config.minecraft.fontRenderer.fontSize + this.minecraft.application.config.minecraft.fontRenderer.shadowOffset,
            this.minecraft.application.config.minecraft.fontRenderer.skinWidth,
            this.minecraft.application.config.minecraft.fontRenderer.skinWidth
          );
          ctx.restore();
          cursorX += this.minecraft.application.config.minecraft.fontRenderer.skinWidth;
          i += this.minecraft.application.config.minecraft.fontRenderer.skinToken.length - 1;
          continue;
        }

        const formatCode = this.getFormatCode(line, i);
        if (formatCode) {
          this.applyFormatCode(state, formatCode);
          this.setFont(ctx, state);
          i += 1;
        } else {
          let { width } = ctx.measureText(char);

          // Add space for first char with strikethrough/underline
          if ((state.isStruckThrough || state.isUnderlined) && cursorX === 0) {
            cursorX += this.minecraft.application.config.minecraft.fontRenderer.shadowOffset;
          }

          const shadowX = cursorX + this.minecraft.application.config.minecraft.fontRenderer.shadowOffset;
          const shadowY = cursorY + this.minecraft.application.config.minecraft.fontRenderer.shadowOffset;
          ctx.fillStyle = "#131313";

          // Draw strikethrough shadow
          if (state.isStruckThrough) {
            ctx.fillRect(
              cursorX,
              cursorY - 3 * this.minecraft.application.config.minecraft.fontRenderer.shadowOffset,
              width + this.minecraft.application.config.minecraft.fontRenderer.shadowOffset,
              this.minecraft.application.config.minecraft.fontRenderer.shadowOffset
            );
          }

          // Draw underline shadow
          if (state.isStruckThrough) {
            ctx.fillRect(
              cursorX,
              cursorY + 2 * this.minecraft.application.config.minecraft.fontRenderer.shadowOffset,
              width + this.minecraft.application.config.minecraft.fontRenderer.shadowOffset,
              this.minecraft.application.config.minecraft.fontRenderer.shadowOffset
            );
          }

          // Draw text shadow
          ctx.fillText(char, shadowX, shadowY);
          if (state.isBold) ctx.fillText(char, shadowX + this.minecraft.application.config.minecraft.fontRenderer.shadowOffset, shadowY);

          // Draw text
          ctx.fillStyle = state.color;
          ctx.fillText(char, cursorX, cursorY);
          if (state.isBold) ctx.fillText(char, cursorX + this.minecraft.application.config.minecraft.fontRenderer.shadowOffset, cursorY);

          // Add extra spacing if character is bold
          if (state.isBold) width += this.minecraft.application.config.minecraft.fontRenderer.shadowOffset;

          // Draw strikethrough
          if (state.isStruckThrough) {
            ctx.fillRect(
              cursorX - this.minecraft.application.config.minecraft.fontRenderer.shadowOffset,
              cursorY - 4 * this.minecraft.application.config.minecraft.fontRenderer.shadowOffset,
              width + this.minecraft.application.config.minecraft.fontRenderer.shadowOffset,
              this.minecraft.application.config.minecraft.fontRenderer.shadowOffset
            );
          }

          // Draw underline
          if (state.isUnderlined) {
            ctx.fillRect(
              cursorX - this.minecraft.application.config.minecraft.fontRenderer.shadowOffset,
              cursorY + this.minecraft.application.config.minecraft.fontRenderer.shadowOffset,
              width + this.minecraft.application.config.minecraft.fontRenderer.shadowOffset,
              this.minecraft.application.config.minecraft.fontRenderer.shadowOffset
            );
          }

          cursorX += width;
        }
      }

      // Move the cursor down to the next line. Add double-spacing to account for shadow
      cursorY += this.minecraft.application.config.minecraft.fontRenderer.fontSize;
    });
  }

  private setCanvasDimensions(text: string, ctx: CanvasRenderingContext2D) {
    const lines = text.split(MinecraftRenderer.NEWLINE_REGEX);

    // Extra height for underline shadow on the bottom line
    const underlineExtraheight = lines[lines.length - 1]?.includes(MinecraftChatCodes.UNDERLINE.code)
      ? this.minecraft.application.config.minecraft.fontRenderer.shadowOffset
      : 0;

    // Add the shadow size to the height so it isn't cut off
    const height =
      this.minecraft.application.config.minecraft.fontRenderer.fontSize * lines.length +
      this.minecraft.application.config.minecraft.fontRenderer.shadowOffset +
      underlineExtraheight;

    ctx.canvas.width = this.minecraft.application.config.minecraft.fontRenderer.maxLineWidth + 2 * this.minecraft.application.config.minecraft.fontRenderer.xPadding;
    ctx.canvas.height = height + 2 * this.minecraft.application.config.minecraft.fontRenderer.yPadding;
  }

  private async renderModern(text: string, username: string | null = null): Promise<Buffer<ArrayBufferLike>> {
    const canvas = createCanvas(0, 0);
    const ctx = canvas.getContext("2d");
    const wrappedText = this.wrapText(text, ctx, username);

    this.setCanvasDimensions(wrappedText, ctx);
    await this.renderTextModern(wrappedText, ctx, username);

    return canvas.toBuffer();
  }

  private RGBA_COLOR: Record<string | number, string> = {
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
    f: "rgba(255,255,255,1)"
  };

  private getHeight(message: string) {
    const canvas = createCanvas(1, 1);
    const ctx = canvas.getContext("2d");
    const splitMessageSpace = message.split(" ");
    for (const [i, msg] of Object.entries(splitMessageSpace)) {
      if (!msg.startsWith("§")) splitMessageSpace[Number(i)] = `§r${msg}`;
    }
    const splitMessage = splitMessageSpace.join(" ").split(/§|\n/g);
    splitMessage.shift();
    ctx.font = "40px Minecraft, MinecraftUnicode";

    let width = 5;
    let height = 35;

    for (const msg of splitMessage) {
      const currentMessage = msg.substring(1);
      if (width + ctx.measureText(currentMessage).width > 1000 || msg.charAt(0) === "n") {
        width = 5;
        height += 40;
      }
      width += ctx.measureText(currentMessage).width;
    }
    if (width === 5) height -= 40;

    return height + 10;
  }

  private async renderLegecy(message: string, username: string | null = null) {
    const canvasHeight = this.getHeight(message);
    const canvas = createCanvas(1000, canvasHeight);
    const ctx = canvas.getContext("2d");
    const splitMessageSpace = message.split(" ");
    for (const [i, msg] of Object.entries(splitMessageSpace)) {
      if (!msg.startsWith("§")) splitMessageSpace[Number(i)] = `§r${msg}`;
    }
    const splitMessage = splitMessageSpace.join(" ").split(/§|\n/g);
    splitMessage.shift();
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.shadowColor = "#131313";
    ctx.font = "40px Minecraft, MinecraftUnicode";

    let width = 5;
    let height = 35;
    for (const msg of splitMessage) {
      const colorCode = this.RGBA_COLOR[msg.charAt(0)];
      const currentMessage = msg.substring(1);
      if (width + ctx.measureText(currentMessage).width > 1000 || msg.charAt(0) === "n") {
        width = 5;
        height += 40;
      }

      // Credits to https://github.com/Pixelicc for an idea and code
      if (username !== null && currentMessage.trim() === "{skin}") {
        ctx.drawImage(await this.getSkinHeadImage(username), width, height - 35, 35, 35);
        width += 55;
        continue;
      }

      if (colorCode) ctx.fillStyle = colorCode;
      ctx.fillText(currentMessage, width, height);
      width += ctx.measureText(currentMessage).width;
    }
    return canvas.toBuffer();
  }

  async renderText(
    text: string,
    username: string | null = null,
    target: ConfigMinecraftFontRenderer["target"] = this.minecraft.application.config.minecraft.fontRenderer.target
  ): Promise<Buffer<ArrayBufferLike>> {
    if (target === "legecy") return await this.renderLegecy(text, username);
    return await this.renderModern(text, username);
  }
}

export default MinecraftRenderer;
