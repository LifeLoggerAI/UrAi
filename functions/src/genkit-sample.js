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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuSuggestion = void 0;
// Import the Genkit core libraries and plugins.
var genkit_1 = require("genkit");
var googleai_1 = require("@genkit-ai/googleai");
// Import models from the Google AI plugin. The Google AI API provides access to
// several generative models. Here, we import Gemini 2.0 Flash.
var googleai_2 = require("@genkit-ai/googleai");
// Cloud Functions for Firebase supports Genkit natively. The onCallGenkit function creates a callable
// function from a Genkit action. It automatically implements streaming if your flow does.
// The https library also has other utility methods such as hasClaim, which verifies that
// a caller's token has a specific claim (optionally matching a specific value)
var https_1 = require("firebase-functions/https");
// Genkit models generally depend on an API key. APIs should be stored in Cloud Secret Manager so that
// access to these sensitive values can be controlled. defineSecret does this for you automatically.
// If you are using Google generative AI you can get an API key at https://aistudio.google.com/app/apikey
var params_1 = require("firebase-functions/params");
var apiKey = (0, params_1.defineSecret)('GOOGLE_GENAI_API_KEY');
// The Firebase telemetry plugin exports a combination of metrics, traces, and logs to Google Cloud
// Observability. See https://firebase.google.com/docs/genkit/observability/telemetry-collection.
var firebase_1 = require("@genkit-ai/firebase");
(0, firebase_1.enableFirebaseTelemetry)();
var ai = (0, genkit_1.genkit)({
    plugins: [
        // Load the Google AI plugin. You can optionally specify your API key
        // by passing in a config object; if you don't, the Google AI plugin uses
        // the value from the GOOGLE_GENAI_API_KEY environment variable, which is
        // the recommended practice.
        (0, googleai_1.googleAI)(),
    ],
});
// Define a simple flow that prompts an LLM to generate menu suggestions.
var menuSuggestionFlow = ai.defineFlow({
    name: 'menuSuggestionFlow',
    inputSchema: genkit_1.z.string().describe('A restaurant theme').default('seafood'),
    outputSchema: genkit_1.z.string(),
    streamSchema: genkit_1.z.string(),
}, function (subject_1, _a) { return __awaiter(void 0, [subject_1, _a], void 0, function (subject, _b) {
    var prompt, _c, response, stream, _d, stream_1, stream_1_1, chunk, e_1_1;
    var _e, e_1, _f, _g;
    var sendChunk = _b.sendChunk;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                prompt = "Suggest an item for the menu of a ".concat(subject, " themed restaurant");
                _c = ai.generateStream({
                    model: googleai_2.gemini20Flash,
                    prompt: prompt,
                    config: {
                        temperature: 1,
                    },
                }), response = _c.response, stream = _c.stream;
                _h.label = 1;
            case 1:
                _h.trys.push([1, 6, 7, 12]);
                _d = true, stream_1 = __asyncValues(stream);
                _h.label = 2;
            case 2: return [4 /*yield*/, stream_1.next()];
            case 3:
                if (!(stream_1_1 = _h.sent(), _e = stream_1_1.done, !_e)) return [3 /*break*/, 5];
                _g = stream_1_1.value;
                _d = false;
                chunk = _g;
                sendChunk(chunk.text);
                _h.label = 4;
            case 4:
                _d = true;
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 12];
            case 6:
                e_1_1 = _h.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 12];
            case 7:
                _h.trys.push([7, , 10, 11]);
                if (!(!_d && !_e && (_f = stream_1.return))) return [3 /*break*/, 9];
                return [4 /*yield*/, _f.call(stream_1)];
            case 8:
                _h.sent();
                _h.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 11: return [7 /*endfinally*/];
            case 12: return [4 /*yield*/, response];
            case 13: 
            // Handle the response from the model API. In this sample, we just
            // convert it to a string, but more complicated flows might coerce the
            // response into structured output or chain the response into another
            // LLM call, etc.
            return [2 /*return*/, (_h.sent()).text];
        }
    });
}); });
exports.menuSuggestion = (0, https_1.onCallGenkit)({
    // Uncomment to enable AppCheck. This can reduce costs by ensuring only your Verified
    // app users can use your API. Read more at https://firebase.google.com/docs/app-check/cloud-functions
    // enforceAppCheck: true,
    // authPolicy can be any callback that accepts an AuthData (a uid and tokens dictionary) and the
    // request data. The isSignedIn() and hasClaim() helpers can be used to simplify. The following
    // will require the user to have the email_verified claim, for example.
    // authPolicy: hasClaim("email_verified"),
    // Grant access to the API key to this function:
    secrets: [apiKey],
}, menuSuggestionFlow);
