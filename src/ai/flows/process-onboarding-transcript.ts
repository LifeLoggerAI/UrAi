export type ProcessOnboardingTranscriptInput = { transcript: string; currentDate?: string };
export type ProcessOnboardingTranscriptOutput = {
  transcript: string;
  analysis: { goal: string; task: string; reminderDate: string; habitToTrack: string };
};

export async function processOnboardingTranscript(
  input: ProcessOnboardingTranscriptInput
): Promise<ProcessOnboardingTranscriptOutput | null> {
  const t = (input?.transcript ?? "").trim();
  return {
    transcript: t,
    analysis: {
      goal: "Get set up",
      task: "Finish onboarding",
      reminderDate: new Date().toISOString().slice(0,10),
      habitToTrack: "Daily mood log"
    }
  };
}
export default processOnboardingTranscript;
