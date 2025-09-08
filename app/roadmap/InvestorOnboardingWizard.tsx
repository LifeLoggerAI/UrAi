
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const steps = ["Profile", "Preferences", "Legal", "Finish"];

export default function InvestorOnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ name: '', email: '', password: '' });
  const [prefs, setPrefs] = useState({});
  const [legal, setLegal] = useState({});
  const [error, setError] = useState(null);

  async function next() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      try {
        const auth = getAuth();
        const { user } = await createUserWithEmailAndPassword(auth, profile.email, profile.password);
        console.log("User created successfully", { user });
        onComplete({ profile, prefs, legal, user });
      } catch (err) {
        setError("Failed to create user. Please try again.");
        console.error(err);
      }
    }
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-2">Investor Onboarding</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">Step {step + 1}: {steps[step]}</div>
      {step === 0 && (
        <div>
          <label>Name: <input onChange={e => setProfile({ ...profile, name: e.target.value })} /></label><br />
          <label>Email: <input type="email" onChange={e => setProfile({ ...profile, email: e.target.value })} /></label><br/>
          <label>Password: <input type="password" onChange={e => setProfile({ ...profile, password: e.target.value })} /></label>
        </div>
      )}
      {step === 1 && (
        <div>
          <label>Notify via Email: <input type="checkbox" checked={prefs.emailNotify} onChange={e => setPrefs({ ...prefs, emailNotify: e.target.checked })} /></label>
        </div>
      )}
      {step === 2 && (
        <div>
          <label>
            <input type="checkbox" checked={legal.accepted} onChange={e => setLegal({ ...legal, accepted: e.target.checked })} />
            Accept NDA & Compliance
          </label>
        </div>
      )}
      {step === 3 && (<div>Onboarding Complete! Click Finish to continue.</div>)}
      <button onClick={next} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">{step < steps.length - 1 ? "Next" : "Finish"}</button>
    </div>
  );
}
