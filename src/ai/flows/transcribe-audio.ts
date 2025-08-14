export type TranscribeAudioInput = { audioUrl?: string; base64?: string };
export type TranscribeAudioOutput = { transcript: string };
export async function transcribeAudio(
  _input: TranscribeAudioInput
): Promise<TranscribeAudioOutput | null> {
  return { transcript: '(stub transcript)' };
}
export default transcribeAudio;
