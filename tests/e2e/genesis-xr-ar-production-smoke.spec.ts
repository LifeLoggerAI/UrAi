import { expect, test } from "@playwright/test";

async function captureEvidence(page: import("@playwright/test").Page, name: string) {
  await page.screenshot({ fullPage: true, path: `test-results/production-evidence/${name}.png` });
}

test.describe("Genesis XR AR production smoke", () => {
  test("/xr renders support-gated VR and model-based AR preview @production-smoke", async ({ page, request }) => {
    await page.goto("/xr", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Real WebXR gate").first()).toBeVisible();
    await expect(page.getByTestId("xr-capability-panel")).toBeVisible();
    await expect(page.getByText(/AR gated to supported mobile paths/i).first()).toBeVisible();
    await expect(page.getByText(/Real model-based AR entry, no fake canvas button/i).first()).toBeVisible();

    const modelViewer = page.locator("model-viewer");
    await expect(modelViewer).toHaveAttribute("src", "/assets/ar/urai-genesis-orb.gltf");
    await expect(modelViewer).toHaveAttribute("ar-modes", "webxr scene-viewer");

    await expect(page.locator("body").getByText(/universal AR|AR ready|Quest ready/i)).toHaveCount(0);

    const asset = await request.get("/assets/ar/urai-genesis-orb.gltf");
    await expect(asset).toBeOK();
    const model = await asset.json();
    expect(model.asset?.version).toBe("2.0");
    expect(Array.isArray(model.meshes)).toBe(true);

    await captureEvidence(page, "desktop-xr-ar-preview");
  });
});
