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
exports.triggerNarratorIdentityInsight = exports.inferAvatarFeatures = exports.dailyAvatarUpdate = void 0;
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
 * Daily job to update the user's avatar based on collected data.
 * Placeholder function.
 */
exports.dailyAvatarUpdate = (0, scheduler_1.onSchedule)('00 03 * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info('Running daily avatar update job.');
        // In a real implementation:
        // 1. Query for all users.
        // 2. For each user, increment `dayOnSystem`.
        // 3. Trigger the `inferAvatarFeatures` function.
        // 4. Advance the `featureStage` if certain data thresholds are met.
        return [2 /*return*/];
    });
}); });
/**
 * Infers new avatar features from recent user data.
 * Placeholder function.
 */
exports.inferAvatarFeatures = (0, https_1.onCall)(function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var uid;
    var _a;
    return __generator(this, function (_b) {
        uid = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid;
        if (!uid) {
            throw new https_1.HttpsError('unauthenticated', 'User must be authenticated.');
        }
        v2_1.logger.info("Inferring avatar features for user ".concat(uid, "."));
        // In a real implementation:
        // 1. Analyze recent `cameraCaptures`, `voiceEvents`, and text entries.
        // 2. Use ML models or heuristics to infer skin tone, gender signals, etc.
        // 3. Update the `avatarArtDetails` in the `avatarIdentityProgress` document.
        return [2 /*return*/, { success: true }];
    });
}); });
/**
 * Triggers a narrator insight when the avatar's feature stage changes.
 * Placeholder function.
 */
exports.triggerNarratorIdentityInsight = (0, firestore_1.onDocumentUpdated)('avatarIdentityProgress/{userId}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var before, after;
    var _a, _b;
    return __generator(this, function (_c) {
        before = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before.data();
        after = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after.data();
        if ((before === null || before === void 0 ? void 0 : before.featureStage) !== (after === null || after === void 0 ? void 0 : after.featureStage)) {
            v2_1.logger.info("Avatar feature stage changed for user ".concat(event.params.userId, " to ").concat(after.featureStage, "."));
            // In a real implementation:
            // 1. Generate a relevant reflection text based on the new stage.
            // 2. Create a new document in `narratorIdentityMoments`.
        }
        return [2 /*return*/];
    });
}); });
