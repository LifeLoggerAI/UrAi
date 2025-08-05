import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const genkitInstance = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});

export const ai = genkitInstance;
export default genkitInstance;
