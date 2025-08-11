
export async function askLLM(prompt: string): Promise<string> {
  // Try Gemini
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    if (res.ok) {
      const json = await res.json();
      const out = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (out) return out;
    }
    throw new Error('Gemini failed');
  } catch {}

  // Fallback: OpenAI
  const oai = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });
  const json = await oai.json();
  return json?.choices?.[0]?.message?.content ?? '';
}
