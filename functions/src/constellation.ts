import { onCall } from "firebase-functions/v2";
import { logger } from "firebase-functions/v2";

/**
 * Placeholder functions for v7-v11 features
 * These will be implemented in subsequent phases
 */

// V7 Social: Constellation rooms (placeholder)
export const createConstellationRoom = onCall(async (request) => {
  logger.info("createConstellationRoom called - placeholder implementation");
  throw new Error("V7 feature not yet implemented");
});

export const joinRoom = onCall(async (request) => {
  logger.info("joinRoom called - placeholder implementation");
  throw new Error("V7 feature not yet implemented");
});

export const leaveRoom = onCall(async (request) => {
  logger.info("leaveRoom called - placeholder implementation");
  throw new Error("V7 feature not yet implemented");
});

export const sendMessage = onCall(async (request) => {
  logger.info("sendMessage called - placeholder implementation");
  throw new Error("V7 feature not yet implemented");
});

export const moderateRoom = onCall(async (request) => {
  logger.info("moderateRoom called - placeholder implementation");
  throw new Error("V7 feature not yet implemented");
});