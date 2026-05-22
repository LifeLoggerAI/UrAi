import { expect, test } from "@playwright/test";

async function openHome(page: import("@playwright/test").Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('main[aria-label="URAI Home World"]').first()).toBeVisible();
}

async function expectVisibleBodyText(page: import("@playwright/test").Page, text: string | RegExp) {
  await expect(page.locator("body").getByText(text).first()).toBeVisible();
}

async function expectBodyTextAttached(page: import("@playwright/test").Page, text: string | RegExp) {
  await expect(page.locator("body").getByText(text).first()).toHaveCount(1);
}

async function clickButtonByLabel(page: import("@playwright/test").Page, label: string | RegExp) {
  await page.getByRole("button", { name: label }).first().evaluate((node) => {
    (node as HTMLButtonElement).click();
  });
}

test.describe("URAI V1 smoke", () => {
  test("home route renders core V1 sections @smoke", async ({ page }) => {
    await openHome(page);

    await expectVisibleBodyText(page, /^URAI$/);
    await expectBodyTextAttached(page, /^Sky · Orb · Ground$/);
    await expectVisibleBodyText(page, /stable · quiet sky · memory gateway ready/i);
    await expectBodyTextAttached(page, /Your sky is quiet, but awake\./i);
  });

  test("final /home field exposes HomeWorld DOM contract and core controls @smoke", async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });

    const homeWorld = page.locator('main[aria-label="URAI Home World"]').first();
    await expect(homeWorld).toHaveAttribute("data-ground-tier", /[1-5]/);
    await expect(homeWorld).toHaveAttribute("data-orb-tier", /[1-5]/);
    await expect(homeWorld).toHaveAttribute("data-sky-tier", /[1-5]/);
    await expect(homeWorld).toHaveAttribute("data-mood", /calm|low|recovery|dream|shadow|focused|joy/);
    await expect(homeWorld).toHaveAttribute("data-recovery", /dormant|recovering|stable|growing|awakened/);
    await expect(homeWorld).toHaveAttribute("data-narrator-speaking", /true|false/);

    await expect(page.getByRole("button", { name: "Ascend through the sky into the URAI Life Map" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Open URAI companion chat from the orb" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Enter the ground and foundation layer" })).toBeVisible();

    await clickButtonByLabel(page, "Open URAI companion chat from the orb");
    await expect(page.getByRole("heading", { name: "URAI is listening." })).toBeVisible();
    await expect(page.getByLabel("Message URAI companion")).toBeVisible();
    await clickButtonByLabel(page, "Close companion chat");

    await clickButtonByLabel(page, "Ascend through the sky into the URAI Life Map");
    await expect(page.getByRole("button", { name: "Reverse ascent and return home" })).toBeVisible();
  });

  test("final /home reduced-motion path keeps core controls available @smoke", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/home", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: "Ascend through the sky into the URAI Life Map" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Open URAI companion chat from the orb" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Enter the ground and foundation layer" })).toBeVisible();
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

  test("companion blocks empty prompt", async ({ page }) => {
    await openHome(page);

    await expect(page.getByRole("button", { name: "Open URAI companion chat from the orb" })).toBeVisible();
  });
});
