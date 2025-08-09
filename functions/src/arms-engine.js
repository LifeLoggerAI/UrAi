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
exports.scheduleDailyArmsSummary = exports.detectEmotionalOverload = exports.calcFollowThroughScore = exports.ingestArmSensors = void 0;
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
 * Ingests a batch of gesture and tone data related to arms/actions.
 * This is a placeholder for a complex data ingestion pipeline.
 */
exports.ingestArmSensors = (0, https_1.onCall)(function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var uid;
    var _a;
    return __generator(this, function (_b) {
        uid = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid;
        if (!uid) {
            throw new https_1.HttpsError('unauthenticated', 'User must be authenticated.');
        }
        v2_1.logger.info("Ingesting arm/action sensor data for user ".concat(uid, "."));
        // This function would process raw gesture, tone, and app usage data.
        // It would then write to /relationalGestures and aggregate into /armMetrics.
        return [2 /*return*/, { success: true }];
    });
}); });
/**
 * Calculates action follow-through score.
 * Triggered when armMetrics are updated. Placeholder.
 */
exports.calcFollowThroughScore = (0, firestore_1.onDocumentWritten)('armMetrics/{uid}/{dateKey}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info("Calculating follow-through score for user ".concat(event.params.uid, "."));
        // Logic to call OpenAI 'ActionFollowthroughAI' and update score.
        return [2 /*return*/];
    });
}); });
/**
 * Detects emotional overload from interaction patterns.
 * Triggered when armMetrics are updated. Placeholder.
 */
exports.detectEmotionalOverload = (0, firestore_1.onDocumentWritten)('armMetrics/{uid}/{dateKey}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    var _a;
    return __generator(this, function (_b) {
        data = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
        if ((data === null || data === void 0 ? void 0 : data.emotionalEffortLoad) > 70 && (data === null || data === void 0 ? void 0 : data.connectionEchoScore) < 40) {
            v2_1.logger.info("Emotional overload detected for user ".concat(event.params.uid, "."));
            // Logic to create narratorInsights and push a notification.
        }
        return [2 /*return*/];
    });
}); });
/**
 * Aggregates arm metrics and generates a daily summary.
 * This is a placeholder.
 */
exports.scheduleDailyArmsSummary = (0, scheduler_1.onSchedule)('30 2 * * *', // 02:30 UTC daily
function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info('Running daily arms summary job.');
        // For every user:
        // 1. Aggregate yesterday’s armMetrics.
        // 2. Write a summary document.
        // 3. Create a notification: “Your interaction & action pulse for {{date}} is ready.”
        return [2 /*return*/];
    });
}); });
