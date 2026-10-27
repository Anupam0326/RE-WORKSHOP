# Café menu

The full Re Workshop café menu shown on `/cafe#menu` (added 22 Oct 2026: 8 sections, 65 dishes and drinks).

| File | What it is |
|---|---|
| `reworkshop_cafe_menu.json` | **Source of truth.** Dishes, prices (whole rupees) and descriptions, plus the review notes for the team. |
| `reworkshop_cafe_menu.as-supplied.json` | The file exactly as it was supplied, for comparison. |
| `reworkshop_cafe_menu.md` | The human-readable review copy as supplied (not updated after 22 Oct). |
| `../../client/src/data/cafeMenu.json` | The customer copy the site imports. Made from the source by the script below; review notes are left out. Don't edit it by hand. |

## Changing a dish or a price

1. Edit `reworkshop_cafe_menu.json`. Prices are whole numbers (`150`, not `"₹150"`); a missing description is `null`.
2. Run `node scripts/cafe-menu.mjs`. It checks the file (unique ids, whole-rupee prices) and rewrites the customer copy.
3. `node scripts/cafe-menu.mjs --check` fails if the customer copy is out of date.

Dish photos are listed in `client/src/data/cafeMenu.ts` (`dishPhotoIds`); the photo files are `client/public/site/dish-<id>-1600.webp` and `-800.webp`. Only the café's own photos go there.

## Edits made for the website (22 Oct 2026)

- Aadanshilpa Poha: "The source describes it as low in glycaemic index and high in iron." became "A special poha from Jharkhand." The health claim waits for the client's confirmation.
- Banana Protein Smoothie: "described in the source as a post-workout drink" became "A post-workout drink combining plant protein and banana."

## To confirm with the client before launch

- Bao Momos (8 Pieces): description missing (the printed menu repeats the Curd Millet Idli text). The "BAO POCKET" photo was not matched to it.
- Millet Patty with Banana Fingers / Sweet Potato Fingers (8 Pieces): one dish with a choice, or two dishes? No description.
- Seasonal Saag with Makka Paratha: no description.
- Aadanshilpa Poha: spelling; and whether to publish "low in glycaemic index and high in iron".
- Millet Ambli: the printed "possitive millet" wording.
- Vegan Protein Smoothie: "around 10 gm protein absorption" (no number is published).
- Besan Cheela: "kaliganga rice flour" spelling.
- Black Moong Cheela: the "MOONG DAL CHEELA" photo was not confirmed as this dish, so it has no photo.
