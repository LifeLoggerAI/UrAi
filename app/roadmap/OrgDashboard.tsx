import React from "react";
import { useOrg } from "./OrgProvider";

export default function OrgDashboard({ dashboards }) {
  const { orgs, selectedOrg, setSelectedOrg } = useOrg();
  return (
    <div className="mb-6">
      <label className="font-bold mr-2">Organization:</label>
      <select value={selectedOrg?.id || ""} onChange={e => setSelectedOrg(orgs.find(o => o.id === e.target.value))}>
        {orgs.map(org => (
          <option key={org.id} value={org.id}>{org.name}</option>
        ))}
      </select>
      <div className="mt-4">
        {/* Render the selected organization's dashboard */}
        {selectedOrg && dashboards[selectedOrg.id]}
      </div>
    </div>
  );
}