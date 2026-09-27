import { formatInr } from "@/data/catalog";
import type { CartLine } from "@/contexts/CartContext";
export const WHATSAPP_NUMBER = "+919691555728";
export const whatsappDigits = WHATSAPP_NUMBER.replace(/\D/g, "");
export const whatsappReady = whatsappDigits.length >= 10;
export function buildOrderMessage(lines: CartLine[], subtotal: number) {
  const items = lines.map((line, index) => `${index + 1}. ${line.product.name} (${line.product.packSize}) × ${line.quantity}`);
  return [
    "Hello Re Workshop, I would like to order:",
    "",
    ...items,
    "",
    `Items: ${lines.reduce((sum, line) => sum + line.quantity, 0)} · Estimated total: ${formatInr(subtotal)}`,
    "Please confirm availability and pickup / delivery.",
  ].join("\n");
}
export function whatsappOrderUrl(message: string) {
  return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;
}