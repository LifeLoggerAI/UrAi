
import { getAuth } from "firebase/auth";

export async function runDummyUser(userId = "test-user-001", persona = "gentle") {
  const idToken = await getAuth().currentUser?.getIdToken();
  const res = await fetch("/api/run-dummy-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {})
    },
    body: JSON.stringify({ userId, persona })
  });
  if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.error || "dummy failed");
  }
  return (await res.json()) as {
    ok: boolean;
    userId: string;
    persona: string;
    events: any[];
    tts: { url: string; path: string }[];
  };
}
