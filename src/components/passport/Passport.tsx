'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import './Passport.css';

const PERMISSIONS = [
  'Audio', 'Location', 'Motion', 'Calendar', 'Contacts', 'Gmail', 
  'Photos / Camera', 'Device Activity', 'Health Signals', 'Notifications'
];

const ToggleSwitch = ({ label, isEnabled, onToggle }: { label: string; isEnabled: boolean; onToggle: (label: string) => void; }) => (
    <div className="permissionItem">
        <span className="label">{label}</span>
        <label className="toggleSwitch">
            <input type="checkbox" checked={isEnabled} onChange={() => onToggle(label)} />
            <span className="slider"></span>
        </label>
    </div>
);

export default function Passport() {
    const [permissions, setPermissions] = useState<Record<string, boolean>>(
        PERMISSIONS.reduce((acc, p) => ({ ...acc, [p]: false }), {})
    );

    const handleToggle = (label: string) => {
        setPermissions(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const allEnabled = useMemo(() => Object.values(permissions).every(Boolean), [permissions]);
    const noneEnabled = useMemo(() => Object.values(permissions).every(p => !p), [permissions]);

    const setAll = (enabled: boolean) => {
        setPermissions(PERMISSIONS.reduce((acc, p) => ({ ...acc, [p]: enabled }), {}));
    }

  return (
    <div className="passportScreen">
      <nav className="passportNav">
        <Link href="/home">Home</Link>
        <Link href="/galaxy">Galaxy</Link>
        <Link href="/replay">Replay</Link>
      </nav>

      <div className="passportContainer">
        <div className="passportCard identityField">
            <h1>URAI Passport</h1>
            <p>This is your private, user-owned identity field. You are in control.</p>
            <div className="fieldId">Private Field ID: a7b3-c4d9-e5f1-a2b3-c4d5e6f7a8b9</div>
        </div>

        <div className="passportCard permissionConstellation">
            <h2>Permission Constellation</h2>
            <p>Grant URAI permission to sense different aspects of your digital and physical world. You can change these at any time.</p>

            <div className="consentControls">
                <div className="controlsHeader">
                     <h3>Manage Permissions</h3>
                    <div>
                        <button onClick={() => setAll(true)} disabled={allEnabled}>Select All</button>
                        <button onClick={() => setAll(false)} disabled={noneEnabled}>Pause All</button>
                    </div>
                </div>
                <div className="permissionGrid">
                    {PERMISSIONS.map(p => (
                        <ToggleSwitch key={p} label={p} isEnabled={permissions[p]} onToggle={handleToggle} />
                    ))}
                </div>
            </div>
        </div>

        <div className="passportCard dataOwnershipPanel">
            <h2>Your Field, Your Data</h2>
            <p>URAI is built on the principle of digital self-sovereignty. You own your data, always. Permissions can be revoked at any time, and we will offer tools to export and manage your entire field.</p>
        </div>

        <div className="passportCard vaultActions">
            <h2>Vault Actions</h2>
            <div className="actionButtons">
                <button className="actionButton">Export My Field</button>
                <button className="actionButton">Review Permissions</button>
                <button className="actionButton" onClick={() => setAll(false)}>Pause All Collection</button>
            </div>
        </div>
      </div>
    </div>
  );
}
