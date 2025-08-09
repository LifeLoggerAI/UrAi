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
exports.generateWeeklyStoryScroll = exports.scheduleDailyTorsoSummary = exports.exportToBigQuery = exports.evolveCompanion = exports.generateWeeklyScroll = void 0;
var scheduler_1 = require("firebase-functions/v2/scheduler");
var v2_1 = require("firebase-functions/v2");
var admin = require("firebase-admin");
// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
var db = admin.firestore();
/**
 * Generates a weekly scroll export for all users.
 * This is a placeholder; a real implementation would generate a PDF or interactive export.
 */
exports.generateWeeklyScroll = functions.pubsub
    .schedule('every monday 08:00')
    .timeZone('America/New_York') // Example timezone
    .onRun(function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info('Starting weekly scroll export job for all users.');
        // In a real application, this function would:
        // 1. Query for all users.
        // 2. For each user, gather data from the last 7 days (voiceEvents, dreams, etc.).
        // 3. Call an AI flow to generate a "Legacy Scroll" or "Weekly Story Digest".
        // 4. Save the export to Cloud Storage and create a record in Firestore.
        // 5. Optionally, send a notification to the user that their scroll is ready.
        return [2 /*return*/];
    });
}); });
/**
 * Evolves the AI companion's personality monthly based on user interaction.
 * This is a placeholder.
 */
exports.evolveCompanion = functions.pubsub
    .schedule('1 of month 09:00')
    .timeZone('America/New_York') // Example timezone
    .onRun(function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info('Starting monthly companion evolution job.');
        // In a real application, this function would:
        // 1. Query for all users.
        // 2. Analyze the last month of `companionChat` history.
        // 3. Adjust the user's `symbolLexicon` or `personaProfile` based on themes.
        // 4. This could change the companion's tone or the types of rituals it suggests.
        return [2 /*return*/];
    });
}); });
/**
 * Exports data to BigQuery nightly.
 * This is a placeholder.
 */
exports.exportToBigQuery = functions.pubsub
    .schedule('every day 03:00')
    .timeZone('America/New_York') // Example timezone
    .onRun(function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info('Starting nightly BigQuery export job.');
        // In a real application, this function would:
        // 1. Check user consent (`dataConsent` collection).
        // 2. Use the Firebase Admin SDK for BigQuery to stream data from
        //    Firestore collections like `voiceEvents`, `dreams`, `clusters` etc.
        // 3. This is a complex operation that requires setting up BigQuery and defining table schemas.
        return [2 /*return*/];
    });
}); });
/**
 * Aggregates torso metrics and generates a daily summary.
 * This is a placeholder.
 */
exports.scheduleDailyTorsoSummary = (0, scheduler_1.onSchedule)('15 02 * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        v2_1.logger.info('Running daily torso summary job.');
        // For every user:
        // 1. Aggregate yesterday’s torsoMetrics.
        // 2. Write a summary document.
        // 3. Create a notification: “Your Core-Self pulse for {{date}} is ready.”
        return [2 /*return*/];
    });
}); });
/**
 * Generates a weekly story scroll from user data.
 * Runs every Sunday.
 */
exports.generateWeeklyStoryScroll = (0, scheduler_1.onSchedule)('every sunday 06:00', function () { return __awaiter(void 0, void 0, void 0, function () {
    var usersSnap, _loop_1, _i, _a, userDoc;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                v2_1.logger.info('Running weekly story scroll generation job.');
                return [4 /*yield*/, db.collection('users').get()];
            case 1:
                usersSnap = _c.sent();
                _loop_1 = function (userDoc) {
                    var user, uid, oneWeekAgo, voiceEventsQuery, dreamEventsQuery, innerTextsQuery, _d, voiceEventsSnap, dreamEventsSnap, innerTextsSnap, combinedText_1, summaryPayload, scrollRef, error_1;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                user = userDoc.data();
                                uid = userDoc.id;
                                if (!((_b = user.settings) === null || _b === void 0 ? void 0 : _b.receiveWeeklyEmail)) {
                                    return [2 /*return*/, "continue"];
                                }
                                oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                                _e.label = 1;
                            case 1:
                                _e.trys.push([1, 4, , 5]);
                                voiceEventsQuery = db
                                    .collection('voiceEvents')
                                    .where('uid', '==', uid)
                                    .where('createdAt', '>=', oneWeekAgo);
                                dreamEventsQuery = db
                                    .collection('dreamEvents')
                                    .where('uid', '==', uid)
                                    .where('createdAt', '>=', oneWeekAgo);
                                innerTextsQuery = db
                                    .collection('innerTexts')
                                    .where('uid', '==', uid)
                                    .where('createdAt', '>=', oneWeekAgo);
                                return [4 /*yield*/, Promise.all([
                                        voiceEventsQuery.get(),
                                        dreamEventsQuery.get(),
                                        innerTextsQuery.get(),
                                    ])];
                            case 2:
                                _d = _e.sent(), voiceEventsSnap = _d[0], dreamEventsSnap = _d[1], innerTextsSnap = _d[2];
                                combinedText_1 = '';
                                voiceEventsSnap.forEach(function (doc) { return (combinedText_1 += doc.data().text + '\\n\\n'); });
                                dreamEventsSnap.forEach(function (doc) { return (combinedText_1 += doc.data().text + '\\n\\n'); });
                                innerTextsSnap.forEach(function (doc) { return (combinedText_1 += doc.data().text + '\\n\\n'); });
                                if (combinedText_1.trim().length === 0) {
                                    v2_1.logger.info("No new entries for user ".concat(uid, ", skipping scroll."));
                                    return [2 /*return*/, "continue"];
                                }
                                summaryPayload = {
                                    summaryMood: 'reflective',
                                    highlights: [
                                        {
                                            type: 'event',
                                            text: 'A key event from the week would be summarized here.',
                                        },
                                        {
                                            type: 'recovery',
                                            text: 'A moment of positive shift would be noted here.',
                                        },
                                    ],
                                    narrationScript: "AI Summary Placeholder: This week for user ".concat(uid, " was about... [themes from combinedText would go here]"),
                                    exportLinks: {
                                        audio: "/exports/audio/placeholder.mp3",
                                        image: "/exports/image/placeholder.png",
                                    },
                                };
                                scrollRef = db.collection("weeklyScrolls/".concat(uid, "/scrolls")).doc();
                                return [4 /*yield*/, scrollRef.set(__assign(__assign({ id: scrollRef.id, uid: uid, weekStart: oneWeekAgo, weekEnd: Date.now() }, summaryPayload), { createdAt: admin.firestore.FieldValue.serverTimestamp() }))];
                            case 3:
                                _e.sent();
                                v2_1.logger.info("Generated weekly scroll ".concat(scrollRef.id, " for user ").concat(uid, "."));
                                return [3 /*break*/, 5];
                            case 4:
                                error_1 = _e.sent();
                                v2_1.logger.error("Failed to generate scroll for user ".concat(uid, ":"), error_1);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = usersSnap.docs;
                _c.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                userDoc = _a[_i];
                return [5 /*yield**/, _loop_1(userDoc)];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); });
