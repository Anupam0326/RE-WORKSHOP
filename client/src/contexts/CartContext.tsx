/** Local basket. Stores only product ids + quantities, re-hydrated from the live catalogue on load. */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProductBySlug, type Product } from "@/data/catalog";

export type CartLine = { product: Product; quantity: number };
type StoredLine = { id: string; quantity: number };
type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addProduct: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "reworkshop-local-cart";
const CartContext = createContext<CartContextValue | null>(null);

function readStored(): StoredLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    // Accept both the current shape ({id}) and the previous one ({product:{id}}).
    return parsed
      .map((line: any) => ({ id: line?.id ?? line?.product?.id, quantity: line?.quantity }))
      .filter((line): line is StoredLine => typeof line.id === "string" && Number.isInteger(line.quantity) && line.quantity > 0);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<StoredLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStored(readStored().filter((line) => getProductBySlug(line.id)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* storage unavailable — basket still works for this visit */
    }
  }, [stored, ready]);

  const value = useMemo<CartContextValue>(() => {
    const lines = stored.flatMap((line) => {
      const product = getProductBySlug(line.id);
      return product ? [{ product, quantity: line.quantity }] : [];
    });
    return {
      lines,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce((sum, line) => sum + line.product.priceInr * line.quantity, 0),
      addProduct: (product, quantity = 1) =>
        setStored((current) =>
          current.some((line) => line.id === product.id)
            ? current.map((line) => (line.id === product.id ? { ...line, quantity: line.quantity + quantity } : line))
            : [...current, { id: product.id, quantity }],
        ),
      updateQuantity: (productId, quantity) =>
        setStored((current) =>
          quantity <= 0 ? current.filter((line) => line.id !== productId) : current.map((line) => (line.id === productId ? { ...line, quantity } : line)),
        ),
      removeProduct: (productId) => setStored((current) => current.filter((line) => line.id !== productId)),
      clearCart: () => setStored([]),
    };
  }, [stored]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
