import { expect, type Page } from "@playwright/test";

export class LandingPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(
      this.page.getByRole("heading", { name: /modern web presentations/i }),
    ).toBeVisible();
  }

  async browseExamples() {
    await this.page
      .getByRole("main")
      .getByRole("link", { name: /browse examples/i })
      .click();
  }
}
