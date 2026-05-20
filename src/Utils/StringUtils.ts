export function TitleCase(string: string): string {
  if (!string) return "";
  return string
    .toLowerCase()
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function TitleCaseCamel(str: string): string {
  if (!str || typeof str !== "string") return "";

  const withUnderscores = str.replace(/([a-z])([A-Z])/g, "$1_$2");

  return TitleCase(withUnderscores);
}

export function CleanMessageForDiscord(string: string): string {
  if (!string) return "";
  return string.replaceAll("_", "\\_").replaceAll("*", "\\*").replaceAll("~", "\\~").replaceAll(">", "\\>").replaceAll("`", "\\`").replaceAll("|", "\\|");
}

export function ReplaceVariables(template: string, variables: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (match, name) => variables[name] ?? match);
}

export function SplitMessage(message: string, amount: number): string[] {
  const messages = [];
  for (let i = 0; i < message.length; i += amount) {
    messages.push(message.slice(i, i + amount));
  }

  return messages;
}

export function FormatUsername(username: string, gamemode: string | null): string {
  if (!gamemode) return username;
  if (gamemode === "ironman") return `♲ ${username}`;
  if (gamemode === "bingo") return `Ⓑ ${username}`;
  if (gamemode === "island") return `☀ ${username}`;

  return username;
}

export function FormatNumber(number: number, decimals: number = 2): string {
  if (number === undefined || number === 0) return "0";

  const isNegative = number < 0;

  if (number < 100000 && number > -100000) {
    return Number(number).toLocaleString();
  }

  const abbrev = ["", "K", "M", "B", "T", "Qa", "Qi", "S", "O", "N", "D"];
  const unformattedNumber = Math.abs(number);

  const abbrevIndex = Math.floor(Math.log10(unformattedNumber) / 3);
  const shortNumber = (unformattedNumber / Math.pow(10, abbrevIndex * 3)).toFixed(decimals);

  return `${isNegative ? "-" : ""}${shortNumber}${abbrev[abbrevIndex]}`;
}
