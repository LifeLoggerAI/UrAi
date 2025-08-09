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
exports.checkProLimits = exports.detectSelfConflict = exports.calcValueAlignment = exports.ingestPassiveSensors = void 0;
var https_1 = require("firebase-functions/v2/https");
var firestore_1 = require("firebase-functions/v2/firestore");
var v2_1 = require("firebase-functions/v2");
var admin = require("firebase-admin");
// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
var db = admin.firestore();
/**
 * Ingests a batch of passive sensor data.
 * This is a placeholder for a complex data ingestion pipeline.
 */
exports.ingestPassiveSensors = (0, https_1.onCall)(function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var uid;
    var _a;
    return __generator(this, function (_b) {
        uid = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid;
        if (!uid) {
            throw new https_1.HttpsError('unauthenticated', 'User must be authenticated.');
        }
        v2_1.logger.info("Ingesting passive sensor data for user ".concat(uid, "."));
        // Logic to write to /torsoMetrics and /habitEvents
        // For now, this remains a placeholder for the data ingestion endpoint.
        return [2 /*return*/, { success: true }];
    });
}); });
/**
 * Calculates value alignment score.
 * Triggered when torsoMetrics are updated. Placeholder.
 */
exports.calcValueAlignment = (0, firestore_1.onDocumentWritten)('torsoMetrics/{uid}/{dateKey}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info("Calculating value alignment for user ".concat(event.params.uid, "."));
        // This function would call an AI model (e.g., via a Genkit flow) to
        // compare habitEvents and torsoMetrics against user-defined values.
        // Placeholder for AI call.
        // const alignmentScore = await callValueAlignmentAI(event.data?.after.data());
        // await change.after.ref.update({ valueAlignmentScore: alignmentScore });
        return [2 /*return*/];
    });
}); });
/**
 * Detects self-conflict or fragmentation.
 * Triggered when torsoMetrics are updated. Placeholder.
 */
exports.detectSelfConflict = (0, firestore_1.onDocumentWritten)('torsoMetrics/{uid}/{dateKey}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var data, uid, insightPayload, notificationPayload;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                data = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
                uid = event.params.uid;
                if (!((data === null || data === void 0 ? void 0 : data.selfConsistencyScore) < 40 &&
                    (!((_b = event.data) === null || _b === void 0 ? void 0 : _b.before.exists) ||
                        ((_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.before.data()) === null || _d === void 0 ? void 0 : _d.selfConsistencyScore) >= 40))) return [3 /*break*/, 3];
                v2_1.logger.info("Self-conflict detected for user ".concat(uid, "."));
                insightPayload = {
                    uid: uid,
                    insightId: "conflict-".concat(event.params.dateKey),
                    insightType: 'self_conflict_detected',
                    payload: {
                        score: data.selfConsistencyScore,
                        date: event.params.dateKey,
                    },
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    consumed: false,
                    ttsUrl: null,
                };
                return [4 /*yield*/, db
                        .collection('narratorInsights')
                        .doc(insightPayload.insightId)
                        .set(insightPayload)];
            case 1:
                _e.sent();
                notificationPayload = {
                    uid: uid,
                    type: 'insight',
                    body: 'A moment of self-conflict was detected. It might be a good time to reflect.',
                };
                return [4 /*yield*/, db.collection('messages/queue').add(notificationPayload)];
            case 2:
                _e.sent();
                _e.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Checks Pro tier limits.
 * Triggered on new torsoMetrics. Placeholder.
 */
exports.checkProLimits = (0, firestore_1.onDocumentCreated)('torsoMetrics/{uid}/{dateKey}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var uid, userRef, userSnap, userData, sevenDaysAgo, dateKeySevenDaysAgo, oldMetricsQuery, oldMetricsSnap, batch_1, notificationPayload;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                uid = event.params.uid;
                userRef = db.doc("users/".concat(uid));
                return [4 /*yield*/, userRef.get()];
            case 1:
                userSnap = _a.sent();
                userData = userSnap.data();
                if (!(userData && !userData.isProUser)) return [3 /*break*/, 5];
                v2_1.logger.info("Checking pro limits for free user ".concat(uid, "."));
                sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                dateKeySevenDaysAgo = sevenDaysAgo.toISOString().split('T')[0];
                oldMetricsQuery = db
                    .collection("torsoMetrics/".concat(uid))
                    .where(admin.firestore.FieldPath.documentId(), '<', dateKeySevenDaysAgo)
                    .orderBy(admin.firestore.FieldPath.documentId());
                return [4 /*yield*/, oldMetricsQuery.get()];
            case 2:
                oldMetricsSnap = _a.sent();
                batch_1 = db.batch();
                oldMetricsSnap.docs.forEach(function (doc) {
                    v2_1.logger.info("Deleting old metric ".concat(doc.id, " for free user ").concat(uid, "."));
                    batch_1.delete(doc.ref);
                });
                return [4 /*yield*/, batch_1.commit()];
            case 3:
                _a.sent();
                notificationPayload = {
                    uid: uid,
                    type: 'upsell',
                    body: 'Unlock your full history and deeper insights with Life Logger Pro.',
                };
                return [4 /*yield*/, db.collection('messages/queue').add(notificationPayload)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
