export function titleCase(string: string): string {
  if (!string) return "";
  return string
    .toLowerCase()
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function titleCaseCamel(string: string): string {
  if (!string || typeof string !== "string") return "";
  const withUnderscores = string.replace(/([a-z])([A-Z])/g, "$1_$2");
  return titleCase(withUnderscores);
}

export function replaceVariables(template: string, variables: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (match, name) => variables[name] ?? match);
}

export function splitMessage(message: string, amount: number): string[] {
  const messages = [];
  for (let i = 0; i < message.length; i += amount) {
    messages.push(message.slice(i, i + amount));
  }

  return messages;
}

export function formatNumber(number: number | string, decimals: number = 2) {
  if (typeof number === "string") return number;
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

export function removeColorCodes(input: string): string {
  return input.replace(/§[0-9a-fk-or]/g, "");
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function sanitizeString(string: string): string {
  if (!string) return "";
  return string.replaceAll("_", "\\_").replaceAll("*", "\\*").replaceAll("~", "\\~").replaceAll(">", "\\>").replaceAll("`", "\\`").replaceAll("|", "\\|");
}

export function getTimestamp(time: number = Date.now()): string {
  return new Date(time).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZoneName: "short",
    timeZone: "UTC"
  });
}
