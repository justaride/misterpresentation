import { expect, test } from "@playwright/test";
import { LandingPage } from "./pages/LandingPage";
import { ExamplesPage } from "./pages/ExamplesPage";
import { ExampleViewerPage } from "./pages/ExampleViewerPage";
import { startLiveDataMockServer } from "./helpers/liveDataMockServer";

test("browse examples and open Live Data Dashboard", async ({ page }) => {
  const landing = new LandingPage(page);
  await landing.goto();
  await landing.browseExamples();

  const examples = new ExamplesPage(page);
  await examples.expectLoaded();
  await examples.openExample("Live Data Dashboard");

  const viewer = new ExampleViewerPage(page);
  await viewer.expectTitle("Live Data Dashboard");

  await expect(page.locator("#kpi-active")).toBeVisible();
  await expect(page.getByText("Activity feed", { exact: true })).toBeVisible();
});

test("Live Data Dashboard connects via SSE", async ({ page }) => {
  const server = await startLiveDataMockServer();
  try {
    const url = encodeURIComponent(server.sseUrl);
    await page.goto(`/examples/live-data-dashboard?source=sse&url=${url}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByRole("heading", { name: /live data dashboard/i }),
    ).toBeVisible();
    await expect(page.getByTestId("live-connection-badge")).toHaveText(
      /connected/i,
    );
  } finally {
    await server.close();
  }
});

test("Live Data Dashboard connects via WebSocket", async ({ page }) => {
  const server = await startLiveDataMockServer();
  try {
    const url = encodeURIComponent(server.wsUrl);
    await page.goto(`/examples/live-data-dashboard?source=ws&url=${url}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByRole("heading", { name: /live data dashboard/i }),
    ).toBeVisible();
    await expect(page.getByTestId("live-connection-badge")).toHaveText(
      /connected/i,
    );
  } finally {
    await server.close();
  }
});

test("Poll-Driven Slides accepts a vote", async ({ page }) => {
  await page.goto("/examples/poll-driven-slides", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /poll-driven slides/i })).toBeVisible();

  await page.getByRole("button", { name: /kinetic typography/i }).click();
  await expect(page.getByText(/1 votes/i)).toBeVisible();
});

test("Pecha Kucha 20x20 auto-advances (fast mode)", async ({ page }) => {
  await page.goto("/examples/pecha-kucha-20x20?autostart=1&seconds=1", {
    waitUntil: "domcontentloaded",
  });

  await expect(page.getByTestId("pk-deck")).toBeVisible();
  await expect(page.getByTestId("pk-slide-position")).toHaveText(
    /^1\s*\/\s*\d+$/,
  );

  await expect(page.getByTestId("pk-slide-position")).toHaveText(
    /^2\s*\/\s*\d+$/,
    { timeout: 7_000 },
  );
});

test("Ignite 20x15 auto-advances (fast mode)", async ({ page }) => {
  await page.goto("/examples/ignite-20x15?autostart=1&seconds=1", {
    waitUntil: "domcontentloaded",
  });

  await expect(page.getByTestId("ignite-deck")).toBeVisible();
  await expect(page.getByTestId("ignite-slide-position")).toHaveText(
    /^1\s*\/\s*\d+$/,
  );

  await expect(page.getByTestId("ignite-slide-position")).toHaveText(
    /^2\s*\/\s*\d+$/,
    { timeout: 7_000 },
  );
});

test("Early Adopter Client Deck renders and can navigate", async ({ page }) => {
  await page.goto("/examples/early-adopter-client-deck", {
    waitUntil: "domcontentloaded",
  });

  await expect(page.getByTestId("ea-deck")).toBeVisible();
  await expect(page.getByTestId("ea-slide-position")).toHaveText(
    /^1\s*\/\s*\d+$/,
  );

  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("ea-slide-position")).toHaveText(
    /^2\s*\/\s*\d+$/,
  );
});
