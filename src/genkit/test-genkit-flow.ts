import { runFlow } from '@genkit-ai/flow';

(async () => {
  const result = await runFlow('generateWeeklyScroll', {
    input: { test: true }
  });

  console.log('✅ Genkit test result:', result);
})();