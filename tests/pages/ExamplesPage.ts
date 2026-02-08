import { expect, type Page } from "@playwright/test";

export class ExamplesPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(
      this.page.getByRole("heading", { name: /browse examples/i }),
    ).toBeVisible();
  }

  async openExample(title: string) {
    await this.page
      .getByRole("main")
      .getByRole("link", { name: new RegExp(title, "i") })
      .click();
  }
}
