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
exports.detectRecoveryBloomOnAuraUpdate = exports.triggerBloom = exports.emotionOverTimeWatcher = exports.updateAuraState = void 0;
var firestore_1 = require("firebase-functions/v2/firestore");
var scheduler_1 = require("firebase-functions/v2/scheduler");
var v2_1 = require("firebase-functions/v2");
var admin = require("firebase-admin");
var uuid_1 = require("uuid");
// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
var db = admin.firestore();
var POSITIVE_EMOTIONS = ['joy', 'calm', 'recovery', 'hopeful', 'curiosity'];
var NEGATIVE_EMOTIONS = [
    'sadness',
    'anger',
    'anxiety',
    'frustration',
    'distressed',
];
/**
 * Maps an emotion and intensity to a visual overlay style.
 * This is a placeholder; a real implementation would have more complex logic.
 * @param {string} emotion The detected emotion.
 * @param {number} intensity The intensity of the emotion (0-100).
 * @return {{color: string, style: string}} The visual properties for the overlay.
 */
function mapEmotionToOverlay(emotion, intensity) {
    var intensityAlpha = 0.5 + (intensity / 100) * 0.5;
    switch (emotion.toLowerCase()) {
        case 'joy':
            return { color: "hsla(120, 80%, 60%, ".concat(intensityAlpha, ")"), style: 'glow' };
        case 'sadness':
            return { color: "hsla(240, 70%, 50%, ".concat(intensityAlpha, ")"), style: 'fog' };
        case 'anger':
            return {
                color: "hsla(0, 90%, 60%, ".concat(intensityAlpha, ")"),
                style: 'flicker',
            };
        case 'calm':
            return { color: "hsla(200, 80%, 70%, ".concat(intensityAlpha, ")"), style: 'glow' };
        case 'anxiety':
            return {
                color: "hsla(60, 80%, 50%, ".concat(intensityAlpha, ")"),
                style: 'flicker',
            };
        default:
            return { color: "hsla(0, 0%, 80%, ".concat(intensityAlpha, ")"), style: 'glow' };
    }
}
/**
 * Maps an emotion to a representative color.
 * Placeholder function.
 * @param {string} emotion The detected emotion.
 * @return {string} A hex color code.
 */
function mapEmotionToColor(emotion) {
    switch (emotion.toLowerCase()) {
        case 'joy':
            return '#7CFC00';
        case 'recovery':
            return '#32CD32';
        case 'sadness':
            return '#1E90FF';
        case 'anger':
            return '#DC143C';
        default:
            return '#A9A9A9';
    }
}
// 1. updateAuraState – triggered on new moodLog
exports.updateAuraState = (0, firestore_1.onDocumentCreated)('users/{uid}/moodLogs/{logId}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var data, uid, overlay, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
                uid = event.params.uid;
                if (!data.emotion || typeof data.intensity !== 'number') {
                    v2_1.logger.warn("Missing emotion or intensity for moodLog ".concat(event.params.logId));
                    return [2 /*return*/];
                }
                overlay = mapEmotionToOverlay(data.emotion, data.intensity);
                v2_1.logger.info("Updating aura for user ".concat(uid, " to emotion: ").concat(data.emotion));
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db.doc("users/".concat(uid, "/auraStates/current")).set({
                        currentEmotion: data.emotion,
                        overlayColor: overlay.color,
                        overlayStyle: overlay.style,
                        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                    }, { merge: true })];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                v2_1.logger.error("Failed to update auraState for user ".concat(uid, ":"), error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// 2. emotionOverTimeWatcher – trend detector (hourly)
exports.emotionOverTimeWatcher = (0, scheduler_1.onSchedule)('every 60 minutes', function () { return __awaiter(void 0, void 0, void 0, function () {
    var usersSnap, promises;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                v2_1.logger.info('Running hourly emotionOverTimeWatcher job.');
                return [4 /*yield*/, db.collection('users').get()];
            case 1:
                usersSnap = _a.sent();
                promises = usersSnap.docs.map(function (userDoc) { return __awaiter(void 0, void 0, void 0, function () {
                    var uid, oneHourAgo, moodLogsQuery, moodLogsSnap, logs, emotionCounts, totalIntensity, dominantEmotion, avgIntensity, cycleType, positiveEmotions, negativeEmotions, cycleId, windowStart, error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                uid = userDoc.id;
                                oneHourAgo = Date.now() - 60 * 60 * 1000;
                                moodLogsQuery = db
                                    .collection("users/".concat(uid, "/moodLogs"))
                                    .where('timestamp', '>=', oneHourAgo);
                                return [4 /*yield*/, moodLogsQuery.get()];
                            case 1:
                                moodLogsSnap = _a.sent();
                                if (moodLogsSnap.empty) {
                                    v2_1.logger.info("No mood logs in the last hour for user ".concat(uid, ". Skipping."));
                                    return [2 /*return*/];
                                }
                                logs = moodLogsSnap.docs.map(function (doc) { return doc.data(); });
                                emotionCounts = {};
                                totalIntensity = 0;
                                logs.forEach(function (log) {
                                    emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1;
                                    totalIntensity += log.intensity;
                                });
                                dominantEmotion = Object.keys(emotionCounts).reduce(function (a, b) {
                                    return emotionCounts[a] > emotionCounts[b] ? a : b;
                                });
                                avgIntensity = totalIntensity / logs.length;
                                cycleType = 'neutral';
                                positiveEmotions = ['joy', 'calm', 'recovery'];
                                negativeEmotions = ['sadness', 'anger', 'anxiety'];
                                if (positiveEmotions.includes(dominantEmotion.toLowerCase()) &&
                                    avgIntensity > 50) {
                                    cycleType = 'recovery';
                                }
                                else if (negativeEmotions.includes(dominantEmotion.toLowerCase()) &&
                                    avgIntensity > 50) {
                                    cycleType = 'strain';
                                }
                                cycleId = (0, uuid_1.v4)();
                                windowStart = oneHourAgo;
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, db.collection("users/".concat(uid, "/emotionCycles")).doc(cycleId).set({
                                        windowStart: windowStart,
                                        dominantEmotion: dominantEmotion,
                                        avgIntensity: avgIntensity,
                                        cycleType: cycleType,
                                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                                    })];
                            case 3:
                                _a.sent();
                                v2_1.logger.info("Created new emotion cycle ".concat(cycleId, " for user ").concat(uid, "."));
                                return [3 /*break*/, 5];
                            case 4:
                                error_2 = _a.sent();
                                v2_1.logger.error("Failed to create emotionCycle for user ".concat(uid, ":"), error_2);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(promises)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// 3. triggerBloom – milestone bloom when recovery detected
exports.triggerBloom = (0, firestore_1.onDocumentCreated)('users/{uid}/emotionCycles/{cycleId}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var cycleData, uid, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cycleData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
                uid = event.params.uid;
                if (!(cycleData.cycleType === 'recovery')) return [3 /*break*/, 4];
                v2_1.logger.info("Recovery detected for user ".concat(uid, ". Triggering bloom."));
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db.collection("users/".concat(uid, "/memoryBlooms")).add({
                        bloomId: (0, uuid_1.v4)(),
                        emotion: cycleData.dominantEmotion || 'recovery',
                        bloomColor: mapEmotionToColor(cycleData.dominantEmotion || 'recovery'),
                        triggeredAt: admin.firestore.FieldValue.serverTimestamp(),
                        description: 'A moment of positive recovery was detected.',
                    })];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                v2_1.logger.error("Failed to create memoryBloom for user ".concat(uid, ":"), error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Detects a positive mood shift and triggers a recovery bloom.
 */
exports.detectRecoveryBloomOnAuraUpdate = (0, firestore_1.onDocumentUpdated)('users/{uid}/auraStates/current', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var before, after, uid, beforeIsNegative, afterIsPositive, bloomId, memoryBloomPayload, insightPayload, error_4;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                before = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before.data();
                after = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after.data();
                uid = event.params.uid;
                if (!(before === null || before === void 0 ? void 0 : before.currentEmotion) || !(after === null || after === void 0 ? void 0 : after.currentEmotion)) {
                    return [2 /*return*/];
                }
                beforeIsNegative = NEGATIVE_EMOTIONS.includes(before.currentEmotion.toLowerCase());
                afterIsPositive = POSITIVE_EMOTIONS.includes(after.currentEmotion.toLowerCase());
                if (!(beforeIsNegative && afterIsPositive)) return [3 /*break*/, 5];
                v2_1.logger.info("Recovery bloom detected for user ".concat(uid, ". From ").concat(before.currentEmotion, " to ").concat(after.currentEmotion, "."));
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                bloomId = (0, uuid_1.v4)();
                memoryBloomPayload = {
                    bloomId: bloomId,
                    emotion: after.currentEmotion,
                    bloomColor: after.overlayColor || mapEmotionToColor(after.currentEmotion),
                    triggeredAt: admin.firestore.FieldValue.serverTimestamp(),
                    description: 'You’ve made it through something heavy. A moment of recovery.',
                };
                return [4 /*yield*/, db
                        .collection("users/".concat(uid, "/memoryBlooms"))
                        .doc(bloomId)
                        .set(memoryBloomPayload)];
            case 2:
                _c.sent();
                insightPayload = {
                    uid: uid,
                    insightId: "bloom-".concat(bloomId),
                    insightType: 'recovery_bloom',
                    payload: { bloomId: bloomId, emotion: after.currentEmotion },
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    consumed: false,
                    ttsUrl: null,
                };
                return [4 /*yield*/, db
                        .collection('narratorInsights')
                        .doc(insightPayload.insightId)
                        .set(insightPayload)];
            case 3:
                _c.sent();
                return [3 /*break*/, 5];
            case 4:
                error_4 = _c.sent();
                v2_1.logger.error("Failed to create recovery bloom for user ".concat(uid, ":"), error_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
