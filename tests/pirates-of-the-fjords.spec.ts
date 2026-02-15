import { expect, test } from "@playwright/test";

test("Pirates of the Fjord Crown renders chapters and interactive endings", async ({
  page,
}) => {
  await page.goto("/pirates-of-the-fjords.html", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { level: 1, name: /pirates of the fjord crown/i }),
  ).toBeVisible();

  await expect(page.locator("section.chapter")).toHaveCount(6);

  const detail = page.getByTestId("pirates-ending-detail");
  await expect(detail).toBeVisible();
  await expect(detail).toContainText(/coalition/i);

  await page.getByTestId("pirates-ending-choice-betray").click();
  await expect(detail).toContainText(/turning jarl against jarl/i);

  await page.getByTestId("pirates-ending-choice-law").click();
  await expect(detail).toContainText(/bind pirates and vikings to a code/i);

  await page.getByTestId("pirates-ending-choice-break").click();
  await expect(detail).toContainText(/shatter the runestones/i);
});

