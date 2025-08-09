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
exports.linkTelemetryToMood = exports.calculateOverstimulationScore = exports.processTelemetryEvent = void 0;
var firestore_1 = require("firebase-functions/v2/firestore");
var v2_1 = require("firebase-functions/v2");
var admin = require("firebase-admin");
// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
/**
 * Processes new telemetry events and aggregates them into a daily summary.
 * Placeholder function.
 */
exports.processTelemetryEvent = (0, firestore_1.onDocumentCreated)('telemetryEvents/{eventId}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var eventData;
    var _a;
    return __generator(this, function (_b) {
        eventData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
        v2_1.logger.info("Processing telemetry event: ".concat(event.params.eventId), eventData);
        // In a real implementation:
        // 1. Get the userId and timestamp from the event.
        // 2. Determine the correct daily summary document.
        // 3. Update aggregates like totalScreenTimeMs, numNotifications, etc.
        // 4. Use a transaction to ensure atomic updates.
        return [2 /*return*/];
    });
}); });
/**
 * Calculates an overstimulation score based on daily telemetry.
 * Placeholder function.
 */
exports.calculateOverstimulationScore = (0, firestore_1.onDocumentUpdated)('dailyTelemetrySummary/{summaryId}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var summaryData;
    var _a, _b;
    return __generator(this, function (_c) {
        summaryData = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
        v2_1.logger.info("Calculating overstimulation for summary: ".concat(event.params.summaryId), summaryData);
        // In a real implementation:
        // 1. Analyze screen time, notification density, and app switching.
        // 2. Calculate a score (e.g., 0-1).
        // 3. Set digitalFatigueLevel based on the score.
        // 4. If score > threshold, trigger a narratorInsight.
        return [2 /*return*/];
    });
}); });
/**
 * Links telemetry patterns to mood events.
 * Placeholder function.
 */
exports.linkTelemetryToMood = (0, firestore_1.onDocumentUpdated)('dailyTelemetrySummary/{summaryId}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var summaryData;
    var _a, _b;
    return __generator(this, function (_c) {
        summaryData = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
        v2_1.logger.info("Linking telemetry to mood for summary: ".concat(event.params.summaryId));
        // In a real implementation:
        // 1. Query for mood events on the same day.
        // 2. Find correlations between high-stress telemetry and negative moods.
        // 3. Update the `emotionLinkedInsights` map in the summary document.
        return [2 /*return*/];
    });
}); });
