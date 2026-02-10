import { expect, test } from "@playwright/test";

test("Refined Grit Deck renders and can navigate", async ({ page }) => {
  await page.goto("/examples/refined-grit-deck", { waitUntil: "domcontentloaded" });

  await expect(page.getByTestId("grit-deck")).toBeVisible();
  await expect(page.getByTestId("grit-slide-position")).toHaveText(
    /^1\s*\/\s*\d+$/,
  );

  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("grit-slide-position")).toHaveText(
    /^2\s*\/\s*\d+$/,
  );
});

