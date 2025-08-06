#!/usr/bin/env tsx
/**
 * @fileOverview AI Configuration Validation Script
 * 
 * This script validates that all AI model configurations are properly set up:
 * - Environment variables
 * - Package dependencies
 * - AI flow function imports
 * - Firebase configuration
 */

import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

config();

interface ValidationResult {
  category: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const results: ValidationResult[] = [];

function addResult(category: string, name: string, status: 'pass' | 'fail' | 'warning', message: string) {
  results.push({ category, name, status, message });
}

// Check environment variables
function validateEnvironmentVariables() {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const optionalVars = [
    'GOOGLE_AI_API_KEY',
    'OPENAI_API_KEY'
  ];

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      addResult('Environment', varName, 'fail', 'Missing required environment variable');
    } else if (value === 'YOUR_API_KEY_HERE' || value === 'YOUR_PROJECT_ID') {
      addResult('Environment', varName, 'warning', 'Environment variable has placeholder value');
    } else {
      addResult('Environment', varName, 'pass', 'Environment variable is set');
    }
  }

  for (const varName of optionalVars) {
    const value = process.env[varName];
    if (!value) {
      addResult('Environment', varName, 'warning', 'Optional environment variable not set');
    } else {
      addResult('Environment', varName, 'pass', 'Optional environment variable is set');
    }
  }
}

// Check package dependencies
function validatePackageDependencies() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    addResult('Dependencies', 'package.json', 'fail', 'package.json not found');
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const requiredDeps = [
    '@genkit-ai/googleai',
    '@genkit-ai/next',
    'genkit',
    'firebase',
    'jest',
    '@playwright/test'
  ];

  const problematicDeps = [
    '@opentelemetry/exporter-jaeger', // Often causes build issues
    '@types/handlebars' // Deprecated stub
  ];

  for (const dep of requiredDeps) {
    if (deps[dep]) {
      addResult('Dependencies', dep, 'pass', `Version: ${deps[dep]}`);
    } else {
      addResult('Dependencies', dep, 'fail', 'Required dependency missing');
    }
  }

  for (const dep of problematicDeps) {
    if (deps[dep]) {
      addResult('Dependencies', dep, 'warning', 'Potentially problematic dependency found');
    }
  }
}

// Check AI flow files
function validateAIFlows() {
  const aiFlowsDir = path.join(process.cwd(), 'src', 'ai', 'flows');
  if (!fs.existsSync(aiFlowsDir)) {
    addResult('AI Flows', 'flows directory', 'fail', 'AI flows directory not found');
    return;
  }

  const expectedFlows = [
    'companion-chat.ts',
    'transcribe-audio.ts',
    'analyze-dream.ts',
    'enrich-voice-event.ts',
    'generate-speech.ts',
    'summarize-text.ts',
    'analyze-camera-image.ts',
    'generate-symbolic-insight.ts',
    'analyze-text-sentiment.ts',
    'suggest-ritual.ts',
    'process-onboarding-transcript.ts',
    'generate-avatar.ts'
  ];

  for (const flowFile of expectedFlows) {
    const flowPath = path.join(aiFlowsDir, flowFile);
    if (fs.existsSync(flowPath)) {
      const content = fs.readFileSync(flowPath, 'utf8');
      if (content.includes('defineFlow') || content.includes('definePrompt')) {
        addResult('AI Flows', flowFile, 'pass', 'AI flow file exists and has proper structure');
      } else {
        addResult('AI Flows', flowFile, 'warning', 'AI flow file exists but may be incomplete');
      }
    } else {
      addResult('AI Flows', flowFile, 'fail', 'Expected AI flow file missing');
    }
  }
}

// Check Firebase configuration files
function validateFirebaseConfig() {
  const firebaseJsonPath = path.join(process.cwd(), 'firebase.json');
  if (fs.existsSync(firebaseJsonPath)) {
    const firebaseJson = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));
    
    if (firebaseJson.functions) {
      addResult('Firebase', 'functions', 'pass', 'Firebase Functions configured');
    } else {
      addResult('Firebase', 'functions', 'warning', 'Firebase Functions not configured');
    }

    if (firebaseJson.firestore) {
      addResult('Firebase', 'firestore', 'pass', 'Firestore configured');
    } else {
      addResult('Firebase', 'firestore', 'warning', 'Firestore not configured');
    }

    if (firebaseJson.emulators) {
      addResult('Firebase', 'emulators', 'pass', 'Firebase emulators configured');
    } else {
      addResult('Firebase', 'emulators', 'warning', 'Firebase emulators not configured');
    }
  } else {
    addResult('Firebase', 'firebase.json', 'fail', 'firebase.json not found');
  }
}

// Check AI client wrapper
function validateAIClient() {
  const clientPath = path.join(process.cwd(), 'src', 'ai', 'client.ts');
  if (fs.existsSync(clientPath)) {
    const content = fs.readFileSync(clientPath, 'utf8');
    if (content.includes('AIClient')) {
      addResult('AI Client', 'client.ts', 'pass', 'AI client wrapper exists');
    } else {
      addResult('AI Client', 'client.ts', 'warning', 'AI client file exists but may be incomplete');
    }
  } else {
    addResult('AI Client', 'client.ts', 'fail', 'AI client wrapper missing');
  }
}

// Check test infrastructure
function validateTestInfrastructure() {
  const jestConfigPath = path.join(process.cwd(), 'jest.config.js');
  const playwrightConfigPath = path.join(process.cwd(), 'playwright.config.ts');
  const testDirPath = path.join(process.cwd(), 'test');

  if (fs.existsSync(jestConfigPath)) {
    addResult('Testing', 'jest.config.js', 'pass', 'Jest configuration found');
  } else {
    addResult('Testing', 'jest.config.js', 'fail', 'Jest configuration missing');
  }

  if (fs.existsSync(playwrightConfigPath)) {
    addResult('Testing', 'playwright.config.ts', 'pass', 'Playwright configuration found');
  } else {
    addResult('Testing', 'playwright.config.ts', 'fail', 'Playwright configuration missing');
  }

  if (fs.existsSync(testDirPath)) {
    addResult('Testing', 'test directory', 'pass', 'Test directory exists');
  } else {
    addResult('Testing', 'test directory', 'fail', 'Test directory missing');
  }
}

// Run all validations
function runValidation() {
  console.log('🔍 Validating AI Model Setup...\n');

  validateEnvironmentVariables();
  validatePackageDependencies();
  validateAIFlows();
  validateFirebaseConfig();
  validateAIClient();
  validateTestInfrastructure();

  // Print results
  const grouped = results.reduce((acc, result) => {
    if (!acc[result.category]) acc[result.category] = [];
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, ValidationResult[]>);

  let hasFailures = false;
  let hasWarnings = false;

  for (const [category, categoryResults] of Object.entries(grouped)) {
    console.log(`\n📁 ${category}:`);
    for (const result of categoryResults) {
      const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
      console.log(`  ${icon} ${result.name}: ${result.message}`);
      
      if (result.status === 'fail') hasFailures = true;
      if (result.status === 'warning') hasWarnings = true;
    }
  }

  // Summary
  console.log('\n📊 Summary:');
  const passCount = results.filter(r => r.status === 'pass').length;
  const warnCount = results.filter(r => r.status === 'warning').length;
  const failCount = results.filter(r => r.status === 'fail').length;

  console.log(`  ✅ Passed: ${passCount}`);
  console.log(`  ⚠️  Warnings: ${warnCount}`);
  console.log(`  ❌ Failed: ${failCount}`);

  if (hasFailures) {
    console.log('\n❌ Validation failed. Please fix the issues above.');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('\n⚠️  Validation passed with warnings. Consider addressing the warnings above.');
    process.exit(0);
  } else {
    console.log('\n✅ All validations passed!');
    process.exit(0);
  }
}

if (require.main === module) {
  runValidation();
}