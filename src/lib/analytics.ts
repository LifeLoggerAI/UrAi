export async function trackEvent(type: string, payload: any = {}, userId?: string) {
  const res = await fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload, userId })
  });
  if (!res.ok) throw new Error(`track ${type} failed: ${res.status}`);
}
