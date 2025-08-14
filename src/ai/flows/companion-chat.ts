export type CompanionChatInput = { message: string };
export type CompanionChatOutput = { reply: string };
export async function companionChat(input: CompanionChatInput): Promise<CompanionChatOutput | null> {
  const m = input?.message ?? '';
  return { reply: m ? `Echo: ${m}` : 'Hello from stub.' };
}
export default companionChat;
