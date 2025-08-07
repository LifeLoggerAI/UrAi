import { onCall } from "firebase-functions/v2/https";

/**
 * Simple hello world callable function for testing purposes
 */
export const helloWorld = onCall(async (request) => {
  const name = request.data?.name || "World";
  const message = `Hello, ${name}!`;
  
  return {
    message,
    timestamp: new Date().toISOString()
  };
});

/**
 * Simple utility function for testing
 */
export function greetUser(name: string): string {
  if (!name || name.trim() === '') {
    return 'Hello, World!';
  }
  return `Hello, ${name}!`;
}