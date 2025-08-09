"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.dailyWatermarkChecker = exports.cleanupOptOut = exports.rejectDarRequest = exports.approveDarRequest = exports.createDarRequest = exports.storeConsentAudit = exports.exportUserData = exports.deleteUserData = exports.generateAggregateInsights = exports.anonymizeUserData = void 0;
var https_1 = require("firebase-functions/v2/https");
var firestore_1 = require("firebase-functions/v2/firestore");
var scheduler_1 = require("firebase-functions/v2/scheduler");
var v2_1 = require("firebase-functions/v2");
var admin = require("firebase-admin");
// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
var db = admin.firestore();
/**
 * Anonymizes user data upon request or based on settings.
 * This is a placeholder for a complex data anonymization pipeline.
 */
exports.anonymizeUserData = (0, https_1.onCall)(function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var uid;
    var _a;
    return __generator(this, function (_b) {
        uid = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid;
        if (!uid) {
            throw new https_1.HttpsError('unauthenticated', 'User must be authenticated.');
        }
        v2_1.logger.info("Starting data anonymization for user ".concat(uid, "."));
        // In a real implementation:
        // 1. Hash user UID with a salt.
        // 2. Query user's data from various collections.
        // 3. Fuzz timestamps, round GPS, remove PII.
        // 4. Write to /anonymizedData collection.
        return [2 /*return*/, { success: true, message: 'Anonymization process initiated.' }];
    });
}); });
/**
 * Generates aggregated B2B insights from anonymized data.
 * Runs nightly. This is a placeholder.
 */
exports.generateAggregateInsights = (0, scheduler_1.onSchedule)('00 01 * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info('Running nightly job to generate aggregate insights.');
        // In a real implementation:
        // 1. Pool all new data from /anonymizedData.
        // 2. Perform aggregation (e.g., mood heatmaps, correlation analysis).
        // 3. Save reports to /b2bExports or stream to BigQuery.
        return [2 /*return*/];
    });
}); });
/**
 * Deletes all data associated with a user.
 * This is a placeholder for a user-initiated deletion.
 */
exports.deleteUserData = (0, https_1.onCall)(function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var uid;
    var _a;
    return __generator(this, function (_b) {
        uid = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid;
        if (!uid) {
            throw new https_1.HttpsError('unauthenticated', 'User must be authenticated.');
        }
        v2_1.logger.info("Initiating data deletion for user ".concat(uid, "."));
        // In a real implementation, you would need a robust, multi-step process
        // to delete all user data across all collections and Storage.
        // This is a complex and destructive operation.
        // Example: await admin.firestore().collection('users').doc(uid).delete();
        //          await admin.firestore().collection('voiceEvents').where('uid', '==', uid).get().then(...)
        return [2 /*return*/, { success: true, message: 'Data deletion process initiated.' }];
    });
}); });
/**
 * Exports all data associated with a user.
 * This is a placeholder for a user-initiated export.
 */
exports.exportUserData = (0, https_1.onCall)(function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var uid;
    var _a;
    return __generator(this, function (_b) {
        uid = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid;
        if (!uid) {
            throw new https_1.HttpsError('unauthenticated', 'User must be authenticated.');
        }
        v2_1.logger.info("Initiating data export for user ".concat(uid, "."));
        // In a real implementation:
        // 1. Gather all user data from Firestore collections.
        // 2. Compile into a machine-readable format (e.g., JSON files).
        // 3. Zip the files and upload to a private Cloud Storage bucket.
        // 4. Generate a signed URL for the user to download the file.
        // 5. Send the URL to the user's email.
        return [2 /*return*/, {
                success: true,
                message: 'Data export process initiated. You will receive an email with a download link shortly.',
            }];
    });
}); });
/**
 * Creates an audit log whenever a user's permissions document is written.
 */
exports.storeConsentAudit = (0, firestore_1.onDocumentWritten)('permissions/{uid}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var uid, consentData, auditLog, error_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                uid = event.params.uid;
                consentData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after.data();
                if (!consentData) {
                    v2_1.logger.info("Consent data for ".concat(uid, " deleted, skipping audit."));
                    return [2 /*return*/];
                }
                auditLog = __assign(__assign({ uid: uid }, consentData), { auditTimestamp: admin.firestore.FieldValue.serverTimestamp(), changeType: ((_c = (_b = event.data) === null || _b === void 0 ? void 0 : _b.before) === null || _c === void 0 ? void 0 : _c.exists) ? 'update' : 'create' });
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                // Creates a new document in the consentAudit collection for each change
                return [4 /*yield*/, db.collection('consentAudit').add(auditLog)];
            case 2:
                // Creates a new document in the consentAudit collection for each change
                _d.sent();
                v2_1.logger.info("Successfully logged consent audit for user ".concat(uid, "."));
                return [3 /*break*/, 4];
            case 3:
                error_1 = _d.sent();
                v2_1.logger.error("Failed to log consent audit for user ".concat(uid, ":"), error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Creates a Data Access Request from an external partner.
 * Requires partnerId, packageId, and apiKey in the data payload.
 */
exports.createDarRequest = (0, https_1.onCall)(function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, partnerId, packageId, apiKey, partnerRef, partnerDoc, packageRef, packageDoc, darRef;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = request.data, partnerId = _a.partnerId, packageId = _a.packageId, apiKey = _a.apiKey;
                if (!partnerId || !packageId || !apiKey) {
                    throw new https_1.HttpsError('invalid-argument', 'Missing partnerId, packageId, or apiKey.');
                }
                partnerRef = db.collection('partnerAuth').doc(partnerId);
                return [4 /*yield*/, partnerRef.get()];
            case 1:
                partnerDoc = _d.sent();
                if (!partnerDoc.exists ||
                    ((_b = partnerDoc.data()) === null || _b === void 0 ? void 0 : _b.apiKey) !== apiKey ||
                    !((_c = partnerDoc.data()) === null || _c === void 0 ? void 0 : _c.isApproved)) {
                    throw new https_1.HttpsError('unauthenticated', 'Invalid partner ID or API key.');
                }
                packageRef = db.doc("dataMarketplace/packages/".concat(packageId));
                return [4 /*yield*/, packageRef.get()];
            case 2:
                packageDoc = _d.sent();
                if (!packageDoc.exists) {
                    throw new https_1.HttpsError('not-found', 'The specified data package does not exist.');
                }
                darRef = db.collection('darRequests').doc();
                return [4 /*yield*/, darRef.set({
                        partnerId: partnerId,
                        packageId: packageId,
                        status: 'pending',
                        requestedAt: admin.firestore.FieldValue.serverTimestamp(),
                        reviewedAt: null,
                        reviewerUid: null,
                        notes: null,
                    })];
            case 3:
                _d.sent();
                v2_1.logger.info("New DAR created: ".concat(darRef.id, " for partner ").concat(partnerId));
                return [2 /*return*/, { success: true, requestId: darRef.id }];
        }
    });
}); });
/**
 * Approves a Data Access Request. Admin-only.
 * Requires requestId in the data payload.
 */
exports.approveDarRequest = (0, https_1.onCall)(function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var requestId, darRef;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!((_a = request.auth) === null || _a === void 0 ? void 0 : _a.token.admin)) {
                    throw new https_1.HttpsError('permission-denied', 'Must be an admin to approve requests.');
                }
                requestId = request.data.requestId;
                if (!requestId) {
                    throw new https_1.HttpsError('invalid-argument', 'Request ID is required.');
                }
                darRef = db.collection('darRequests').doc(requestId);
                return [4 /*yield*/, darRef.update({
                        status: 'approved',
                        reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
                        reviewerUid: (_b = request.auth) === null || _b === void 0 ? void 0 : _b.uid,
                    })];
            case 1:
                _d.sent();
                v2_1.logger.info("DAR ".concat(requestId, " approved by admin ").concat((_c = request.auth) === null || _c === void 0 ? void 0 : _c.uid, "."));
                v2_1.logger.info("Placeholder: Triggering BigQuery export for DAR ".concat(requestId, "."));
                return [2 /*return*/, { success: true }];
        }
    });
}); });
/**
 * Rejects a Data Access Request. Admin-only.
 * Requires requestId and notes in the data payload.
 */
exports.rejectDarRequest = (0, https_1.onCall)(function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, requestId, notes, darRef;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!((_b = request.auth) === null || _b === void 0 ? void 0 : _b.token.admin)) {
                    throw new https_1.HttpsError('permission-denied', 'Must be an admin to reject requests.');
                }
                _a = request.data, requestId = _a.requestId, notes = _a.notes;
                if (!requestId || !notes) {
                    throw new https_1.HttpsError('invalid-argument', 'Request ID and rejection notes are required.');
                }
                darRef = db.collection('darRequests').doc(requestId);
                return [4 /*yield*/, darRef.update({
                        status: 'rejected',
                        notes: notes,
                        reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
                        reviewerUid: (_c = request.auth) === null || _c === void 0 ? void 0 : _c.uid,
                    })];
            case 1:
                _e.sent();
                v2_1.logger.info("DAR ".concat(requestId, " rejected by admin ").concat((_d = request.auth) === null || _d === void 0 ? void 0 : _d.uid, "."));
                return [2 /*return*/, { success: true }];
        }
    });
}); });
/**
 * Handles user opt-out for data sharing.
 * Triggered when a user's dataConsent settings change.
 */
exports.cleanupOptOut = (0, firestore_1.onDocumentUpdated)('users/{uid}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var beforeSettings, afterSettings, beforeConsent, afterConsent, uid;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                beforeSettings = ((_a = event.data) === null || _a === void 0 ? void 0 : _a.before.data().settings) || {};
                afterSettings = ((_b = event.data) === null || _b === void 0 ? void 0 : _b.after.data().settings) || {};
                beforeConsent = (_c = beforeSettings.dataConsent) === null || _c === void 0 ? void 0 : _c.shareAnonymousData;
                afterConsent = (_d = afterSettings.dataConsent) === null || _d === void 0 ? void 0 : _d.shareAnonymousData;
                if (!(beforeConsent === true && afterConsent === false)) return [3 /*break*/, 2];
                uid = event.params.uid;
                v2_1.logger.info("User ".concat(uid, " has opted out of data sharing."));
                if (!!((_e = afterSettings.dataConsent) === null || _e === void 0 ? void 0 : _e.optedOutAt)) return [3 /*break*/, 2];
                v2_1.logger.info("Client did not set optedOutAt, setting it now for user ".concat(uid, "."));
                return [4 /*yield*/, change.after.ref.set({
                        settings: {
                            dataConsent: {
                                shareAnonymousData: false,
                                optedOutAt: admin.firestore.FieldValue.serverTimestamp(),
                            },
                        },
                    }, { merge: true })];
            case 1:
                _f.sent();
                _f.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
/**
 * Nightly job to check watermarks on new exports.
 */
exports.dailyWatermarkChecker = (0, scheduler_1.onSchedule)('30 01 * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    var twentyFourHoursAgo, recentExportsQuery, recentExportsSnap, _i, _a, doc, exportSummary, packageId, watermarkId, packageRef, packageDoc, watermarkSalt, isWatermarkValid, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                v2_1.logger.info('Running daily watermark checker job.');
                twentyFourHoursAgo = admin.firestore.Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                recentExportsQuery = db
                    .collection('exportSummaries')
                    .where('generatedAt', '>=', twentyFourHoursAgo);
                return [4 /*yield*/, recentExportsQuery.get()];
            case 2:
                recentExportsSnap = _b.sent();
                if (recentExportsSnap.empty) {
                    v2_1.logger.info('No new exports to check in the last 24 hours.');
                    return [2 /*return*/];
                }
                _i = 0, _a = recentExportsSnap.docs;
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                doc = _a[_i];
                exportSummary = doc.data();
                packageId = exportSummary.packageId, watermarkId = exportSummary.watermarkId;
                if (!packageId || !watermarkId) {
                    v2_1.logger.warn("Export ".concat(doc.id, " is missing packageId or watermarkId."));
                    return [3 /*break*/, 5];
                }
                packageRef = db.doc("dataMarketplace/packages/".concat(packageId));
                return [4 /*yield*/, packageRef.get()];
            case 4:
                packageDoc = _b.sent();
                if (!packageDoc.exists) {
                    v2_1.logger.error("Could not find package ".concat(packageId, " for export ").concat(doc.id, ". Flagging for review."));
                    // In a real app, write to an alerts collection.
                    return [3 /*break*/, 5];
                }
                watermarkSalt = packageDoc.data().watermarkSalt;
                if (!watermarkSalt) {
                    v2_1.logger.error("Package ".concat(packageId, " is missing a watermarkSalt. Flagging for review."));
                    // In a real app, write to an alerts collection.
                    return [3 /*break*/, 5];
                }
                isWatermarkValid = watermarkId.startsWith('watermark_') && watermarkId.length > 10;
                if (isWatermarkValid) {
                    v2_1.logger.info("Watermark for export ".concat(doc.id, " is valid."));
                }
                else {
                    v2_1.logger.error("Invalid watermark detected for export ".concat(doc.id, ". Flagging for review."));
                    // In a real app, write to an alerts collection.
                }
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                v2_1.logger.info('Daily watermark checker job finished.');
                return [3 /*break*/, 8];
            case 7:
                error_2 = _b.sent();
                v2_1.logger.error('Error running daily watermark checker:', error_2);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
