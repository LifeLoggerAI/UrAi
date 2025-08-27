
"use client";
import { useState } from "react";

export default function Settings() {
  const [consent, setConsent] = useState({ audio:false, vision:false, location:false, notifications:true });
  return (
    <main className="mx-auto max-w-md p-4 text-white">
      <h1 className="text-2xl mb-4">Permissions</h1>
      {["audio","vision","location","notifications"].map(key => (
        <label key={key} className="flex items-center justify-between p-3 mb-2 bg-white/5 rounded-xl">
          <span className="capitalize">{key}</span>
          <input type="checkbox"
                 checked={(consent as any)[key]}
                 onChange={() => setConsent(c => ({...c, [key]: !(c as any)[key]}))}/>
        </label>
      ))}
      <p className="text-sm text-white/70 mt-4">You can change these anytime. Some features require extra consent.</p>
    </main>
  );
}
