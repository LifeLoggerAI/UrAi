#!/usr/bin/env tsx
/**
 * AI Flow Health Check Script
 *
 * This script validates that all AI flows are working correctly by running
 * test cases against each flow and checking for proper responses.
 */

import { generateSpeech } from '@/ai/flows/generate-speech';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';
import { analyzeDream } from '@/ai/flows/analyze-dream';
import { companionChat } from '@/ai/flows/companion-chat';

interface HealthCheckResult {
  flow: string;
  status: 'PASS' | 'FAIL';
  error?: string;
  responseTime: number;
  responseShape: boolean;
}

async function testGenerateSpeech(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const flow = 'generate-speech';

  try {
    const result = await generateSpeech({
      text: 'Hello, this is a test for text-to-speech conversion.',
    });

    const responseTime = Date.now() - startTime;
    const hasValidShape =
      result &&
      typeof result === 'object' &&
      'audioDataUri' in result &&
      typeof result.audioDataUri === 'string' &&
      result.audioDataUri.startsWith('data:audio/');

    return {
      flow,
      status: hasValidShape ? 'PASS' : 'FAIL',
      error: hasValidShape ? undefined : 'Invalid response shape',
      responseTime,
      responseShape: hasValidShape,
    };
  } catch (error) {
    return {
      flow,
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
      responseShape: false,
    };
  }
}

async function testTranscribeAudio(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const flow = 'transcribe-audio';

  try {
    // Create a minimal test audio data URI (silent audio)
    const testAudioUri =
      'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGEeBDqP1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGEeBDqP';

    const result = await transcribeAudio({
      audioDataUri: testAudioUri,
    });

    const responseTime = Date.now() - startTime;
    const hasValidShape =
      result &&
      typeof result === 'object' &&
      'transcript' in result &&
      typeof result.transcript === 'string';

    return {
      flow,
      status: hasValidShape ? 'PASS' : 'FAIL',
      error: hasValidShape ? undefined : 'Invalid response shape',
      responseTime,
      responseShape: hasValidShape,
    };
  } catch (error) {
    return {
      flow,
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
      responseShape: false,
    };
  }
}

async function testAnalyzeDream(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const flow = 'analyze-dream';

  try {
    const result = await analyzeDream({
      text:
        'I dreamed I was flying over a beautiful landscape with mountains and rivers.',
    });

    const responseTime = Date.now() - startTime;
    const hasValidShape = result && typeof result === 'object';

    return {
      flow,
      status: hasValidShape ? 'PASS' : 'FAIL',
      error: hasValidShape ? undefined : 'Invalid response shape',
      responseTime,
      responseShape: hasValidShape,
    };
  } catch (error) {
    return {
      flow,
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
      responseShape: false,
    };
  }
}

async function testCompanionChat(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const flow = 'companion-chat';

  try {
    const result = await companionChat({
      message: 'Hello, how are you today?',
      history: [],
    });

    const responseTime = Date.now() - startTime;
    const hasValidShape =
      result &&
      typeof result === 'object' &&
      'response' in result &&
      typeof result.response === 'string';

    return {
      flow,
      status: hasValidShape ? 'PASS' : 'FAIL',
      error: hasValidShape ? undefined : 'Invalid response shape',
      responseTime,
      responseShape: hasValidShape,
    };
  } catch (error) {
    return {
      flow,
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
      responseShape: false,
    };
  }
}

async function runHealthCheck(): Promise<void> {
  console.log('🏥 Starting AI Flow Health Check...\n');

  const tests = [
    { name: 'Generate Speech', test: testGenerateSpeech },
    { name: 'Transcribe Audio', test: testTranscribeAudio },
    { name: 'Analyze Dream', test: testAnalyzeDream },
    { name: 'Companion Chat', test: testCompanionChat },
  ];

  const results: HealthCheckResult[] = [];

  for (const { name, test } of tests) {
    console.log(`⏳ Testing ${name}...`);
    const result = await test();
    results.push(result);

    const status = result.status === 'PASS' ? '✅' : '❌';
    console.log(
      `${status} ${name}: ${result.status} (${result.responseTime}ms)`
    );

    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log();
  }

  // Summary
  const passedTests = results.filter(r => r.status === 'PASS').length;
  const totalTests = results.length;

  console.log('📊 Health Check Summary:');
  console.log(`   Passed: ${passedTests}/${totalTests}`);
  console.log(`   Failed: ${totalTests - passedTests}/${totalTests}`);

  if (passedTests === totalTests) {
    console.log('🎉 All AI flows are healthy!');
    process.exit(0);
  } else {
    console.log(
      '⚠️  Some AI flows have issues. Please check the errors above.'
    );
    process.exit(1);
  }
}

// Run the health check if this script is executed directly
if (require.main === module) {
  runHealthCheck().catch(error => {
    console.error('❌ Health check failed with error:', error);
    process.exit(1);
  });
}
