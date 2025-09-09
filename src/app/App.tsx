
import React, { useState } from "react";
import InvestorOnboardingWizard from "@/components/InvestorOnboardingWizard";
import OrgDashboard from "@/components/OrgDashboard";
import { OrgProvider } from "@/components/OrgDashboard";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import ResumableUpload from "@/components/ResumableUpload";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default function App() {
  const [user, setUser] = useState(null);

  const handleOnboardingComplete = ({ user }) => {
    setUser(user);
  };

  return (
    <OrgProvider>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Investor Portal</h1>
        <ResumableUpload />
        {!user ? (
          <InvestorOnboardingWizard onComplete={handleOnboardingComplete} />
        ) : (
          <OrgDashboard dashboards={{ org1: <div>Dashboard for Org 1</div>, org2: <div>Dashboard for Org 2</div> }} />
        )}
      </div>
    </OrgProvider>
  );
}
