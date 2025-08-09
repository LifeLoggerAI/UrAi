import { onCall } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";

/**
 * Simple hello world callable function for testing purposes
 */
export const helloWorld = onCall(async (request) => {
  const name = request.data?.name || "World";
  const message = `Hello, ${name}!`;

  logger.info(`Said hello to ${name}`);
  
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
