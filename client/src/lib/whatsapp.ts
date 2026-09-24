import { formatInr } from "@/data/catalog";
import type { CartLine } from "@/contexts/CartContext";

/**
 * WhatsApp ordering — the only way orders are placed on this site.
 *
 * ▶ SET THE NUMBER HERE before going live: country code + number, digits only
 *   (e.g. "919876543210" for +91 98765 43210). Spaces, "+" and dashes are stripped automatically.
 *   While it is empty the "Order through WhatsApp" button stays disabled, so no order
 *   can be sent to the wrong contact.
 */
export const WHATSAPP_NUMBER = "";

export const whatsappDigits = WHATSAPP_NUMBER.replace(/\D/g, "");
export const whatsappReady = whatsappDigits.length >= 10;

/** Short, readable order message: one line per SKU with pack size and quantity. */
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
