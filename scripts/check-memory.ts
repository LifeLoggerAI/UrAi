#!/usr/bin/env tsx

/**
 * @fileOverview Memory system verification script
 * 
 * This script tests the basic functionality of the memory system:
 * - Writes a test memory
 * - Reads it back 
 * - Logs success/failure
 * - Exits with code 0 on success, 1 on failure
 */

import { MemoryService } from '../src/lib/memory-service';

async function checkMemorySystem(): Promise<boolean> {
  try {
    console.log('🧠 Checking Memory & Cross-Reference System...');
    
    const testUserId = 'test-user-' + Date.now();
    const testTag = 'verification-test';
    const testPayload = {
      message: 'Memory system verification test',
      timestamp: Date.now(),
      features: ['save', 'retrieve', 'cross-reference'],
      success: true
    };

    // Step 1: Save a test memory
    console.log('📝 Saving test memory...');
    await MemoryService.saveMemory(testUserId, testTag, testPayload, 'verification-script');
    console.log('✅ Memory saved successfully');

    // Step 2: Retrieve the memory
    console.log('🔍 Retrieving test memory...');
    const memories = await MemoryService.getMemories(testUserId, testTag);
    
    if (memories.length === 0) {
      console.error('❌ No memories found');
      return false;
    }

    // Step 3: Validate the retrieved memory
    console.log('🔬 Validating retrieved memory...');
    const retrievedMemory = memories[0];
    
    if (retrievedMemory.userId !== testUserId) {
      console.error('❌ UserId mismatch:', retrievedMemory.userId, 'vs', testUserId);
      return false;
    }

    if (retrievedMemory.tag !== testTag) {
      console.error('❌ Tag mismatch:', retrievedMemory.tag, 'vs', testTag);
      return false;
    }

    if (JSON.stringify(retrievedMemory.payload) !== JSON.stringify(testPayload)) {
      console.error('❌ Payload mismatch');
      console.error('Expected:', testPayload);
      console.error('Actual:', retrievedMemory.payload);
      return false;
    }

    // Step 4: Test tag pattern matching
    console.log('🏷️  Testing tag pattern matching...');
    const patternMemories = await MemoryService.getMemories(testUserId, 'verification-*');
    
    if (patternMemories.length === 0) {
      console.error('❌ Pattern matching failed');
      return false;
    }

    // Step 5: Test multiple tag retrieval
    console.log('📚 Testing multiple tag retrieval...');
    await MemoryService.saveMemory(testUserId, 'test-tag-2', { content: 'second test' }, 'verification-script');
    
    const multipleTags = await MemoryService.getMemoriesByTags(testUserId, [testTag, 'test-tag-2']);
    
    if (multipleTags.length < 2) {
      console.error('❌ Multiple tag retrieval failed');
      return false;
    }

    console.log('✅ All memory system checks passed!');
    console.log(`📊 Retrieved ${memories.length} memories for user ${testUserId}`);
    console.log(`🏷️  Pattern matching found ${patternMemories.length} memories`);
    console.log(`📚 Multiple tag retrieval found ${multipleTags.length} memories`);
    
    return true;

  } catch (error) {
    console.error('❌ Memory system check failed:');
    console.error(error);
    return false;
  }
}

// Run the verification
async function main() {
  console.log('🚀 Starting Memory System Verification...\n');
  
  const success = await checkMemorySystem();
  
  console.log('\n📋 Verification Summary:');
  if (success) {
    console.log('✅ Memory & Cross-Reference System is working correctly!');
    console.log('🎉 All tests passed - system ready for production use');
    process.exit(0);
  } else {
    console.log('❌ Memory & Cross-Reference System has issues');
    console.log('🔧 Please check the configuration and try again');
    process.exit(1);
  }
}

// Handle unhandled errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

// Run the main function
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});