# Life Map WebXR implementation plan

Goal: add a Quest-compatible spatial entry point to the existing Life Map without breaking the normal browser view.

Planned behavior:

- Keep the current 2D Life Map as the default fallback.
- Detect browser support for immersive WebXR.
- Show an Enter Spatial Life Map button only when the browser reports support.
- Start the immersive mode from a user gesture.
- Attach the immersive session to the existing React Three Fiber renderer.
- Return to the normal page when the immersive session ends.

Validation:

- Open the Life Map in Meta Quest Browser.
- Confirm the spatial button appears.
- Enter immersive mode from the button.
- Confirm stars, constellations, and focus card behavior still work in normal browser mode.
