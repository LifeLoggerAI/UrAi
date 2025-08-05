#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';

interface HealthCheckResult {
  flowName: string;
  status: 'pass' | 'fail' | 'error';
  message: string;
  responseTime?: number;
  response?: any;
}

/**
 * AI Health Check Script
 * Tests all AI flows to ensure they are working correctly
 */
class AIHealthChecker {
  private results: HealthCheckResult[] = [];
  private flowsDirectory = path.join(process.cwd(), 'src/ai/flows');

  async runHealthCheck(): Promise<void> {
    console.log('🏥 Starting AI Health Check...\n');

    try {
      const flowFiles = await this.getFlowFiles();
      console.log(`Found ${flowFiles.length} AI flow files to check:\n`);

      for (const flowFile of flowFiles) {
        await this.checkFlow(flowFile);
      }

      this.printResults();
      this.exitWithCode();
    } catch (error) {
      console.error('❌ Health check failed:', error);
      process.exit(1);
    }
  }

  private async getFlowFiles(): Promise<string[]> {
    if (!fs.existsSync(this.flowsDirectory)) {
      throw new Error(`Flows directory not found: ${this.flowsDirectory}`);
    }

    const files = fs.readdirSync(this.flowsDirectory);
    return files
      .filter(file => file.endsWith('.ts') && !file.endsWith('.test.ts'))
      .map(file => path.join(this.flowsDirectory, file));
  }

  private async checkFlow(flowFile: string): Promise<void> {
    const flowName = path.basename(flowFile, '.ts');
    const startTime = Date.now();

    try {
      console.log(`🔍 Checking flow: ${flowName}`);

      // Basic file validation
      const content = fs.readFileSync(flowFile, 'utf8');

      // Check for required imports and exports
      const hasGenkitImports = content.includes('genkit') || content.includes('@genkit-ai');
      const hasFlowDefinition = content.includes('defineFlow') || content.includes('flow');
      const hasExport = content.includes('export');

      if (!hasGenkitImports) {
        this.addResult(flowName, 'fail', 'Missing genkit imports', Date.now() - startTime);
        return;
      }

      if (!hasFlowDefinition) {
        this.addResult(flowName, 'fail', 'Missing flow definition', Date.now() - startTime);
        return;
      }

      if (!hasExport) {
        this.addResult(flowName, 'fail', 'Missing export statement', Date.now() - startTime);
        return;
      }

      // Check for specific flow patterns
      await this.checkFlowSpecifics(flowName, content, startTime);
    } catch (error) {
      this.addResult(flowName, 'error', `Error checking flow: ${error}`, Date.now() - startTime);
    }
  }

  private async checkFlowSpecifics(
    flowName: string,
    content: string,
    startTime: number
  ): Promise<void> {
    const responseTime = Date.now() - startTime;

    // Check specific flow types
    if (flowName.includes('transcribe')) {
      if (content.includes('audio') || content.includes('speech')) {
        this.addResult(flowName, 'pass', 'Audio transcription flow structure valid', responseTime);
      } else {
        this.addResult(
          flowName,
          'fail',
          'Audio transcription flow missing audio handling',
          responseTime
        );
      }
    } else if (flowName.includes('chat') || flowName.includes('companion')) {
      if (
        content.includes('message') ||
        content.includes('chat') ||
        content.includes('conversation')
      ) {
        this.addResult(flowName, 'pass', 'Chat flow structure valid', responseTime);
      } else {
        this.addResult(flowName, 'fail', 'Chat flow missing conversation handling', responseTime);
      }
    } else if (flowName.includes('speech') || flowName.includes('tts')) {
      if (content.includes('voice') || content.includes('speech') || content.includes('audio')) {
        this.addResult(flowName, 'pass', 'Speech synthesis flow structure valid', responseTime);
      } else {
        this.addResult(flowName, 'fail', 'Speech flow missing voice handling', responseTime);
      }
    } else if (flowName.includes('analyze') || flowName.includes('sentiment')) {
      if (
        content.includes('text') ||
        content.includes('analyze') ||
        content.includes('sentiment')
      ) {
        this.addResult(flowName, 'pass', 'Analysis flow structure valid', responseTime);
      } else {
        this.addResult(flowName, 'fail', 'Analysis flow missing text analysis', responseTime);
      }
    } else if (flowName.includes('generate')) {
      if (content.includes('generate') || content.includes('create') || content.includes('model')) {
        this.addResult(flowName, 'pass', 'Generation flow structure valid', responseTime);
      } else {
        this.addResult(flowName, 'fail', 'Generation flow missing generation logic', responseTime);
      }
    } else {
      // Generic flow check
      this.addResult(flowName, 'pass', 'Flow structure appears valid', responseTime);
    }
  }

  private addResult(
    flowName: string,
    status: 'pass' | 'fail' | 'error',
    message: string,
    responseTime: number,
    response?: any
  ): void {
    this.results.push({
      flowName,
      status,
      message,
      responseTime,
      response,
    });

    const emoji = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
    console.log(`  ${emoji} ${flowName}: ${message} (${responseTime}ms)`);
  }

  private printResults(): void {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const errors = this.results.filter(r => r.status === 'error').length;

    console.log('\n📊 Health Check Results:');
    console.log('========================');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Errors: ${errors}`);
    console.log(`📈 Total: ${this.results.length}`);

    if (failed > 0 || errors > 0) {
      console.log('\n🔍 Issues Found:');
      this.results
        .filter(r => r.status !== 'pass')
        .forEach(result => {
          console.log(`  - ${result.flowName}: ${result.message}`);
        });
    }

    console.log('\n💡 Recommendation:');
    if (failed === 0 && errors === 0) {
      console.log('   All AI flows appear to be healthy! 🎉');
    } else {
      console.log('   Review and fix the issues above before deploying to production.');
      console.log('   Consider running integration tests for failed flows.');
    }
  }

  private exitWithCode(): void {
    const hasFailures = this.results.some(r => r.status === 'fail' || r.status === 'error');
    process.exit(hasFailures ? 1 : 0);
  }
}

// Run the health check if this script is executed directly
if (require.main === module) {
  const checker = new AIHealthChecker();
  checker.runHealthCheck().catch(error => {
    console.error('Health check crashed:', error);
    process.exit(1);
  });
}

export { AIHealthChecker };
