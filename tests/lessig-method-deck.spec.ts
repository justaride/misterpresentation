import { expect, test } from "@playwright/test";

test("Lessig Method Deck auto-advances (fast mode)", async ({ page }) => {
  await page.goto("/examples/lessig-method-deck?autostart=1&tempoMs=200", {
    waitUntil: "domcontentloaded",
  });

  await expect(page.getByTestId("lessig-deck")).toBeVisible();
  await expect(page.getByTestId("lessig-slide-position")).toHaveText(
    /^1\s*\/\s*\d+$/,
  );

  await expect(page.getByTestId("lessig-slide-position")).toHaveText(
    /^2\s*\/\s*\d+$/,
    { timeout: 5000 },
  );
});

