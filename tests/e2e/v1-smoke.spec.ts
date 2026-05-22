import { expect, test } from "@playwright/test";

async function openRoot(page: import("@playwright/test").Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Give URAI one memory. Watch it become a world." })).toBeVisible();
}

async function expectVisibleBodyText(page: import("@playwright/test").Page, text: string | RegExp) {
  await expect(page.locator("body").getByText(text).first()).toBeVisible();
}

test.describe("URAI V1 smoke", () => {
  test("root renders memory-to-world entry flow @smoke", async ({ page }) => {
    await openRoot(page);

    await expectVisibleBodyText(page, /^URAI$/);
    await expectVisibleBodyText(page, /Start with a thought, moment, dream, voice-note transcript, or scene from your life/i);
    await expect(page.getByRole("textbox", { name: "One memory" })).toBeVisible();
    await expect(page.getByLabel("Vibe")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create scene" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Enter existing world" })).toHaveAttribute("href", "/home");
  });

  test("root generates and shares a first scene @smoke", async ({ page }) => {
    await openRoot(page);

    await page.getByRole("textbox", { name: "One memory" }).fill("I moved to a new city and started rebuilding my life.");
    await page.getByLabel("Vibe").selectOption("hopeful");
    await page.getByRole("button", { name: "Create scene" }).click();

    await expectVisibleBodyText(page, /^Your first scene$/);
    await expectVisibleBodyText(page, /The World After/i);
    await expectVisibleBodyText(page, /This is where your life stops being a note and starts becoming a world\./i);

    const shareLink = page.getByRole("link", { name: "Share this scene" });
    await expect(shareLink).toBeVisible();
    await expect(shareLink).toHaveAttribute("href", /memory=.*rebuilding.*vibe=hopeful/);
  });

  test("public constellation route renders demo content @smoke", async ({ page }) => {
    await page.goto("/u/adamclamp", { waitUntil: "domcontentloaded" });

    await expectVisibleBodyText(page, /^Public Constellation$/);
    await expectVisibleBodyText(page, /^Demo data · public-safe view$/);
    await expectVisibleBodyText(page, /^@adamclamp$/);
    await expectVisibleBodyText(page, /^Memory Blooms$/);
    await expectVisibleBodyText(page, /^Star Timeline$/);
    await expectVisibleBodyText(page, /^Join Early Access$/);
  });

  test("canonical V1 routes render launch-safe pages @smoke", async ({ page }) => {
    const routes = [
      ["/waitlist", /Join the URAI waitlist/i],
      ["/journal", /Your private Scribe/i],
      ["/narrator", /The narrator speaks/i],
      ["/rituals", /Small rituals/i],
      ["/scrolls", /become a scroll/i],
      ["/settings/privacy", /Privacy controls/i],
      ["/terms", /early-access product surface/i],
      ["/about", /magical life OS/i],
      ["/investors", /coherent launch surface/i],
      ["/memory/demo-star", /Memory Star opened/i],
      ["/cognitive-mirror", /Cognitive Mirror/i],
      ["/ochat", /Orb companion/i],
    ] as const;

    for (const [route, expectedText] of routes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expectVisibleBodyText(page, expectedText);
    }
  });

  test("waitlist API accepts an email in dry-run mode @smoke", async ({ request }) => {
    const response = await request.post("/api/waitlist", {
      data: {
        email: "smoke@example.com",
        source: "e2e-smoke",
        handle: "adamclamp",
        intent: "early-access"
      }
    });

    await expect(response).toBeOK();
    const body = await response.json();
    expect(body.ok).toBe(true);
  });

  test("waitlist form keeps invalid email disabled", async ({ page }) => {
    await page.goto("/u/adamclamp", { waitUntil: "domcontentloaded" });

    const email = page.locator("#waitlist-email-public-constellation");
    const form = email.locator("xpath=ancestor::form");
    await expect(email).toBeVisible();
    await expect(form.getByRole("button", { name: /Request Access|Joined/ })).toBeDisabled();
  });

  test("companion API responds to a valid prompt", async ({ request }) => {
    const response = await request.post("/api/companion", {
      data: {
        history: [],
        message: "What should I build next?"
      }
    });

    await expect(response).toBeOK();
    const body = await response.json();
    expect(body.reply).toEqual(expect.any(String));
    expect(body.moodTag).toEqual(expect.any(String));
  });

  test("status endpoint reports ok", async ({ request }) => {
    const response = await request.get("/api/status");
    await expect(response).toBeOK();
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.service).toBe("urai");
  });
});
