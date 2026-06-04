import { render, screen } from "@testing-library/react";
import { LayeredGenesisScene } from "@/components/genesis/LayeredGenesisScene";
import { UraiCompanionShell } from "@/components/companion/UraiCompanionShell";
import { PublicDemoShell } from "@/components/demo/PublicDemoShell";
import { MaintenanceMode } from "@/components/system/MaintenanceMode";
import AppProviders from "@/app/providers";

beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}

describe("core component smoke", () => {
  it("renders LayeredGenesisScene without crashing", () => {
    render(<Wrapper><LayeredGenesisScene /></Wrapper>);
    expect(screen.getByLabelText(/Open Life Map/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Open URAI Passport/i)).toBeInTheDocument();
  });

  it("renders Companion shell open with close control", () => {
    render(<Wrapper><UraiCompanionShell isOpen onClose={jest.fn()} /></Wrapper>);
    expect(screen.getAllByLabelText(/Close Companion/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/debug/i)).not.toBeInTheDocument();
  });

  it("renders public demo shell with sample disclosure", () => {
    render(<Wrapper><PublicDemoShell /></Wrapper>);
    expect(screen.getByText(/Sample Data Demo/i)).toBeInTheDocument();
    expect(screen.getAllByText(/sample data/i).length).toBeGreaterThan(0);
  });

  it("renders maintenance mode without technical details", () => {
    render(<MaintenanceMode />);
    expect(screen.getByText(/URAI is being tuned/i)).toBeInTheDocument();
    expect(screen.queryByText(/stack|exception|firebase|token/i)).not.toBeInTheDocument();
  });
});
