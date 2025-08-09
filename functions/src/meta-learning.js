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
exports.metaLearningFeedback = void 0;
var firestore_1 = require("firebase-functions/v2/firestore");
var firestore_2 = require("firebase-admin/firestore");
var app_1 = require("firebase-admin/app");
// Initialize admin SDK if not already initialized
if (!global.ADMIN_APP_INITIALIZED) {
    (0, app_1.initializeApp)();
    global.ADMIN_APP_INITIALIZED = true;
}
var db = (0, firestore_2.getFirestore)();
exports.metaLearningFeedback = (0, firestore_1.onDocumentWritten)('rituals/{id}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var data, userId, ritualId, forecastQuery, _a, after, before, impactScore, result;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                data = (_c = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after) === null || _c === void 0 ? void 0 : _c.data();
                if (!data || !data.userId)
                    return [2 /*return*/];
                userId = data.userId;
                ritualId = event.params.id;
                return [4 /*yield*/, db.collection('moodForecasts')
                        .where('userId', '==', userId)
                        .orderBy('forecastDate', 'desc')
                        .limit(2)
                        .get()];
            case 1:
                forecastQuery = _d.sent();
                if (forecastQuery.docs.length < 2)
                    return [2 /*return*/];
                _a = forecastQuery.docs.map(function (doc) { return doc.data(); }), after = _a[0], before = _a[1];
                impactScore = before.dailyMood !== after.dailyMood ? 0.75 : 0.3;
                result = impactScore > 0.6 ? 'positive' : 'neutral';
                return [4 /*yield*/, db.collection('metaLearning').add({
                        userId: userId,
                        eventId: ritualId,
                        eventType: 'ritual',
                        result: result,
                        impactScore: impactScore,
                        moodBefore: before.dailyMood,
                        moodAfter: after.dailyMood,
                        insightsUsed: data.notes ? [data.notes] : [],
                        addedToMemory: true,
                        createdAt: new Date().toISOString(),
                    })];
            case 2:
                _d.sent();
                console.log("\uD83E\uDDE0 Meta learning update for ".concat(userId, " from ritual ").concat(ritualId));
                return [2 /*return*/];
        }
    });
}); });
