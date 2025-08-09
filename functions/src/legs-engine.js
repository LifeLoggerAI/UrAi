"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleDailyLegsSummary = exports.trajectoryForecastJob = exports.detectAvoidancePatterns = exports.calcStabilityMomentum = exports.ingestMovementSensors = void 0;
var https_1 = require("firebase-functions/v2/https");
var firestore_1 = require("firebase-functions/v2/firestore");
var scheduler_1 = require("firebase-functions/v2/scheduler");
var v2_1 = require("firebase-functions/v2");
var admin = require("firebase-admin");
// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
/**
 * Ingests a batch of passive movement sensor data.
 * This is a placeholder for a complex data ingestion pipeline.
 */
exports.ingestMovementSensors = (0, https_1.onCall)(function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var uid;
    var _a;
    return __generator(this, function (_b) {
        uid = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid;
        if (!uid) {
            throw new https_1.HttpsError('unauthenticated', 'User must be authenticated.');
        }
        v2_1.logger.info("Ingesting movement sensor data for user ".concat(uid, "."));
        // This function would process raw GPS, activity, and app usage data.
        // It would then write to /movementPaths and aggregate into /legsMetrics.
        return [2 /*return*/, { success: true }];
    });
}); });
/**
 * Calculates stability and momentum scores.
 * Triggered when legsMetrics are updated. Placeholder.
 */
exports.calcStabilityMomentum = (0, firestore_1.onDocumentWritten)('legsMetrics/{uid}/{dateKey}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info("Calculating stability and momentum for user ".concat(event.params.uid, "."));
        // Logic to call AI prompts 'StabilityPulseMapper' & 'MomentumInferenceEngine'.
        return [2 /*return*/];
    });
}); });
/**
 * Detects avoidance patterns.
 * Triggered when new avoidance events are created. Placeholder.
 */
exports.detectAvoidancePatterns = (0, firestore_1.onDocumentWritten)('avoidanceEvents/{uid}/{eventId}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info("Detecting avoidance patterns for user ".concat(event.params.uid, "."));
        // Logic to aggregate recent events, call 'AvoidancePatternDetector' AI.
        // If score > 60, create narrator insight and push notification.
        return [2 /*return*/];
    });
}); });
/**
 * Generates a weekly behavioral trajectory forecast.
 * This is a placeholder.
 */
exports.trajectoryForecastJob = (0, scheduler_1.onSchedule)('45 04 * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info('Running daily trajectory forecast job for all users.');
        // In a real application, this function would:
        // 1. Query for all users.
        // 2. For each user, get the last 14 days of legsMetrics & movementPaths.
        // 3. Call the 'TrajectoryForecastAI' prompt.
        // 4. Save the forecast to a new document in `narratorInsights`.
        return [2 /*return*/];
    });
}); });
/**
 * Aggregates legs metrics and generates a daily summary.
 * This is a placeholder.
 */
exports.scheduleDailyLegsSummary = (0, scheduler_1.onSchedule)('20 02 * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info('Running daily legs summary job.');
        // For every user:
        // 1. Aggregate yesterday’s legsMetrics.
        // 2. Write a summary document.
        // 3. Create a notification: “Your movement rhythm for {{date}} is ready.”
        return [2 /*return*/];
    });
}); });
