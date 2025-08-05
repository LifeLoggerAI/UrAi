/**
 * B2B API Integration Tests
 * 
 * Tests the B2B API endpoints for authentication, data access, pagination, and filtering
 */

import { NextRequest } from 'next/server';

// Mock Firebase before importing our modules
jest.mock('@/lib/firebase', () => ({
  db: {}
}));

// Mock Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn()
}));

// Mock B2B auth
jest.mock('@/lib/b2b-auth', () => ({
  verifyApiKey: jest.fn()
}));

// Now import our handlers
import { GET as memoriesHandler } from '@/app/api/v1/memories/route';
import { GET as tagsHandler } from '@/app/api/v1/tags/route';
import { GET as metadataHandler } from '@/app/api/v1/metadata/route';
import { GET as embeddingsHandler } from '@/app/api/v1/embeddings/route';

const { verifyApiKey } = require('@/lib/b2b-auth');
const { getDocs, getDoc } = require('firebase/firestore');

describe('B2B API Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reject requests without authorization header', async () => {
    verifyApiKey.mockResolvedValue({
      success: false,
      error: 'Missing or invalid authorization header. Use "Bearer <api_key>"'
    });

    const request = new NextRequest('http://localhost:3000/api/v1/memories?userId=test-user');
    const response = await memoriesHandler(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Missing or invalid authorization header. Use "Bearer <api_key>"');
  });

  it('should reject requests with invalid API key', async () => {
    verifyApiKey.mockResolvedValue({
      success: false,
      error: 'Invalid API key'
    });

    const request = new NextRequest('http://localhost:3000/api/v1/memories?userId=test-user', {
      headers: { authorization: 'Bearer invalid_key' }
    });
    const response = await memoriesHandler(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid API key');
  });

  it('should accept requests with valid API key', async () => {
    verifyApiKey.mockResolvedValue({
      success: true,
      partnerId: 'partner-123',
      permissions: ['read:memories']
    });

    getDocs.mockResolvedValue({
      docs: []
    });

    const request = new NextRequest('http://localhost:3000/api/v1/memories?userId=test-user', {
      headers: { authorization: 'Bearer valid_key' }
    });
    const response = await memoriesHandler(request);

    expect(response.status).toBe(200);
    expect(verifyApiKey).toHaveBeenCalledWith(request);
  });
});

describe('B2B API Memories Endpoint', () => {
  beforeEach(() => {
    verifyApiKey.mockResolvedValue({
      success: true,
      partnerId: 'partner-123',
      permissions: ['read:memories']
    });
    jest.clearAllMocks();
  });

  it('should require userId parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/v1/memories', {
      headers: { authorization: 'Bearer valid_key' }
    });
    const response = await memoriesHandler(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('userId parameter is required');
  });

  it('should limit page size to 100', async () => {
    const request = new NextRequest('http://localhost:3000/api/v1/memories?userId=test-user&pageSize=150', {
      headers: { authorization: 'Bearer valid_key' }
    });
    const response = await memoriesHandler(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('pageSize cannot exceed 100');
  });

  it('should return paginated memories data', async () => {
    const mockVoiceEvents = [
      {
        id: 'voice-1',
        data: () => ({
          uid: 'test-user',
          text: 'Test voice memory',
          emotion: 'happy',
          sentimentScore: 0.8,
          createdAt: Date.now(),
          people: ['Alice'],
          tasks: ['task1']
        })
      }
    ];

    getDocs.mockResolvedValue({
      docs: mockVoiceEvents
    });

    const request = new NextRequest('http://localhost:3000/api/v1/memories?userId=test-user&page=1&pageSize=10', {
      headers: { authorization: 'Bearer valid_key' }
    });
    const response = await memoriesHandler(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination).toEqual({
      page: 1,
      pageSize: 10,
      total: expect.any(Number),
      hasNext: expect.any(Boolean)
    });
    expect(data.meta.includedCollections).toContain('voiceEvents');
  });

  it('should filter by emotion', async () => {
    getDocs.mockResolvedValue({ docs: [] });

    const request = new NextRequest('http://localhost:3000/api/v1/memories?userId=test-user&emotion=happy', {
      headers: { authorization: 'Bearer valid_key' }
    });
    const response = await memoriesHandler(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.meta.filters.emotion).toBe('happy');
  });

  it('should filter by date range', async () => {
    getDocs.mockResolvedValue({ docs: [] });

    const startDate = '1609459200000'; // 2021-01-01
    const endDate = '1640995200000';   // 2022-01-01

    const request = new NextRequest(`http://localhost:3000/api/v1/memories?userId=test-user&startDate=${startDate}&endDate=${endDate}`, {
      headers: { authorization: 'Bearer valid_key' }
    });
    const response = await memoriesHandler(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.meta.filters.dateRange).toEqual({
      start: startDate,
      end: endDate
    });
  });

  it('should filter by tags', async () => {
    getDocs.mockResolvedValue({ docs: [] });

    const request = new NextRequest('http://localhost:3000/api/v1/memories?userId=test-user&tags=Alice,work', {
      headers: { authorization: 'Bearer valid_key' }
    });
    const response = await memoriesHandler(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.meta.filters.tags).toEqual(['Alice', 'work']);
  });
});

describe('B2B API Tags Endpoint', () => {
  beforeEach(() => {
    verifyApiKey.mockResolvedValue({
      success: true,
      partnerId: 'partner-123',
      permissions: ['read:memories']
    });
    jest.clearAllMocks();
  });

  it('should return aggregated tag data', async () => {
    getDocs.mockResolvedValue({ docs: [] });

    const request = new NextRequest('http://localhost:3000/api/v1/tags?userId=test-user', {
      headers: { authorization: 'Bearer valid_key' }
    });
    const response = await tagsHandler(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toBeInstanceOf(Array);
    expect(data.meta.userId).toBe('test-user');
  });

  it('should filter tags by category', async () => {
    getDocs.mockResolvedValue({ docs: [] });

    const request = new NextRequest('http://localhost:3000/api/v1/tags?userId=test-user&category=people', {
      headers: { authorization: 'Bearer valid_key' }
    });
    const response = await tagsHandler(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.meta.category).toBe('people');
  });
});

describe('B2B API Embeddings Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should require embeddings permission', async () => {
    verifyApiKey.mockResolvedValue({
      success: true,
      partnerId: 'partner-123',
      permissions: ['read:memories'] // Missing read:embeddings
    });

    const request = new NextRequest('http://localhost:3000/api/v1/embeddings?userId=test-user', {
      headers: { authorization: 'Bearer valid_key' }
    });
    const response = await embeddingsHandler(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toContain('Insufficient permissions');
  });

  it('should return embeddings for users with proper permissions', async () => {
    verifyApiKey.mockResolvedValue({
      success: true,
      partnerId: 'partner-123',
      permissions: ['read:memories', 'read:embeddings']
    });

    getDocs.mockResolvedValue({ docs: [] });

    const request = new NextRequest('http://localhost:3000/api/v1/embeddings?userId=test-user', {
      headers: { authorization: 'Bearer valid_key' }
    });
    const response = await embeddingsHandler(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toBeInstanceOf(Array);
    expect(data.meta.note).toContain('Embedding vectors are simulated');
  });

  it('should limit results to 50', async () => {
    verifyApiKey.mockResolvedValue({
      success: true,
      partnerId: 'partner-123',
      permissions: ['read:embeddings']
    });

    const request = new NextRequest('http://localhost:3000/api/v1/embeddings?userId=test-user&limit=100', {
      headers: { authorization: 'Bearer valid_key' }
    });
    const response = await embeddingsHandler(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('limit cannot exceed 50');
  });
});

describe('B2B API Error Handling', () => {
  beforeEach(() => {
    verifyApiKey.mockResolvedValue({
      success: true,
      partnerId: 'partner-123',
      permissions: ['read:memories']
    });
    jest.clearAllMocks();
  });

  it('should handle database errors gracefully', async () => {
    getDocs.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/v1/memories?userId=test-user', {
      headers: { authorization: 'Bearer valid_key' }
    });
    const response = await memoriesHandler(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });

  it('should handle authentication service errors', async () => {
    verifyApiKey.mockResolvedValue({
      success: false,
      error: 'Authentication service unavailable'
    });

    const request = new NextRequest('http://localhost:3000/api/v1/memories?userId=test-user', {
      headers: { authorization: 'Bearer valid_key' }
    });
    const response = await memoriesHandler(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Authentication service unavailable');
  });
});