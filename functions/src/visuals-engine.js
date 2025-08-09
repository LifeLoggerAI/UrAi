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
exports.fadeOldShadows = exports.triggerConstellationGlow = void 0;
var firestore_1 = require("firebase-functions/v2/firestore");
var scheduler_1 = require("firebase-functions/v2/scheduler");
var v2_1 = require("firebase-functions/v2");
var admin = require("firebase-admin");
// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
/**
 * Triggers a constellation glow effect when a significant recovery event occurs.
 * This is a placeholder for a function that would be triggered by a new document in Firestore.
 * Trigger: onCreate /recoveryBlooms/{uid}/{bloomId}
 */
exports.triggerConstellationGlow = (0, firestore_1.onDocumentCreated)('recoveryBlooms/{uid}/{bloomId}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var bloom;
    var _a;
    return __generator(this, function (_b) {
        bloom = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
        v2_1.logger.info("Constellation glow triggered for user ".concat(event.params.uid), bloom);
        // In a real implementation:
        // 1. Check if bloom.bloomType is "insight" or related to a dream.
        // 2. Query for a relevant /emotionEvents document to update.
        // 3. Set emotionEvents.constellationGlow = true to trigger a frontend effect.
        return [2 /*return*/];
    });
}); });
/**
 * Scheduled daily function to fade out social silhouettes that have not been interacted with.
 * This is a placeholder.
 */
exports.fadeOldShadows = (0, scheduler_1.onSchedule)('00 05 * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    var thirtyDaysAgo;
    return __generator(this, function (_a) {
        v2_1.logger.info('Running daily job to fade old social shadows.');
        thirtyDaysAgo = admin.firestore.Timestamp.fromMillis(Date.now() - 30 * 24 * 60 * 60 * 1000);
        // In a real application, this function would:
        // 1. Query all socialOverlays collections.
        // 2. For each user, find overlays where lastInteraction < thirtyDaysAgo.
        // 3. Update those documents to set silhouetteVisible = false.
        // This is a complex operation that would require iterating through all users.
        return [2 /*return*/];
    });
}); });
