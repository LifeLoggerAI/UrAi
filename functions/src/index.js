"use strict";
/**
 * Firebase Function Entry Point
 * See: https://firebase.google.com/docs/functions/typescript
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Genkit flows
__exportStar(require("./genkit-sample"), exports);
// Core feature modules
__exportStar(require("./user-management"), exports);
__exportStar(require("./emotion-engine"), exports);
__exportStar(require("./torso-engine"), exports);
__exportStar(require("./legs-engine"), exports);
__exportStar(require("./arms-engine"), exports);
__exportStar(require("./orb-engine"), exports);
__exportStar(require("./social-engine"), exports);
__exportStar(require("./timeline-engine"), exports);
__exportStar(require("./data-privacy"), exports);
// Scheduled + messaging systems
__exportStar(require("./scheduled"), exports);
__exportStar(require("./notifications"), exports);
__exportStar(require("./email-engine"), exports);
// Speech + visual pipelines
__exportStar(require("./speech-engine"), exports);
__exportStar(require("./visuals-engine"), exports);
// Extended symbolic/telemetry engines
__exportStar(require("./telemetry-engine"), exports);
__exportStar(require("./avatar-engine"), exports);
__exportStar(require("./dream-engine"), exports);
__exportStar(require("./symbolic-engine"), exports);
// New symbolic systems
__exportStar(require("./shadow-metrics"), exports);
__exportStar(require("./crisis-threshold"), exports);
__exportStar(require("./recovery-bloom"), exports);
__exportStar(require("./soul-thread-map"), exports);
__exportStar(require("./meta-learning"), exports);
__exportStar(require("./causal-insight"), exports);
__exportStar(require("./projection-detector"), exports);
// Optional: Sample or debug/test functions
__exportStar(require("./helloWorld"), exports);
