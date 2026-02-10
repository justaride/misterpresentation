import { expect, test } from "@playwright/test";

test("Bento Grid Deck renders and can navigate", async ({ page }) => {
  await page.goto("/examples/bento-grid-deck", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("bento-deck")).toBeVisible();
  await expect(page.getByTestId("bento-slide-position")).toHaveText(
    /^1\s*\/\s*\d+$/,
  );

  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("bento-slide-position")).toHaveText(
    /^2\s*\/\s*\d+$/,
  );
});

