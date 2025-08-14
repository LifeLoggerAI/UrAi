// This file is safe to import on the client, as it exports a stub.
// The actual Genkit AI configuration is in `genkit.server.ts`.

export const ai = {
  definePrompt: (..._args: any[]) => {
    throw new Error(
      'Genkit AI functions are server-only. Do not import `genkit.server.ts` in client components.'
    );
  },
  defineFlow: (..._args: any[]) => {
    throw new Error(
      'Genkit AI functions are server-only. Do not import `genkit.server.ts` in client components.'
    );
  },
  run: async (..._args: any[]) => {
    throw new Error(
      'Genkit server stub called from client. Wire this on server only.'
    );
  },
  generate: async (..._args: any[]) => {
    throw new Error(
      'Genkit server stub called from client. Wire this on server only.'
    );
  },
  embed: async (..._args: any[]) => {
    throw new Error(
      'Genkit server stub called from client. Wire this on server only.'
    );
  },
};
