#!/usr/bin/env node

/**
 * B2B API Demo Script
 * 
 * Demonstrates how to use the B2B API endpoints with different authentication levels
 * 
 * Usage: node scripts/demo-b2b-api.js
 */

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

// Demo API keys for different tiers
const apiKeys = {
  trial: 'trial_key_12345',
  standard: 'standard_key_67890', 
  premium: 'premium_key_abcde'
};

// Mock user for testing
const testUserId = 'demo-user-123';

async function makeRequest(endpoint, apiKey, params = {}) {
  const url = new URL(`${baseUrl}/api/v1/${endpoint}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

async function demo() {
  console.log('🚀 B2B API Demo');
  console.log('================\n');

  // Test 1: Authentication with different tiers
  console.log('1. Testing Authentication');
  console.log('-------------------------');
  
  for (const [tier, apiKey] of Object.entries(apiKeys)) {
    console.log(`\n${tier.toUpperCase()} tier:`);
    const result = await makeRequest('memories', apiKey, { userId: testUserId, pageSize: 5 });
    
    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    } else if (result.status === 401) {
      console.log(`❌ Unauthorized: ${result.data.error}`);
    } else if (result.status === 200) {
      console.log(`✅ Authenticated successfully`);
      console.log(`   Total records available: ${result.data.pagination?.total || 0}`);
    } else {
      console.log(`⚠️  Status ${result.status}: ${result.data.error || 'Unknown error'}`);
    }
  }

  // Test 2: Memories API with filtering
  console.log('\n\n2. Testing Memories API');
  console.log('------------------------');
  
  const memoriesTests = [
    { desc: 'All memories (first page)', params: { userId: testUserId, page: 1, pageSize: 10 } },
    { desc: 'Filter by emotion', params: { userId: testUserId, emotion: 'happy' } },
    { desc: 'Filter by date range', params: { 
      userId: testUserId, 
      startDate: '1640995200000', // 2022-01-01
      endDate: '1672531200000'    // 2023-01-01
    }},
    { desc: 'Filter by tags', params: { userId: testUserId, tags: 'work,family' } },
    { desc: 'Sort by sentiment', params: { userId: testUserId, sortBy: 'sentimentScore', sortOrder: 'desc' } }
  ];

  for (const test of memoriesTests) {
    console.log(`\n${test.desc}:`);
    const result = await makeRequest('memories', apiKeys.standard, test.params);
    
    if (result.status === 200) {
      const { data, pagination, meta } = result.data;
      console.log(`✅ Found ${data.length} memories`);
      console.log(`   Pagination: page ${pagination.page}/${Math.ceil(pagination.total / pagination.pageSize)}`);
      console.log(`   Filters applied: ${JSON.stringify(meta.filters)}`);
    } else {
      console.log(`❌ Error: ${result.data.error}`);
    }
  }

  // Test 3: Tags API
  console.log('\n\n3. Testing Tags API');
  console.log('-------------------');
  
  const tagsTests = [
    { desc: 'All tags', params: { userId: testUserId } },
    { desc: 'People tags only', params: { userId: testUserId, category: 'people' } },
    { desc: 'Emotion tags only', params: { userId: testUserId, category: 'emotions' } }
  ];

  for (const test of tagsTests) {
    console.log(`\n${test.desc}:`);
    const result = await makeRequest('tags', apiKeys.standard, test.params);
    
    if (result.status === 200) {
      const { data, meta } = result.data;
      console.log(`✅ Found ${data.length} unique tags`);
      console.log(`   Category filter: ${meta.category}`);
      if (data.length > 0) {
        console.log(`   Top tag: "${data[0].tag}" (${data[0].frequency} occurrences)`);
      }
    } else {
      console.log(`❌ Error: ${result.data.error}`);
    }
  }

  // Test 4: Metadata API
  console.log('\n\n4. Testing Metadata API');
  console.log('-----------------------');
  
  const metadataTests = [
    { desc: 'Usage metadata', params: { userId: testUserId, type: 'usage' } },
    { desc: 'Analytics metadata', params: { userId: testUserId, type: 'analytics' } },
    { desc: 'Summary metadata', params: { userId: testUserId, type: 'summary' } }
  ];

  for (const test of metadataTests) {
    console.log(`\n${test.desc}:`);
    const result = await makeRequest('metadata', apiKeys.standard, test.params);
    
    if (result.status === 200) {
      const { data, meta } = result.data;
      console.log(`✅ Retrieved ${meta.metricType} metadata`);
      console.log(`   Data keys: ${Object.keys(data).join(', ')}`);
    } else {
      console.log(`❌ Error: ${result.data.error}`);
    }
  }

  // Test 5: Embeddings API (Premium feature)
  console.log('\n\n5. Testing Embeddings API');
  console.log('-------------------------');
  
  console.log('\nTrying with Trial key (should fail):');
  let result = await makeRequest('embeddings', apiKeys.trial, { userId: testUserId });
  if (result.status === 403) {
    console.log(`❌ Forbidden (expected): ${result.data.error}`);
  }

  console.log('\nTrying with Standard key (should work):');
  result = await makeRequest('embeddings', apiKeys.standard, { 
    userId: testUserId, 
    query: 'feeling happy about work',
    threshold: 0.7,
    limit: 5
  });
  if (result.status === 200) {
    const { data, meta } = result.data;
    console.log(`✅ Found ${data.length} similar memories`);
    console.log(`   Query: "${meta.query}"`);
    console.log(`   Similarity threshold: ${meta.similarityThreshold}`);
    console.log(`   Note: ${meta.note}`);
  } else {
    console.log(`❌ Error: ${result.data.error}`);
  }

  // Test 6: Error handling
  console.log('\n\n6. Testing Error Handling');
  console.log('-------------------------');
  
  const errorTests = [
    { desc: 'Missing userId', endpoint: 'memories', params: {} },
    { desc: 'Invalid API key', endpoint: 'memories', apiKey: 'invalid_key', params: { userId: testUserId } },
    { desc: 'Page size too large', endpoint: 'memories', params: { userId: testUserId, pageSize: 150 } },
    { desc: 'Embeddings limit too high', endpoint: 'embeddings', params: { userId: testUserId, limit: 100 } }
  ];

  for (const test of errorTests) {
    console.log(`\n${test.desc}:`);
    const result = await makeRequest(test.endpoint, test.apiKey || apiKeys.standard, test.params);
    
    if (result.status >= 400) {
      console.log(`✅ Error handled correctly (${result.status}): ${result.data.error}`);
    } else {
      console.log(`❌ Expected error but got success`);
    }
  }

  console.log('\n\n🎉 Demo Complete!');
  console.log('\nNext Steps:');
  console.log('- Start the development server: npm run dev');
  console.log('- Initialize partner keys: node scripts/init-b2b-partners.js');
  console.log('- Run the full test suite: npm test');
  console.log('- Check the OpenAPI documentation: docs/b2b-api-openapi.yaml');
}

// Run demo if this file is executed directly
if (require.main === module) {
  demo().catch(console.error);
}

module.exports = { demo, makeRequest, apiKeys };