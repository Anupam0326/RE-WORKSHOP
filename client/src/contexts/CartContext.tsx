/** Local basket. Stores product slugs + quantities and resolves them against the live catalogue. */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/catalog";
import { useCatalog } from "@/contexts/CatalogContext";

export type CartLine = { product: Product; quantity: number };
type StoredLine = { slug: string; quantity: number };
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
    // Accept current ({slug}) and earlier shapes ({id} / {product:{id}}) — earlier ids were slugs.
    return parsed
      .map((line: any) => ({ slug: line?.slug ?? line?.id ?? line?.product?.slug ?? line?.product?.id, quantity: line?.quantity }))
      .filter((line): line is StoredLine => typeof line.slug === "string" && Number.isInteger(line.quantity) && line.quantity > 0);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { getProduct, status } = useCatalog();
  const [stored, setStored] = useState<StoredLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStored(readStored());
    setReady(true);
  }, []);

  // Once the live catalogue has loaded, drop lines for products that no longer exist.
  useEffect(() => {
    if (status === "live") setStored((current) => current.filter((line) => getProduct(line.slug)));
  }, [status, getProduct]);

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
      const product = getProduct(line.slug);
      return product ? [{ product, quantity: line.quantity }] : [];
    });
    // Public API takes product.id; resolve it to the stable slug.
    const slugFor = (productId: string) => lines.find((line) => line.product.id === productId)?.product.slug ?? productId;
    return {
      lines,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce((sum, line) => sum + line.product.priceInr * line.quantity, 0),
      addProduct: (product, quantity = 1) =>
        setStored((current) =>
          current.some((line) => line.slug === product.slug)
            ? current.map((line) => (line.slug === product.slug ? { ...line, quantity: line.quantity + quantity } : line))
            : [...current, { slug: product.slug, quantity }],
        ),
      updateQuantity: (productId, quantity) => {
        const slug = slugFor(productId);
        setStored((current) => (quantity <= 0 ? current.filter((line) => line.slug !== slug) : current.map((line) => (line.slug === slug ? { ...line, quantity } : line))));
      },
      removeProduct: (productId) => {
        const slug = slugFor(productId);
        setStored((current) => current.filter((line) => line.slug !== slug));
      },
      clearCart: () => setStored([]),
    };
  }, [stored, getProduct]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
