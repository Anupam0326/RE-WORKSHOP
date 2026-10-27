// Café menu: content/cafe-menu/reworkshop_cafe_menu.json is the source of truth (as supplied 22 Oct 2026, with the
// editor's review notes). This script checks it and writes the customer copy the site imports,
// client/src/data/cafeMenu.json, without review_notes or data_notes (those are for the team, not for customers).
//
//   node scripts/cafe-menu.mjs          check the source and write the customer copy
//   node scripts/cafe-menu.mjs --check  only check that the customer copy matches the source (exit 1 if not)
//
// To change a dish or a price: edit the source JSON, run this script, commit both files.

import { readFileSync, writeFileSync } from "node:fs";

const SOURCE = new URL("../content/cafe-menu/reworkshop_cafe_menu.json", import.meta.url);
const TARGET = new URL("../client/src/data/cafeMenu.json", import.meta.url);

const source = JSON.parse(readFileSync(SOURCE, "utf8"));
const problems = [];
const ids = new Set();

const categories = source.categories.map((category) => {
  if (!category.id || !category.name) problems.push(`category without id or name: ${JSON.stringify(category).slice(0, 80)}`);
  if (ids.has(category.id)) problems.push(`duplicate id: ${category.id}`);
  ids.add(category.id);
  const items = category.items.map((item) => {
    if (!item.id || !item.name) problems.push(`item without id or name in ${category.id}`);
    if (ids.has(item.id)) problems.push(`duplicate id: ${item.id}`);
    ids.add(item.id);
    if (!Number.isInteger(item.price) || item.price <= 0) problems.push(`${item.id}: price must be a whole number of rupees, got ${item.price}`);
    if (item.description != null && typeof item.description !== "string") problems.push(`${item.id}: description must be text or null`);
    return { id: item.id, name: item.name, price: item.price, description: item.description?.trim() || null };
  });
  if (items.length === 0) problems.push(`${category.id}: no items`);
  return { id: category.id, name: category.name, ...(category.parent_section ? { parentSection: category.parent_section } : {}), items };
});

if (problems.length) {
  console.error(`Café menu has ${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  process.exit(1);
}

const output = `${JSON.stringify({ name: source.menu_name, currency: source.currency.code, categories }, null, 2)}\n`;
const count = categories.reduce((sum, category) => sum + category.items.length, 0);

if (process.argv.includes("--check")) {
  const current = readFileSync(TARGET, "utf8");
  if (current !== output) {
    console.error("client/src/data/cafeMenu.json is out of date: run node scripts/cafe-menu.mjs");
    process.exit(1);
  }
  console.log(`Café menu up to date: ${categories.length} categories, ${count} items.`);
} else {
  writeFileSync(TARGET, output);
  console.log(`Wrote client/src/data/cafeMenu.json: ${categories.length} categories, ${count} items.`);
}
