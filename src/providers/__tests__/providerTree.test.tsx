import { screen } from "@testing-library/react";
import AppProviders from "@/app/providers";
import { renderWithUraiProviders, mockFirebaseUnavailable, mockLocalStorage } from "@/test/testUtils";

function Child() {
  return <div>provider child</div>;
}

describe("provider tree", () => {
  it("renders the full app provider tree", () => {
    renderWithUraiProviders(<AppProviders><Child /></AppProviders>);
    expect(screen.getByText("provider child")).toBeInTheDocument();
  });

  it("renders without Firebase config", () => {
    mockFirebaseUnavailable();
    renderWithUraiProviders(<AppProviders><Child /></AppProviders>);
    expect(screen.getByText("provider child")).toBeInTheDocument();
  });

  it("recovers from malformed localStorage JSON", () => {
    mockLocalStorage({ "urai.local.profile": "not-json" });
    renderWithUraiProviders(<AppProviders><Child /></AppProviders>);
    expect(screen.getByText("provider child")).toBeInTheDocument();
  });
});
