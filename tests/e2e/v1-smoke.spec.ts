import { expect, test } from "@playwright/test";

async function openRoot(page: import("@playwright/test").Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Your world is already forming." })).toBeVisible();
}

async function expectVisibleBodyText(page: import("@playwright/test").Page, text: string | RegExp) {
  await expect(page.locator("body").getByText(text).first()).toBeVisible();
}

test.describe("URAI V1 smoke", () => {
  test("root renders passive first world entry flow @smoke", async ({ page }) => {
    await openRoot(page);

    await expectVisibleBodyText(page, /^URAI$/);
    await expectVisibleBodyText(page, /URAI quietly turns the patterns of your life/i);
    await expect(page.getByRole("link", { name: "Enter my world" })).toHaveAttribute("href", "/home?mode=quiet");
    await expect(page.getByRole("textbox", { name: "Optional first spark" })).toBeVisible();
    await expect(page.getByLabel("World tone")).toBeVisible();
    await expect(page.getByRole("button", { name: "Preview optional spark" })).toBeVisible();
    await expectVisibleBodyText(page, /A memory is only a spark -- not a requirement/i);
  });

  test("root previews an optional first spark @smoke", async ({ page }) => {
    await openRoot(page);

    await page.getByRole("textbox", { name: "Optional first spark" }).fill("I moved to a new city and started rebuilding my life.");
    await page.getByLabel("World tone").selectOption("hopeful");
    await page.getByRole("button", { name: "Preview optional spark" }).click();

    await expectVisibleBodyText(page, /^First spark$/);
    await expectVisibleBodyText(page, /This memory can become the first star in your world/i);
    await expectVisibleBodyText(page, /The World After/i);
    await expectVisibleBodyText(page, /This is where your life stops being a note and starts becoming a world\./i);

    const bloomLink = page.getByRole("link", { name: "Let it bloom" });
    await expect(bloomLink).toBeVisible();
    await expect(bloomLink).toHaveAttribute("href", /memory=.*rebuilding.*vibe=hopeful/);
  });

  test("quiet home entry renders living quiet world @smoke", async ({ page }) => {
    await page.goto("/home?mode=quiet", { waitUntil: "domcontentloaded" });

    await expectVisibleBodyText(page, /^Quiet world$/);
    await expectVisibleBodyText(page, /The sky is quiet for now/i);
    await expectVisibleBodyText(page, /Nothing is required yet/i);
    await expectVisibleBodyText(page, /URAI will let the first patterns appear gently/i);
  });

  test("memory home entry renders first spark overlay @smoke", async ({ page }) => {
    await page.goto("/home?memory=I%20moved%20to%20a%20new%20city%20and%20started%20rebuilding%20my%20life.&vibe=hopeful", { waitUntil: "domcontentloaded" });

    await expectVisibleBodyText(page, /^First spark · hopeful$/);
    await expectVisibleBodyText(page, /This memory can become the first star in your world/i);
    await expectVisibleBodyText(page, /I moved to a new city and started rebuilding my life/i);
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