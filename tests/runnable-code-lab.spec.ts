import { expect, test } from "@playwright/test";

test("Runnable Code Lab loads and emits console output", async ({ page }) => {
  await page.goto("/examples/runnable-code-lab", { waitUntil: "domcontentloaded" });

  await expect(page.getByText("Runnable Code Lab", { exact: false })).toBeVisible();

  // Click run to make the test deterministic even if autorun behavior changes.
  await page.getByTestId("rcl-run").click();

  await expect(page.getByTestId("rcl-console").getByText("Sandbox booted.", { exact: true })).toBeVisible({
    timeout: 15_000,
  });
});
