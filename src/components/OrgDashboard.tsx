
import React, { useState, useContext, createContext, Dispatch, SetStateAction } from "react";
import ResumableUpload from "../../src/app/ResumableUpload";

interface Org {
  id: string;
  name: string;
}

interface OrgContextType {
  orgs: Org[];
  selectedOrg: Org | undefined;
  setSelectedOrg: Dispatch<SetStateAction<Org | undefined>>;
}

const OrgContext = createContext<OrgContextType>({
  orgs: [],
  selectedOrg: undefined,
  setSelectedOrg: () => {},
});

export const useOrg = () => useContext(OrgContext);

export const OrgProvider = ({ children }) => {
  const [orgs, setOrgs] = useState<Org[]>([
    { id: "org1", name: "Organization 1" },
    { id: "org2", name: "Organization 2" },
  ]);
  const [selectedOrg, setSelectedOrg] = useState<Org | undefined>(orgs[0]);

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
