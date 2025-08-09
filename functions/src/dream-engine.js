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
exports.updateDreamConstellation = exports.generateDreamNarration = exports.generateDreamSymbols = exports.detectDreamSignal = void 0;
var firestore_1 = require("firebase-functions/v2/firestore");
var scheduler_1 = require("firebase-functions/v2/scheduler");
var v2_1 = require("firebase-functions/v2");
var admin = require("firebase-admin");
// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
/**
 * Daily job to detect probable dream periods from user data.
 * Placeholder function.
 */
exports.detectDreamSignal = (0, scheduler_1.onSchedule)('00 04 * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info('Running daily dream signal detection job.');
        // In a real implementation:
        // 1. Query for all users.
        // 2. Analyze motion, screen-off time, and ambient audio from the last 24 hours.
        // 3. If a likely sleep/dream period is found, create a `dreamEvents` document.
        return [2 /*return*/];
    });
}); });
/**
 * Generates symbolic tags for a dream based on pre-sleep context.
 * Placeholder function.
 */
exports.generateDreamSymbols = (0, firestore_1.onDocumentCreated)('dreamEvents/{dreamId}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var dreamData;
    var _a;
    return __generator(this, function (_b) {
        dreamData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
        v2_1.logger.info("Generating dream symbols for dream: ".concat(event.params.dreamId), dreamData);
        // In a real implementation:
        // 1. Look at user's emotional state, voice notes, and behaviors before the dream.
        // 2. Use an AI model to generate relevant `dreamSymbolTags`.
        // 3. Update the `dreamEvents` document with the tags.
        return [2 /*return*/];
    });
}); });
/**
 * Auto-writes a poetic narration for a dream replay.
 * Placeholder function.
 */
exports.generateDreamNarration = (0, firestore_1.onDocumentUpdated)('dreamEvents/{dreamId}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var after;
    var _a, _b;
    return __generator(this, function (_c) {
        after = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after.data();
        // Generate narration only if tags are present and narration is missing.
        if (((_b = after === null || after === void 0 ? void 0 : after.dreamSymbolTags) === null || _b === void 0 ? void 0 : _b.length) > 0 && !after.dreamNarrationText) {
            v2_1.logger.info("Generating dream narration for dream: ".concat(event.params.dreamId));
            // In a real implementation:
            // 1. Use an AI model to write a short, poetic reflection based on the symbols.
            // 2. Update the `dreamNarrationText` field in the document.
        }
        return [2 /*return*/];
    });
}); });
/**
 * Aggregates weekly dream patterns into a constellation.
 * Placeholder function.
 */
exports.updateDreamConstellation = (0, scheduler_1.onSchedule)('every sunday 05:00', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info('Running weekly dream constellation update job.');
        // In a real implementation:
        // 1. For each user, query all `dreamEvents` from the past week.
        // 2. Identify dominant symbols and the overall emotional arc.
        // 3. Create or update the `dreamConstellations` document for that week.
        return [2 /*return*/];
    });
}); });
