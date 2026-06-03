import { render, screen } from "@testing-library/react";
import { LayeredGenesisScene } from "@/components/genesis/LayeredGenesisScene";
import { UraiCompanionShell } from "@/components/companion/UraiCompanionShell";
import { PublicDemoShell } from "@/components/demo/PublicDemoShell";
import { MaintenanceMode } from "@/components/system/MaintenanceMode";
import { UraiDemoProvider } from "@/providers/UraiDemoProvider";
import { UraiFeatureFlagProvider } from "@/providers/UraiFeatureFlagProvider";

function Wrapper({ children }: { children: React.ReactNode }) {
  return <UraiFeatureFlagProvider><UraiDemoProvider initialMode="public_demo" profileId="public">{children}</UraiDemoProvider></UraiFeatureFlagProvider>;
}

describe("core component smoke", () => {
  it("renders LayeredGenesisScene without crashing", () => {
    render(<Wrapper><LayeredGenesisScene /></Wrapper>);
    expect(screen.getByLabelText(/Open Life Map/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Open URAI Passport/i)).toBeInTheDocument();
  });

  it("renders Companion shell open with close control", () => {
    render(<Wrapper><UraiCompanionShell isOpen onClose={jest.fn()} /></Wrapper>);
    expect(screen.getByLabelText(/Close Companion/i)).toBeInTheDocument();
    expect(screen.queryByText(/debug/i)).not.toBeInTheDocument();
  });

  it("renders public demo shell with sample disclosure", () => {
    render(<Wrapper><PublicDemoShell /></Wrapper>);
    expect(screen.getByText(/Sample Demo/i)).toBeInTheDocument();
    expect(screen.getByText(/sample data/i)).toBeInTheDocument();
  });

  it("renders maintenance mode without technical details", () => {
    render(<MaintenanceMode />);
    expect(screen.getByText(/URAI is being tuned/i)).toBeInTheDocument();
    expect(screen.queryByText(/stack|exception|firebase|token/i)).not.toBeInTheDocument();
  });
});
