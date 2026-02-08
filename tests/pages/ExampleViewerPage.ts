import { expect, type Page } from "@playwright/test";

export class ExampleViewerPage {
  constructor(private readonly page: Page) {}

  async expectTitle(title: string) {
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible();
  }
}

