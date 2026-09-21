import { type CanvasRenderingContext2D, createCanvas, loadImage, registerFont } from "canvas";
import { MinecraftChatCodes } from "../../private/constants.js";
import type { ConfigMinecraftFontRenderer } from "../../types/config.js";

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
  constructor(protected readonly options: ConfigMinecraftFontRenderer) {}

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
    ctx.font = `${this.options.fontSize}px ${state.isItalic ? "MinecraftItalic" : "Minecraft"}`;
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
            if (username !== null && token.startsWith(this.options.skinToken, i)) {
              wordWidth += this.options.skinWidth;
              i += this.options.skinToken.length - 1;
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
              wordWidth += this.options.shadowOffset;
            }
          }

          if ((wordStartIsStruckThrough || wordStartIsUnderlined) && lineWidth === 0) {
            wordWidth += this.options.shadowOffset;
          }

          if (lineWidth > 0 && lineWidth + pendingWhitespaceWidth + wordWidth > this.options.maxLineWidth) {
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
    const skin = username !== null && text.includes(this.options.skinToken) ? await loadImage(`https://nmsr.nickac.dev/face/${username}`) : null;
    let cursorY = this.options.fontSize - this.options.shadowOffset;

    text.split(MinecraftRenderer.NEWLINE_REGEX).forEach((line) => {
      const state = this.createFormattingState();
      let cursorX = 0;
      this.setFont(ctx, state);

      for (let i = 0; i < line.length; i++) {
        const char = line[i] as string;
        if (skin !== null && line.startsWith(this.options.skinToken, i)) {
          ctx.save();
          ctx.shadowOffsetX = this.options.shadowOffset;
          ctx.shadowOffsetY = this.options.shadowOffset;
          ctx.shadowColor = "#131313";
          ctx.drawImage(skin, cursorX, cursorY - this.options.fontSize + this.options.shadowOffset, this.options.skinWidth, this.options.skinWidth);
          ctx.restore();
          cursorX += this.options.skinWidth;
          i += this.options.skinToken.length - 1;
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
            cursorX += this.options.shadowOffset;
          }

          const shadowX = cursorX + this.options.shadowOffset;
          const shadowY = cursorY + this.options.shadowOffset;
          ctx.fillStyle = "#131313";

          // Draw strikethrough shadow
          if (state.isStruckThrough) {
            ctx.fillRect(cursorX, cursorY - 3 * this.options.shadowOffset, width + this.options.shadowOffset, this.options.shadowOffset);
          }

          // Draw underline shadow
          if (state.isStruckThrough) {
            ctx.fillRect(cursorX, cursorY + 2 * this.options.shadowOffset, width + this.options.shadowOffset, this.options.shadowOffset);
          }

          // Draw text shadow
          ctx.fillText(char, shadowX, shadowY);
          if (state.isBold) ctx.fillText(char, shadowX + this.options.shadowOffset, shadowY);

          // Draw text
          ctx.fillStyle = state.color;
          ctx.fillText(char, cursorX, cursorY);
          if (state.isBold) ctx.fillText(char, cursorX + this.options.shadowOffset, cursorY);

          // Add extra spacing if character is bold
          if (state.isBold) width += this.options.shadowOffset;

          // Draw strikethrough
          if (state.isStruckThrough) {
            ctx.fillRect(cursorX - this.options.shadowOffset, cursorY - 4 * this.options.shadowOffset, width + this.options.shadowOffset, this.options.shadowOffset);
          }

          // Draw underline
          if (state.isUnderlined) {
            ctx.fillRect(cursorX - this.options.shadowOffset, cursorY + this.options.shadowOffset, width + this.options.shadowOffset, this.options.shadowOffset);
          }

          cursorX += width;
        }
      }

      // Move the cursor down to the next line. Add double-spacing to account for shadow
      cursorY += this.options.fontSize;
    });
  }

  private setCanvasDimensions(text: string, ctx: CanvasRenderingContext2D) {
    const lines = text.split(MinecraftRenderer.NEWLINE_REGEX);
    let widestLineWidth = 0;

    // TODO: reuse the results from the bold and italic substring search in renderTextModern() - draw text in chunks, not char by char
    lines.forEach((line) => {
      // Find the width of the line if no characters are bold or italic
      ctx.font = `${this.options.fontSize}px Minecraft`;
      let width = ctx.measureText(line.replaceAll(MinecraftRenderer.SUPPORTED_FORMAT_CODES, "")).width;

      // Add the extra width for bold substrings
      line.match(/§l(.*?)(?:§r|$)/gm)?.forEach((subStr) => {
        const modifiersRemoved = subStr.replaceAll(MinecraftRenderer.SUPPORTED_FORMAT_CODES, "");
        width += modifiersRemoved.length * this.options.shadowOffset;
      });

      // Add extra width for a starting strikethrough/underline
      if (line.match(/^§(?:n|m)/m)) width += this.options.shadowOffset;

      // Add extra width for an ending strikethrough/underline or italic (italic font has no right bearing)
      if (line.match(/§(?:n|m|o)(?:(?!§r).)*$/m)) width += this.options.shadowOffset;

      // Add the extra width for italic substrings
      [...line.matchAll(/§o(.*?)(?:§r|$)/gm)]?.forEach((match) => {
        const group = match[1]!;

        ctx.font = `${this.options.fontSize}px Minecraft`;
        const normal = ctx.measureText(group.replaceAll(MinecraftRenderer.SUPPORTED_FORMAT_CODES, "")).width;

        ctx.font = `${this.options.fontSize}px MinecraftItalic`;
        const italic = ctx.measureText(group.replaceAll(MinecraftRenderer.SUPPORTED_FORMAT_CODES, "")).width;

        // Add the difference between the normal width and italic width
        width += italic - normal;
      });

      // If this is the widest line, set the overall width accordingly
      if (widestLineWidth < width) widestLineWidth = width;
    });

    // Extra height for underline shadow on the bottom line
    const underlineExtraheight = lines[lines.length - 1]?.includes(MinecraftChatCodes.UNDERLINE.code) ? this.options.shadowOffset : 0;

    // Add the shadow size to the height so it isn't cut off
    const height = this.options.fontSize * lines.length + this.options.shadowOffset + underlineExtraheight;

    ctx.canvas.width = widestLineWidth;
    ctx.canvas.height = height;
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
        ctx.drawImage(await loadImage(`https://nmsr.nickac.dev/face/${username}`), width, height - 35, 35, 35);
        width += 55;
        continue;
      }

      if (colorCode) ctx.fillStyle = colorCode;
      ctx.fillText(currentMessage, width, height);
      width += ctx.measureText(currentMessage).width;
    }
    return canvas.toBuffer();
  }

  async renderText(text: string, username: string | null = null, target: ConfigMinecraftFontRenderer["target"] = this.options.target): Promise<Buffer<ArrayBufferLike>> {
    if (target === "legecy") return await this.renderLegecy(text, username);
    return await this.renderModern(text, username);
  }
}

export default MinecraftRenderer;
