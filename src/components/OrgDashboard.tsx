
import React, { useState, useContext, createContext } from "react";
import ResumableUpload from "../../src/app/ResumableUpload";

const OrgContext = createContext(null);

export const useOrg = () => useContext(OrgContext);

export const OrgProvider = ({ children }) => {
  const [orgs, setOrgs] = useState([
    { id: "org1", name: "Organization 1" },
    { id: "org2", name: "Organization 2" },
  ]);
  const [selectedOrg, setSelectedOrg] = useState(orgs[0]);

  const value = { orgs, selectedOrg, setSelectedOrg };

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};

export default function OrgDashboard({ dashboards }) {
  const { orgs, selectedOrg, setSelectedOrg } = useOrg();
  return (
    <div className="mb-6">
      <label className="font-bold mr-2">Organization:</label>
      <select
        value={selectedOrg?.id || ""}
        onChange={(e) =>
          setSelectedOrg(orgs.find((o) => o.id === e.target.value))
        }
      >
        {orgs.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
      <div className="mt-4">
        {/* Render the selected organization's dashboard */}
        {selectedOrg && dashboards[selectedOrg.id]}
        <ResumableUpload />
      </div>
    </div>
  );
}
