import { expect, test } from "@playwright/test";
import { startLiveQaHubMockServer } from "./helpers/liveQaHubMockServer";

test("Live Q&A + Reactions: audience question + upvote + host navigation sync", async ({
  page,
  context,
}) => {
  const server = await startLiveQaHubMockServer();
  const room = "TEST01";

  try {
    const host = page;
    const audience = await context.newPage();

    const ws = encodeURIComponent(server.wsUrl);
    const push = encodeURIComponent(server.pushUrl);

    await host.goto(
      `/examples/live-qa-reactions?role=host&room=${room}&ws=${ws}&push=${push}`,
      { waitUntil: "domcontentloaded" },
    );
    await audience.goto(
      `/examples/live-qa-reactions?role=audience&room=${room}&ws=${ws}&push=${push}`,
      { waitUntil: "domcontentloaded" },
    );

    await expect(host.getByTestId("qa-deck")).toBeVisible();
    await expect(audience.getByTestId("qa-deck")).toBeVisible();

    await expect(host.getByTestId("qa-connection-badge")).toHaveText(/connected/i);
    await expect(audience.getByTestId("qa-connection-badge")).toHaveText(/connected/i);

    const question = "What is the decision we want by the end?";
    await audience.getByTestId("qa-question-input").fill(question);
    await audience.getByTestId("qa-submit-question").click();

    await expect(host.getByText(question, { exact: true })).toBeVisible();

    await audience.getByRole("button", { name: `Upvote: ${question}` }).click();
    await expect(host.getByText(/1 votes/i)).toBeVisible();

    await expect(audience.getByTestId("qa-slide-position")).toHaveText(/^1\s*\/\s*\d+$/);
    await host.keyboard.press("ArrowRight");
    await expect(audience.getByTestId("qa-slide-position")).toHaveText(
      /^2\s*\/\s*\d+$/,
      { timeout: 7000 },
    );
  } finally {
    await server.close();
  }
});

