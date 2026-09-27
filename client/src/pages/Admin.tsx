/** Store admin — sign in, then manage products and categories. Loaded only when /admin is opened. */

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ExternalLink, Eye, EyeOff, LogOut, Package, Tags } from "lucide-react";
import { Link } from "wouter";
import { BrandMark } from "@/components/BrandMark";
import { ProductsPanel } from "@/components/admin/ProductsPanel";
import { CategoriesPanel } from "@/components/admin/CategoriesPanel";
import { checkIsAdmin, explainError, listCategories, listProducts, type AdminCategory, type AdminProduct } from "@/lib/adminApi";
import { getSession, peekSession, signIn, signOut } from "@/lib/supabase";
import { useCatalog } from "@/contexts/CatalogContext";
import "./admin.css";

type Gate = "checking" | "signed-out" | "not-admin" | "ready";

function useNoIndex() {
  useEffect(() => {
    document.title = "Store admin · Re Workshop";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

function LoginForm({ onSignedIn }: { onSignedIn: () => void }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await signIn(identifier, password);
      onSignedIn();
    } catch (err) {
      setError(explainError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login">
      <form className="admin-login__card" onSubmit={submit} noValidate>
        <div className="admin-login__brand">
          <BrandMark />
        </div>
        <h1>Store admin</h1>
        <p className="admin-muted">Sign in to add, edit and arrange products.</p>
        <label className="admin-field">
          <span>Email</span>
          <input type="email" inputMode="email" autoComplete="username" autoCapitalize="none" spellCheck={false} value={identifier} onChange={(event) => setIdentifier(event.target.value)} required />
        </label>
        <label className="admin-field">
          <span>Password</span>
          <span className="admin-password">
            <input type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button type="button" className="admin-icon-btn" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="admin-btn admin-btn--primary admin-btn--full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <Link href="/" className="admin-link">
          ← Back to the website
        </Link>
      </form>
    </main>
  );
}

export default function Admin() {
  useNoIndex();
  const catalog = useCatalog();
  const [gate, setGate] = useState<Gate>(() => (peekSession() ? "checking" : "signed-out"));
  const [tab, setTab] = useState<"products" | "categories">("products");
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadError, setLoadError] = useState("");
  const [email, setEmail] = useState("");

  const load = useCallback(async () => {
    setLoadError("");
    try {
      const [nextCategories, nextProducts] = await Promise.all([listCategories(), listProducts()]);
      setCategories(nextCategories);
      setProducts(nextProducts);
    } catch (err) {
      setLoadError(explainError(err));
    }
  }, []);

  const verify = useCallback(async () => {
    const session = await getSession();
    if (!session) {
      setGate("signed-out");
      return;
    }
    setEmail(session.email);
    try {
      if (await checkIsAdmin()) {
        setGate("ready");
        await load();
      } else setGate("not-admin");
    } catch {
      setGate("signed-out");
    }
  }, [load]);

  useEffect(() => {
    if (gate === "checking") verify();
  }, [gate, verify]);

  /** After any change: reload the admin lists and refresh the public catalogue. */
  const changed = useCallback(async () => {
    await Promise.all([load(), catalog.refresh()]);
  }, [load, catalog]);

  async function logout() {
    await signOut();
    setGate("signed-out");
    setProducts([]);
    setCategories([]);
  }

  if (gate === "signed-out") return <LoginForm onSignedIn={() => setGate("checking")} />;
  if (gate === "checking")
    return (
      <main className="admin-login" aria-busy="true">
        <p className="admin-muted">Checking your access…</p>
      </main>
    );
  if (gate === "not-admin")
    return (
      <main className="admin-login">
        <div className="admin-login__card">
          <h1>No admin access</h1>
          <p className="admin-muted">
            {email || "This account"} is signed in but isn’t on the store’s admin list. Ask the site owner to add it.
          </p>
          <button type="button" className="admin-btn admin-btn--primary admin-btn--full" onClick={logout}>
            Sign out
          </button>
        </div>
      </main>
    );

  return (
    <div className="admin">
      <header className="admin-bar">
        <Link href="/" className="admin-bar__brand" aria-label="Back to the website">
          <BrandMark compact />
        </Link>
        <nav className="admin-tabs" aria-label="Admin sections">
          <button type="button" className={tab === "products" ? "is-active" : ""} aria-pressed={tab === "products"} onClick={() => setTab("products")}>
            <Package size={18} aria-hidden="true" /> Products <span>{products.length}</span>
          </button>
          <button type="button" className={tab === "categories" ? "is-active" : ""} aria-pressed={tab === "categories"} onClick={() => setTab("categories")}>
            <Tags size={18} aria-hidden="true" /> Categories <span>{categories.length}</span>
          </button>
        </nav>
        <div className="admin-bar__end">
          <a href="/shop" target="_blank" rel="noreferrer" className="admin-icon-btn" aria-label="Open the store in a new tab" title="View store">
            <ExternalLink size={18} />
          </a>
          <button type="button" className="admin-icon-btn" onClick={logout} aria-label="Sign out" title={`Sign out ${email}`}>
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <main className="admin-main">
        {loadError && (
          <div className="admin-error" role="alert">
            {loadError}{" "}
            <button type="button" className="admin-link" onClick={load}>
              Try again
            </button>
          </div>
        )}
        {tab === "products" ? (
          <ProductsPanel products={products} categories={categories} onChanged={changed} setProducts={setProducts} />
        ) : (
          <CategoriesPanel categories={categories} products={products} onChanged={changed} setCategories={setCategories} />
        )}
      </main>
    </div>
  );
}
