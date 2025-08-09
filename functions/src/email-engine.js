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
exports.sendWeeklySummaryEmails = exports.sendTransactionalEmail = void 0;
var firestore_1 = require("firebase-functions/v2/firestore");
var scheduler_1 = require("firebase-functions/v2/scheduler");
var v2_1 = require("firebase-functions/v2");
var admin = require("firebase-admin");
var sgMail = require("@sendgrid/mail");
var params_1 = require("firebase-functions/params");
// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
var db = admin.firestore();
// Define SendGrid API key as a secret
var sendgridKey = (0, params_1.defineSecret)("SENDGRID_API_KEY");
/**
 * Sends transactional emails via SendGrid when documents are added to /emails collection
 */
exports.sendTransactionalEmail = (0, firestore_1.onDocumentCreated)({
    document: "emails/{emailId}",
    secrets: [sendgridKey],
}, function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var emailData, error_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                emailData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
                if (!emailData || !emailData.to) {
                    v2_1.logger.error("Missing email data or recipient.");
                    return [2 /*return*/, null];
                }
                sgMail.setApiKey(sendgridKey.value());
                _d.label = 1;
            case 1:
                _d.trys.push([1, 4, , 6]);
                return [4 /*yield*/, sgMail.send({
                        to: emailData.to,
                        from: "noreply@urai.app", // Change to your verified SendGrid sender
                        subject: emailData.subject,
                        html: emailData.body,
                    })];
            case 2:
                _d.sent();
                return [4 /*yield*/, ((_b = event.data) === null || _b === void 0 ? void 0 : _b.ref.update({
                        sent: true,
                        sentAt: admin.firestore.FieldValue.serverTimestamp(),
                    }))];
            case 3:
                _d.sent();
                v2_1.logger.info("\u2705 Email sent to ".concat(emailData.to));
                return [3 /*break*/, 6];
            case 4:
                error_1 = _d.sent();
                v2_1.logger.error("❌ Error sending email:", error_1);
                return [4 /*yield*/, ((_c = event.data) === null || _c === void 0 ? void 0 : _c.ref.update({
                        sent: false,
                        error: String(error_1),
                        errorAt: admin.firestore.FieldValue.serverTimestamp(),
                    }))];
            case 5:
                _d.sent();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/, null];
        }
    });
}); });
/**
 * Generates weekly summary emails for all active users
 * Runs every Monday at 9 AM
 */
exports.sendWeeklySummaryEmails = (0, scheduler_1.onSchedule)({
    schedule: "0 9 * * 1", // Every Monday at 9 AM
    timeZone: "America/New_York",
}, function () { return __awaiter(void 0, void 0, void 0, function () {
    var oneWeekAgo, usersSnapshot, batch, _i, _a, userDoc, user, moodSnap, moodSummary, avgMoodScore, moodTrend, scores, activitySnap, activitySummary, activityChart, totalMinutes, highlightsList, weekRange, summaryHtml, emailRef, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                v2_1.logger.info("📅 Weekly Summary Email Job Started");
                oneWeekAgo = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
                _b.label = 1;
            case 1:
                _b.trys.push([1, 9, , 10]);
                return [4 /*yield*/, db.collection("users").get()];
            case 2:
                usersSnapshot = _b.sent();
                batch = db.batch();
                _i = 0, _a = usersSnapshot.docs;
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                userDoc = _a[_i];
                user = userDoc.data();
                if (!user.email || user.transactionalEmailOptOut)
                    return [3 /*break*/, 6];
                return [4 /*yield*/, db
                        .collection("moods")
                        .where("userId", "==", userDoc.id)
                        .where("timestamp", ">", oneWeekAgo)
                        .get()];
            case 4:
                moodSnap = _b.sent();
                moodSummary = "No mood data this week";
                avgMoodScore = null;
                moodTrend = "";
                if (!moodSnap.empty) {
                    scores = moodSnap.docs.map(function (doc) { return doc.data().score || 0; });
                    avgMoodScore =
                        scores.reduce(function (a, b) { return a + b; }, 0) / scores.length;
                    if (avgMoodScore > 2)
                        moodSummary = "Mostly positive & uplifting 🌞";
                    else if (avgMoodScore >= 0)
                        moodSummary = "Balanced & steady 🌤";
                    else
                        moodSummary = "A bit low-energy — take care 💙";
                    moodTrend = buildMoodTrendSVG(moodSnap.docs);
                }
                return [4 /*yield*/, db
                        .collection("activity")
                        .where("userId", "==", userDoc.id)
                        .where("timestamp", ">", oneWeekAgo)
                        .get()];
            case 5:
                activitySnap = _b.sent();
                activitySummary = "No activity recorded this week";
                activityChart = "";
                if (!activitySnap.empty) {
                    totalMinutes = activitySnap.docs
                        .map(function (doc) { return doc.data().duration || 0; })
                        .reduce(function (a, b) { return a + b; }, 0);
                    activitySummary = "You logged ".concat(totalMinutes, " minutes of activity");
                    activityChart = buildActivityBarSVG(activitySnap.docs);
                }
                highlightsList = "\n          <li>Average mood score: ".concat(avgMoodScore !== null ? avgMoodScore.toFixed(1) : "N/A", "</li>\n          <li>Mood entries: ").concat(moodSnap.size, "</li>\n          <li>Activity sessions: ").concat(activitySnap.size, "</li>\n        ");
                weekRange = getWeekRange();
                summaryHtml = generateWeeklySummaryHtml({
                    displayName: user.displayName,
                    weekRange: weekRange,
                    moodSummary: moodSummary + (moodTrend ? "<br>".concat(moodTrend) : ""),
                    activitySummary: activitySummary + (activityChart ? "<br>".concat(activityChart) : ""),
                    highlightsList: highlightsList,
                    unsubscribeLink: "https://urai.app/settings",
                });
                emailRef = db.collection("emails").doc();
                batch.set(emailRef, {
                    to: user.email,
                    subject: "Your Weekly UrAi Update 🌱",
                    body: summaryHtml,
                    sent: false,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                _b.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 3];
            case 7: return [4 /*yield*/, batch.commit()];
            case 8:
                _b.sent();
                v2_1.logger.info("✅ Weekly Summary Emails Queued");
                return [3 /*break*/, 10];
            case 9:
                error_2 = _b.sent();
                v2_1.logger.error("❌ Error generating weekly summaries:", error_2);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
function getWeekRange() {
    var now = new Date();
    var startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);
    var endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6);
    var formatDate = function (date) {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };
    return "".concat(formatDate(startOfWeek), " \u2013 ").concat(formatDate(endOfWeek), ", ").concat(now.getFullYear());
}
function buildMoodTrendSVG(moodDocs) {
    var days = ["M", "T", "W", "T", "F", "S", "S"];
    var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"220\" height=\"40\" style=\"font-family: Arial, sans-serif;\">";
    moodDocs.slice(0, 7).forEach(function (doc, i) {
        var score = doc.data().score || 0;
        var color = "#9ca3af";
        if (score > 2)
            color = "#22c55e";
        else if (score > 0)
            color = "#3b82f6";
        else if (score > -2)
            color = "#f97316";
        else
            color = "#ef4444";
        svg += "<circle cx=\"".concat(20 + i * 30, "\" cy=\"20\" r=\"10\" fill=\"").concat(color, "\" />");
        svg += "<text x=\"".concat(20 + i * 30, "\" y=\"35\" text-anchor=\"middle\" font-size=\"10\" fill=\"#666\">").concat(days[i], "</text>");
    });
    svg += "</svg>";
    return svg;
}
function buildActivityBarSVG(activityDocs) {
    var dayMinutes = Array(7).fill(0);
    var days = ["M", "T", "W", "T", "F", "S", "S"];
    activityDocs.forEach(function (doc) {
        var data = doc.data();
        var dayIndex = data.timestamp.toDate().getDay();
        dayMinutes[(dayIndex + 6) % 7] += data.duration || 0;
    });
    var max = Math.max.apply(Math, __spreadArray(__spreadArray([], dayMinutes, false), [1], false));
    var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"220\" height=\"40\" style=\"font-family: Arial, sans-serif;\">";
    dayMinutes.slice(0, 7).forEach(function (minutes, i) {
        var height = Math.max(2, (minutes / max) * 25);
        var y = 25 - height;
        svg += "<rect x=\"".concat(15 + i * 30, "\" y=\"").concat(y, "\" width=\"10\" height=\"").concat(height, "\" fill=\"#4f46e5\" />");
        svg += "<text x=\"".concat(20 + i * 30, "\" y=\"35\" text-anchor=\"middle\" font-size=\"10\" fill=\"#666\">").concat(days[i], "</text>");
    });
    svg += "</svg>";
    return svg;
}
function generateWeeklySummaryHtml(_a) {
    var displayName = _a.displayName, weekRange = _a.weekRange, moodSummary = _a.moodSummary, activitySummary = _a.activitySummary, highlightsList = _a.highlightsList, unsubscribeLink = _a.unsubscribeLink;
    return "\n  <!DOCTYPE html>\n  <html>\n  <head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Your Weekly UrAi Update</title>\n  <style>\n    @media only screen and (max-width: 600px) {\n      .container { width: 100% !important; padding: 10px !important; }\n      .content { font-size: 16px !important; }\n    }\n  </style>\n  </head>\n  <body style=\"margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f3f4f6; color: #111;\">\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n      <tr>\n        <td align=\"center\" style=\"padding: 20px 0;\">\n          <table class=\"container\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"background-color: #ffffff; border-radius: 12px; overflow: hidden;\">\n            <tr>\n              <td align=\"center\" style=\"background-color: #4f46e5; padding: 20px;\">\n                <h1 style=\"margin: 0; font-size: 24px; color: #ffffff;\">\uD83C\uDF31 Your Weekly UrAi Update</h1>\n                <p style=\"margin: 0; font-size: 14px; color: #e0e7ff;\">Insight & reflection for ".concat(weekRange, "</p>\n              </td>\n            </tr>\n            <tr>\n              <td class=\"content\" style=\"padding: 20px;\">\n                <h2 style=\"margin-top: 0; font-size: 20px; color: #111827;\">Hi ").concat(displayName || "there", ",</h2>\n                <p style=\"font-size: 16px; color: #374151;\">Here's your personal snapshot for the week.</p>\n                <div style=\"background-color: #eef2ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;\">\n                  <h3 style=\"margin: 0 0 5px 0; font-size: 18px; color: #4338ca;\">\uD83C\uDF24 Mood Forecast</h3>\n                  <p style=\"margin: 0; font-size: 15px; color: #1e3a8a;\">").concat(moodSummary, "</p>\n                </div>\n                <div style=\"background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin-bottom: 20px;\">\n                  <h3 style=\"margin: 0 0 5px 0; font-size: 18px; color: #065f46;\">\uD83C\uDFC3 Activity Overview</h3>\n                  <p style=\"margin: 0; font-size: 15px; color: #064e3b;\">").concat(activitySummary, "</p>\n                </div>\n                <div style=\"background-color: #fff7ed; padding: 15px; border-radius: 8px;\">\n                  <h3 style=\"margin: 0 0 5px 0; font-size: 18px; color: #9a3412;\">\u2728 Weekly Highlights</h3>\n                  <ul style=\"margin: 0; padding-left: 20px; font-size: 15px; color: #7c2d12;\">\n                    ").concat(highlightsList, "\n                  </ul>\n                </div>\n              </td>\n            </tr>\n            <tr>\n              <td align=\"center\" style=\"background-color: #f9fafb; padding: 15px; font-size: 12px; color: #6b7280;\">\n                <p style=\"margin: 0;\">You are receiving this email because you have an active UrAi account.</p>\n                <p style=\"margin: 0;\"><a href=\"").concat(unsubscribeLink, "\" style=\"color: #4f46e5; text-decoration: none;\">Unsubscribe</a></p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n  </html>\n  ");
}
