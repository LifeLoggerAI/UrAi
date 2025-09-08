
import React, { useState } from "react";
import InvestorOnboardingWizard from "./roadmap/InvestorOnboardingWizard";
import OrgDashboard from "./roadmap/OrgDashboard";
import { OrgProvider } from "./roadmap/OrgDashboard";

export default function App() {
  const [user, setUser] = useState(null);

  const handleOnboardingComplete = ({ user }) => {
    setUser(user);
  };

  return (
    <OrgProvider>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Investor Portal</h1>
        {!user ? (
          <InvestorOnboardingWizard onComplete={handleOnboardingComplete} />
        ) : (
          <OrgDashboard dashboards={{ org1: <div>Dashboard for Org 1</div>, org2: <div>Dashboard for Org 2</div> }} />
        )}
      </div>
    </OrgProvider>
  );
}
