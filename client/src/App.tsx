/** App shell — Home ships in the main bundle; other routes are split and prefetched when the browser is idle. */

import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";

const loadShop = () => import("@/pages/Shop");
const loadProduct = () => import("@/pages/ProductDetail");
const loadCart = () => import("@/pages/Cart");
const Shop = lazy(loadShop);
const ProductDetail = lazy(loadProduct);
const Cart = lazy(loadCart);
const NotFound = lazy(() => import("@/pages/NotFound"));

function RouteFallback() {
  return <div className="route-fallback" aria-busy="true" aria-label="Loading" />;
}

function usePrefetchRoutes() {
  useEffect(() => {
    const prefetch = () => {
      loadShop();
      loadProduct();
      loadCart();
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (idle) idle(prefetch);
    else {
      const timer = window.setTimeout(prefetch, 2500);
      return () => window.clearTimeout(timer);
    }
  }, []);
}

/** New page → top of page. Back/forward → restore where the visitor was. Hash links are left to the page. */
function ScrollManager() {
  const [location] = useLocation();
  const positions = useRef(new Map<string, number>());
  const fromHistory = useRef(false);
  const current = useRef(location);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const onPop = () => (fromHistory.current = true);
    const onScroll = () => positions.current.set(current.current, window.scrollY);
    window.addEventListener("popstate", onPop);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    current.current = location;
    if (fromHistory.current) {
      fromHistory.current = false;
      const target = positions.current.get(location) ?? 0;
      // Lazy pages may need a moment to render tall enough; retry briefly.
      let tries = 0;
      const restore = () => {
        window.scrollTo(0, target);
        if (Math.abs(window.scrollY - target) > 2 && tries++ < 25) window.setTimeout(restore, 20);
      };
      window.setTimeout(restore, 0);
    } else if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<RouteFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/shop/:category" component={Shop} />
          <Route path="/product/:slug" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

function App() {
  usePrefetchRoutes();
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <Toaster position="top-center" />
        <CartProvider>
          <Router />
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
