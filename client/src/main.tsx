import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Reveal-on-scroll styles only apply when JS runs, so content is never hidden without it.
document.documentElement.classList.add("js");

createRoot(document.getElementById("root")!).render(<App />);
