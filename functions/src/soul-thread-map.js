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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSoulThreadMap = void 0;
var firestore_1 = require("firebase-functions/v2/firestore");
var firestore_2 = require("firebase-admin/firestore");
var app_1 = require("firebase-admin/app");
// Initialize admin SDK if not already initialized
if (!global.ADMIN_APP_INITIALIZED) {
    (0, app_1.initializeApp)();
    global.ADMIN_APP_INITIALIZED = true;
}
var db = (0, firestore_2.getFirestore)();
exports.updateSoulThreadMap = (0, firestore_1.onDocumentWritten)('scrolls/{id}', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var data, scrollId, userId, scrollType, insights, matchedSymbol, threadLabel, threadsRef, existing, threadId, _i, _a, doc, threadData;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                data = (_c = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after) === null || _c === void 0 ? void 0 : _c.data();
                scrollId = event.params.id;
                if (!data || !scrollId)
                    return [2 /*return*/];
                userId = data.userId, scrollType = data.scrollType, insights = data.insights;
                matchedSymbol = matchSymbol(insights);
                threadLabel = labelThread(matchedSymbol);
                threadsRef = db.collection('soulThreads').where('userId', '==', userId);
                return [4 /*yield*/, threadsRef.get()];
            case 1:
                existing = _d.sent();
                threadId = null;
                _i = 0, _a = existing.docs;
                _d.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                doc = _a[_i];
                if (!(doc.data().coreSymbol === matchedSymbol)) return [3 /*break*/, 4];
                threadId = doc.id;
                threadData = doc.data();
                return [4 /*yield*/, doc.ref.update({
                        events: __spreadArray([], new Set(__spreadArray(__spreadArray([], threadData.events, true), [scrollId], false)), true),
                        rebirthCount: scrollType === 'crisis' ? threadData.rebirthCount + 1 : threadData.rebirthCount,
                        status: scrollType === 'ritual' ? 'resolving' : threadData.status,
                    })];
            case 3:
                _d.sent();
                _d.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                if (!(!threadId && matchedSymbol)) return [3 /*break*/, 7];
                return [4 /*yield*/, db.collection('soulThreads').add({
                        userId: userId,
                        threadLabel: threadLabel,
                        events: [scrollId],
                        coreSymbol: matchedSymbol,
                        dominantArchetype: 'Seeker',
                        status: 'open',
                        rebirthCount: scrollType === 'crisis' ? 1 : 0,
                        createdAt: new Date().toISOString(),
                    })];
            case 6:
                _d.sent();
                _d.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
function matchSymbol(insights) {
    var keywords = ['fire', 'mirror', 'ocean', 'ashes', 'moon', 'voice'];
    for (var _i = 0, insights_1 = insights; _i < insights_1.length; _i++) {
        var i = insights_1[_i];
        for (var _a = 0, keywords_1 = keywords; _a < keywords_1.length; _a++) {
            var k = keywords_1[_a];
            if (i.includes(k))
                return k;
        }
    }
    return null;
}
function labelThread(symbol) {
    var labels = {
        fire: 'The Burning Path',
        mirror: 'The Healer\'s Wound',
        ocean: 'The Depth of Self',
        ashes: 'The Cycle of Rebirth',
        moon: 'The Forgotten Self',
        voice: 'The Silenced Song',
    };
    return symbol ? labels[symbol] || "Thread of ".concat(symbol) : 'Unnamed Thread';
}
