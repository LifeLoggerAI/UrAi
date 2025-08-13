// Temporary stub to satisfy imports during client build
export const ai = {
  definePrompt: (..._args: any[]) => {
    throw new Error("Genkit AI functions are server-only. Do not import in client components.");
  },
  defineFlow: (..._args: any[]) => {
    throw new Error("Genkit AI functions are server-only. Do not import in client components.");
  },
};

export const runGemini = async (..._args: any[]) => {
  throw new Error("Genkit server stub called from client. Wire this on server only.");
};

export function ensureServer() {
  if (typeof window !== 'undefined') {
    throw new Error('Genkit can only be used on the server');
  }
}
