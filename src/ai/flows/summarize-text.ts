export type SummarizeTextInput = { text: string };
export type SummarizeTextOutput = { summary: string };
export async function summarizeText(input: SummarizeTextInput): Promise<SummarizeTextOutput | null> {
  const s = (input?.text ?? '').trim();
  return { summary: s.slice(0, 200) };
}
export default summarizeText;
