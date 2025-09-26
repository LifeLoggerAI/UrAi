import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";

import RootLoading from "@/app/loading";
import HomeLoading from "@/app/home/loading";
import OnboardingLoading from "@/app/onboarding/loading";
import NarratorLoading from "@/app/narrator/loading";
import CognitiveMirrorLoading from "@/app/cognitive-mirror/loading";
import LifeMapLoading from "@/app/life-map/loading";
import JournalLoading from "@/app/journal/loading";
import ProfileAndPrivacyLoading from "@/app/profile-and-privacy/loading";
import RecordLoading from "@/app/record/loading";
import RitualsAndScrollsLoading from "@/app/rituals-and-scrolls/loading";
import StatusLoading from "@/app/status/loading";
import SupportLoading from "@/app/support/loading";

import RootError from "@/app/error";
import HomeError from "@/app/home/error";
import OnboardingError from "@/app/onboarding/error";
import NarratorError from "@/app/narrator/error";
import CognitiveMirrorError from "@/app/cognitive-mirror/error";
import LifeMapError from "@/app/life-map/error";
import JournalError from "@/app/journal/error";
import ProfileAndPrivacyError from "@/app/profile-and-privacy/error";
import RecordError from "@/app/record/error";
import RitualsAndScrollsError from "@/app/rituals-and-scrolls/error";
import StatusError from "@/app/status/error";
import SupportError from "@/app/support/error";

import {
  trackRouteLoadStart,
  trackRouteLoadComplete,
  captureRouteError,
  trackInteraction,
} from "@/lib/telemetry";

jest.mock("@/lib/telemetry", () => ({
  trackRouteLoadStart: jest.fn(),
  trackRouteLoadComplete: jest.fn(),
  captureRouteError: jest.fn(),
  trackInteraction: jest.fn(),
}));

type LoadingCase = {
  route: string;
  Component: () => ReactElement;
};

type ErrorCase = {
  route: string;
  Component: ({ error, reset }: { error: Error; reset: () => void }) => ReactElement;
  secondaryLabel: string;
};

const loadingCases: LoadingCase[] = [
  { route: "root", Component: RootLoading },
  { route: "home", Component: HomeLoading },
  { route: "onboarding", Component: OnboardingLoading },
  { route: "narrator", Component: NarratorLoading },
  { route: "cognitive-mirror", Component: CognitiveMirrorLoading },
  { route: "life-map", Component: LifeMapLoading },
  { route: "journal", Component: JournalLoading },
  { route: "profile-and-privacy", Component: ProfileAndPrivacyLoading },
  { route: "record", Component: RecordLoading },
  { route: "rituals-and-scrolls", Component: RitualsAndScrollsLoading },
  { route: "status", Component: StatusLoading },
  { route: "support", Component: SupportLoading },
];

const errorCases: ErrorCase[] = [
  { route: "root", Component: RootError, secondaryLabel: "Visit support" },
  { route: "home", Component: HomeError, secondaryLabel: "Open life map" },
  { route: "onboarding", Component: OnboardingError, secondaryLabel: "Go to home" },
  { route: "narrator", Component: NarratorError, secondaryLabel: "View journal" },
  { route: "cognitive-mirror", Component: CognitiveMirrorError, secondaryLabel: "View status" },
  { route: "life-map", Component: LifeMapError, secondaryLabel: "Return home" },
  { route: "journal", Component: JournalError, secondaryLabel: "Visit support" },
  { route: "profile-and-privacy", Component: ProfileAndPrivacyError, secondaryLabel: "Contact support" },
  { route: "record", Component: RecordError, secondaryLabel: "Support options" },
  { route: "rituals-and-scrolls", Component: RitualsAndScrollsError, secondaryLabel: "Check status" },
  { route: "status", Component: StatusError, secondaryLabel: "Message support" },
  { route: "support", Component: SupportError, secondaryLabel: "View status" },
];

describe("route loading boundaries", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it.each(loadingCases)("emits telemetry for %s loading", ({ route, Component }) => {
    const { unmount } = render(<Component />);

    const loadStartMock = trackRouteLoadStart as jest.Mock;
    expect(loadStartMock.mock.calls.some(([calledRoute]) => calledRoute === route)).toBe(true);

    unmount();

    const loadCompleteMock = trackRouteLoadComplete as jest.Mock;
    expect(loadCompleteMock.mock.calls.some(([calledRoute]) => calledRoute === route)).toBe(true);
  });
});

describe("route error boundaries", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it.each(errorCases)("logs telemetry for %s errors", ({ route, Component, secondaryLabel }) => {
    const testError = new Error("boom");
    const reset = jest.fn();

    render(<Component error={testError} reset={reset} />);

    const captureMock = captureRouteError as jest.Mock;
    expect(captureMock.mock.calls.some(([calledRoute, err]) => calledRoute === route && err === testError)).toBe(true);

    const retryButton = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(retryButton);

    expect(reset).toHaveBeenCalled();

    const interactionMock = trackInteraction as jest.Mock;
    expect(
      interactionMock.mock.calls.some(([action, metadata]) => action === "route_error_retry" && metadata?.route === route),
    ).toBe(true);

    const secondaryLink = screen.getByRole("link", { name: secondaryLabel });
    fireEvent.click(secondaryLink);

    expect(
      interactionMock.mock.calls.some(
        ([action, metadata]) => action === "route_error_navigation" && metadata?.route === route,
      ),
    ).toBe(true);
  });
});
