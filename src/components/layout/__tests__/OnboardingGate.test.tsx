import { render, screen } from "@testing-library/react";
import React from "react";

import OnboardingGate from "../OnboardingGate";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const usePathname = jest.requireMock("next/navigation").usePathname as jest.Mock;

jest.mock("../MainLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

describe("OnboardingGate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children directly for onboarding routes", () => {
    usePathname.mockReturnValue("/onboarding");

    render(
      <OnboardingGate>
        <p>Onboarding Content</p>
      </OnboardingGate>
    );

    expect(screen.getByText("Onboarding Content")).toBeInTheDocument();
    expect(screen.queryByTestId("main-layout")).toBeNull();
  });

  it("wraps children with MainLayout for non-onboarding routes", () => {
    usePathname.mockReturnValue("/dashboard");

    render(
      <OnboardingGate>
        <p>Main App</p>
      </OnboardingGate>
    );

    expect(screen.getByTestId("main-layout")).toBeInTheDocument();
    expect(screen.getByText("Main App")).toBeInTheDocument();
  });
});
