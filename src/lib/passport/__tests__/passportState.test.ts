
import {
  createDefaultPassportState,
  getLayerStatus,
  isLayerOpen,
  openLayer,
  closeLayer,
  importPassportState,
} from "../passportState";
import { passportLayerRegistry } from "../passportLayerRegistry";

describe("passportState", () => {
  it("should create a default state with all sensitive layers closed", () => {
    const state = createDefaultPassportState();
    for (const layerId in passportLayerRegistry) {
      const definition = passportLayerRegistry[layerId as keyof typeof passportLayerRegistry];
      if (definition.sensitivity === "high" || definition.sensitivity === "protected") {
        expect(isLayerOpen(state, definition.id)).toBe(false);
      }
    }
    expect(isLayerOpen(state, "system")).toBe(true);
  });

  it("should open and close a layer", () => {
    let state = createDefaultPassportState();
    state = openLayer(state, "notifications");
    expect(isLayerOpen(state, "notifications")).toBe(true);
    state = closeLayer(state, "notifications");
    expect(isLayerOpen(state, "notifications")).toBe(false);
  });

  it("should not open a blocked layer", () => {
    let state = createDefaultPassportState();
    state = openLayer(state, "admin");
    expect(isLayerOpen(state, "admin")).toBe(false);
  });

  it("should handle malformed import state gracefully", () => {
    const malformedState = { foo: "bar" };
    const state = importPassportState(malformedState);
    expect(state.initialized).toBe(true);
    expect(Object.keys(state.layers).length).toBe(Object.keys(passportLayerRegistry).length);
  });

  it('should have shadow, legacy, export, and passive_data closed by default', () => {
    const state = createDefaultPassportState();
    expect(isLayerOpen(state, 'shadow')).toBe(false);
    expect(isLayerOpen(state, 'legacy')).toBe(false);
    expect(isLayerOpen(state, 'export')).toBe(false);
    expect(isLayerOpen(state, 'passive_data')).toBe(false);
  })
});
