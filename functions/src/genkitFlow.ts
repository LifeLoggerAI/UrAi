'use server';
// Import the functions you need from the SDKs you need
import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import { z } from 'zod';

// import the Genkit and Google AI plugin libraries
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Initialize Genkit
genkit({
  plugins: [googleAI()],
});

const helloFlow = genkit.defineFlow(
  {
    name: 'helloFlow',
    inputSchema: z.string(),
    outputSchema: z.any(),
  },
  async name => {
    // make a generation request
    const { text } = await genkit.generate({
      prompt: `Hello Gemini, my name is ${name}`,
      model: gemini15Flash, // explicitly use the model defined in genkit init
    });
    logger.info(text);
    return { response: text }; // Return the generated text
  }
);

// Expose the helloFlow as an HTTPS callable function
export const hello = onCall(async request => {
  const name = request.data.name;

  if (!name) {
    throw new Error('Name parameter is required.');
  }

  // Call the Genkit flow
  const result = await helloFlow(name);

  // Send the response back
  return result;
});
