import { render, screen, waitFor } from "@testing-library/react";

import { XRSessionButton, XRStatusPanel } from "@/components/xr/XRSessionFoundation";

const setWebGLAvailable = (available: boolean) => {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: jest.fn(() => (available ? ({}) : null)),
  });
};

const setWebXR = (xr: unknown) => {
  Object.defineProperty(navigator, "xr", {
    configurable: true,
    value: xr,
  });
};

const setSecureContext = (secure: boolean) => {
  Object.defineProperty(window, "isSecureContext", {
    configurable: true,
    value: secure,
  });
};

describe("WebXR foundation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setWebGLAvailable(true);
    setWebXR(undefined);
    setSecureContext(true);
  });

  it("does not render a fake Enter VR button when immersive-vr is unsupported", async () => {
    setWebXR({
      isSessionSupported: jest.fn(async () => false),
    });

    render(<XRSessionButton renderer={null} />);

    await waitFor(() => {
      expect(screen.getByTestId("xr-vr-fallback")).toBeTruthy();
    });

    expect(screen.queryByTestId("xr-enter-vr")).toBeNull();
    expect(screen.queryByRole("button", { name: /enter vr/i })).toBeNull();
  });

  it("renders Enter VR only when immersive-vr and a renderer are available", async () => {
    setWebXR({
      isSessionSupported: jest.fn(async (mode: string) => mode === "immersive-vr"),
      requestSession: jest.fn(),
    });

    const renderer = { xr: { setSession: jest.fn() } };

    render(<XRSessionButton renderer={renderer as never} />);

    await waitFor(() => {
      expect(screen.getByTestId("xr-enter-vr")).toBeTruthy();
    });
  });

  it("shows truthful capability copy for browsers without navigator.xr", async () => {
    render(<XRStatusPanel />);

    await waitFor(() => {
      expect(screen.getByText(/does not expose navigator\.xr/i)).toBeTruthy();
    });
  });
});
