// eslint-disable-next-line import/prefer-default-export
export function HexToDecimal(hex: string | number | undefined): number {
  if (hex === undefined) return 1752220;
  if (typeof hex === "number") return hex;
  return parseInt(hex.replace("#", ""), 16);
}
