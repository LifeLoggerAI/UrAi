export type PrivacyTestCase = {
  id: string;
  title: string;
  expected: string;
};

export const PRIVACY_TEST_CASES: PrivacyTestCase[] = [
  { id: "safe-defaults", title: "Safe defaults do not enable sensitive layers", expected: "Shadow, Legacy, Export, Location, Gmail, Calendar, Health, Relationships, Transcripts, Companion memory, and sensitive cloud sync remain closed." },
  { id: "shadow-consent", title: "Shadow cannot open without consent", expected: "Shadow action shows explicit consent and remains closed if cancelled." },
  { id: "legacy-consent", title: "Legacy cannot save without consent", expected: "No Companion chat or long-term memory is saved to Legacy by default." },
  { id: "export-off", title: "Export blocked when Export is off", expected: "Export review blocks creation until export permission and artifact approval are both present." },
  { id: "hidden-export", title: "Hidden item cannot export", expected: "Hidden, sealed, or locked items remain blocked." },
  { id: "sealed-export", title: "Sealed item cannot export", expected: "Sealed items require unsealing before export review can pass." },
  { id: "gmail-closed-ai", title: "Companion cannot use Gmail when closed", expected: "Companion replies: That layer is closed in Passport." },
  { id: "location-closed-ai", title: "Companion cannot use location when closed", expected: "No exact or inferred location is sent to AI." },
  { id: "shadow-closed-ai", title: "Companion cannot use Shadow when closed", expected: "No Shadow context reaches the AI request." },
  { id: "notification-sensitive", title: "Notifications do not reveal sensitive content", expected: "Notification copy stays generic and never exposes Shadow details." },
  { id: "push-first-load", title: "Push not requested on first load", expected: "Push permission is only requested after explicit user action." },
  { id: "cloud-shadow-default", title: "Cloud sync does not sync Shadow by default", expected: "Cloud sync intent does not override Passport." },
  { id: "deletion-copy", title: "Account deletion copy does not overclaim", expected: "Copy distinguishes local, cloud, and third-party data." },
  { id: "audio-recording", title: "Audio playback does not imply microphone recording", expected: "Sound playback and audio capture are clearly separate permissions." },
];
