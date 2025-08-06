/**
 * @fileOverview Test suite for AI model functions
 */

import { AIClient, AIClientError } from '../../src/ai/client';
import type { 
  CompanionChatInput,
  AnalyzeDreamInput,
  TranscribeAudioInput,
  AnalyzeTextSentimentInput
} from '../../src/lib/types';

// Mock the AI flows for testing
jest.mock('../../src/ai/flows/companion-chat', () => ({
  companionChat: jest.fn()
}));

jest.mock('../../src/ai/flows/analyze-dream', () => ({
  analyzeDream: jest.fn()
}));

jest.mock('../../src/ai/flows/transcribe-audio', () => ({
  transcribeAudio: jest.fn()
}));

jest.mock('../../src/ai/flows/analyze-text-sentiment', () => ({
  analyzeTextSentiment: jest.fn()
}));

describe('AI Client', () => {
  let aiClient: AIClient;

  beforeEach(() => {
    aiClient = new AIClient();
    jest.clearAllMocks();
  });

  describe('companionChat', () => {
    it('should handle valid chat input', async () => {
      const mockCompanionChat = require('../../src/ai/flows/companion-chat').companionChat;
      const mockResponse = { response: 'Hello! How are you feeling today?' };
      mockCompanionChat.mockResolvedValue(mockResponse);

      const input: CompanionChatInput = {
        history: [{ role: 'user', content: 'Hello' }],
        message: 'How can you help me?'
      };

      const result = await aiClient.companionChat(input);
      
      expect(result).toEqual(mockResponse);
      expect(mockCompanionChat).toHaveBeenCalledWith(input);
    });

    it('should handle companion chat errors', async () => {
      const mockCompanionChat = require('../../src/ai/flows/companion-chat').companionChat;
      mockCompanionChat.mockRejectedValue(new Error('API Error'));

      const input: CompanionChatInput = {
        history: [],
        message: 'Test message'
      };

      await expect(aiClient.companionChat(input)).rejects.toThrow(AIClientError);
    });

    it('should retry on retryable errors', async () => {
      const mockCompanionChat = require('../../src/ai/flows/companion-chat').companionChat;
      mockCompanionChat
        .mockRejectedValueOnce(new Error('service unavailable'))
        .mockResolvedValue({ response: 'Success after retry' });

      const input: CompanionChatInput = {
        history: [],
        message: 'Test message'
      };

      const result = await aiClient.companionChat(input);
      
      expect(result.response).toBe('Success after retry');
      expect(mockCompanionChat).toHaveBeenCalledTimes(2);
    });
  });

  describe('analyzeDream', () => {
    it('should analyze dream content correctly', async () => {
      const mockAnalyzeDream = require('../../src/ai/flows/analyze-dream').analyzeDream;
      const mockResponse = {
        emotions: ['anxious', 'curious'],
        themes: ['exploration', 'unknown'],
        symbols: ['dark forest', 'hidden door'],
        sentimentScore: 0.2
      };
      mockAnalyzeDream.mockResolvedValue(mockResponse);

      const input: AnalyzeDreamInput = {
        text: 'I dreamed I was walking through a dark forest and found a hidden door.'
      };

      const result = await aiClient.analyzeDream(input);
      
      expect(result).toEqual(mockResponse);
      expect(result.emotions).toContain('anxious');
      expect(result.symbols).toContain('dark forest');
    });

    it('should handle null responses from dream analysis', async () => {
      const mockAnalyzeDream = require('../../src/ai/flows/analyze-dream').analyzeDream;
      mockAnalyzeDream.mockResolvedValue(null);

      const input: AnalyzeDreamInput = {
        text: 'Short dream'
      };

      await expect(aiClient.analyzeDream(input)).rejects.toThrow('analyzeDream returned null result');
    });
  });

  describe('transcribeAudio', () => {
    it('should transcribe audio data URI', async () => {
      const mockTranscribeAudio = require('../../src/ai/flows/transcribe-audio').transcribeAudio;
      const mockResponse = { transcript: 'Hello, this is a test audio message.' };
      mockTranscribeAudio.mockResolvedValue(mockResponse);

      const input: TranscribeAudioInput = {
        audioDataUri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGMcBjiR1'
      };

      const result = await aiClient.transcribeAudio(input);
      
      expect(result).toEqual(mockResponse);
      expect(result.transcript).toBeDefined();
    });
  });

  describe('analyzeTextSentiment', () => {
    it('should analyze text sentiment correctly', async () => {
      const mockAnalyzeTextSentiment = require('../../src/ai/flows/analyze-text-sentiment').analyzeTextSentiment;
      const mockResponse = { sentimentScore: 0.8 };
      mockAnalyzeTextSentiment.mockResolvedValue(mockResponse);

      const input: AnalyzeTextSentimentInput = {
        text: 'I had a wonderful day today! Everything went perfectly.'
      };

      const result = await aiClient.analyzeTextSentiment(input);
      
      expect(result).toEqual(mockResponse);
      expect(result.sentimentScore).toBeGreaterThan(0);
    });

    it('should handle negative sentiment', async () => {
      const mockAnalyzeTextSentiment = require('../../src/ai/flows/analyze-text-sentiment').analyzeTextSentiment;
      const mockResponse = { sentimentScore: -0.6 };
      mockAnalyzeTextSentiment.mockResolvedValue(mockResponse);

      const input: AnalyzeTextSentimentInput = {
        text: 'I feel terrible today. Nothing is going right.'
      };

      const result = await aiClient.analyzeTextSentiment(input);
      
      expect(result.sentimentScore).toBeLessThan(0);
    });
  });

  describe('error handling', () => {
    it('should not retry on non-retryable errors', async () => {
      const mockCompanionChat = require('../../src/ai/flows/companion-chat').companionChat;
      mockCompanionChat.mockRejectedValue(new Error('Invalid input format'));

      const input: CompanionChatInput = {
        history: [],
        message: ''
      };

      await expect(aiClient.companionChat(input)).rejects.toThrow(AIClientError);
      expect(mockCompanionChat).toHaveBeenCalledTimes(1); // No retry
    });
  });

  describe('input validation', () => {
    it('should handle empty chat messages', async () => {
      const mockCompanionChat = require('../../src/ai/flows/companion-chat').companionChat;
      mockCompanionChat.mockResolvedValue({ response: 'I notice you didn\'t say anything. How can I help?' });

      const input: CompanionChatInput = {
        history: [],
        message: ''
      };

      const result = await aiClient.companionChat(input);
      expect(result.response).toBeDefined();
    });

    it('should handle very long text input', async () => {
      const mockAnalyzeTextSentiment = require('../../src/ai/flows/analyze-text-sentiment').analyzeTextSentiment;
      mockAnalyzeTextSentiment.mockResolvedValue({ sentimentScore: 0.1 });

      const longText = 'A'.repeat(10000);
      const input: AnalyzeTextSentimentInput = { text: longText };

      const result = await aiClient.analyzeTextSentiment(input);
      expect(result.sentimentScore).toBeDefined();
    });
  });
});