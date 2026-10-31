import { formatInr } from "@/data/catalog";
import type { CartLine } from "@/contexts/CartContext";
export const WHATSAPP_NUMBER = "+919691555728";
export const whatsappDigits = WHATSAPP_NUMBER.replace(/\D/g, "");
export const whatsappReady = whatsappDigits.length >= 10;
export function buildOrderMessage(lines: CartLine[], subtotal: number) {
  const items = lines.map((line, index) => {
    const pack = line.product.packSize ? ` (${line.product.packSize})` : "";
    const onRequest = line.product.priceInr == null ? " (price on request)" : "";
    return `${index + 1}. ${line.product.name}${pack} × ${line.quantity}${onRequest}`;
  });
  const unpriced = lines.some((line) => line.product.priceInr == null);
  return [
    "Hello Re Workshop, I would like to order:",
    "",
    ...items,
    "",
    `Items: ${lines.reduce((sum, line) => sum + line.quantity, 0)} · Estimated total: ${formatInr(subtotal)}${unpriced ? " + items priced on request" : ""}`,
    "Please confirm availability and pickup / delivery.",
  ].join("\n");
}
export function whatsappOrderUrl(message: string) {
  return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;
}

/**
 * Dr. (Mrs.) Swati Chhajed's own WhatsApp, for the free lifestyle consultation (23 Oct 2026, given by Anupam).
 * Separate from the store's order number above.
 */
export const CONSULT_WHATSAPP = "+919736180113";
export const consultDigits = CONSULT_WHATSAPP.replace(/\D/g, "");
export function consultChatUrl(message: string) {
  return `https://wa.me/${consultDigits}?text=${encodeURIComponent(message)}`;
}
/** The same number dialled directly: the call button beside her name on Our story (28 Oct 2026, Anupam). */
export const consultCallUrl = `tel:${CONSULT_WHATSAPP}`;

/** A farmer's details from the For farmers page, as the first WhatsApp message to the store (31 Oct 2026). */
export type FarmerEnquiry = { name: string; place: string; land?: string; crops?: string; practice?: string; note?: string };
/** The message's wording, in the language the farmer is reading (data/brand.ts → farmersCopy[lang].message). */
export type FarmerMessageWords = { hello: string; name: string; place: string; land: string; acres: string; crops: string; practice: string; note: string };
export function farmerEnquiryUrl(enquiry: FarmerEnquiry, words: FarmerMessageWords) {
  const lines = [
    words.hello,
    "",
    `${words.name}: ${enquiry.name}`,
    `${words.place}: ${enquiry.place}`,
    enquiry.land ? `${words.land}: ${enquiry.land} ${words.acres}` : "",
    enquiry.crops ? `${words.crops}: ${enquiry.crops}` : "",
    enquiry.practice ? `${words.practice}: ${enquiry.practice}` : "",
    enquiry.note ? `${words.note}: ${enquiry.note}` : "",
  ].filter((line, index) => line || index === 1);
  return whatsappOrderUrl(lines.join("\n"));
}
