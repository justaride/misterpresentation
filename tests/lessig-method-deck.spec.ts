import { expect, test } from "@playwright/test";

test("Lessig Method Deck auto-advances (fast mode)", async ({ page }) => {
  await page.goto("/examples/lessig-method-deck?autostart=1&tempoMs=200", {
    waitUntil: "domcontentloaded",
  });

  await expect(page.getByTestId("lessig-deck")).toBeVisible();
  const pos = page.getByTestId("lessig-slide-position");
  await expect(pos).toHaveText(/^\d+\s*\/\s*\d+$/);

  const initialText = (await pos.textContent()) ?? "1 / 1";
  const initial = Number(initialText.split("/")[0]?.trim() ?? "1");

  await expect
    .poll(async () => {
      const t = (await pos.textContent()) ?? "";
      const n = Number(t.split("/")[0]?.trim() ?? "0");
      return n;
    })
    .toBeGreaterThan(initial);
});
