import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if(!admin.apps.length) {
    admin.initializeApp();
}

// Marketing Endpoints
export { writeLead } from "./marketing";

// AI Core Triggers
export { onInsightCreate } from "./triggers/onInsightCreate";
export { onUserCreate } from "./triggers/onUserCreate";

// Scheduled Jobs
export { computeDailyForecasts, weeklyDigest } from './jobs';

// Test/Debug
export { seedDemo } from "./dev/seed";
export { testRunForecast } from "./dev/testRunForecast";
