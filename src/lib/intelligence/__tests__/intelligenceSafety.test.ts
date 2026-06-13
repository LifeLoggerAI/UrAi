import {
  getSafetyBandForInput,
  isLayerAllowedForSymbolicInference,
  sanitizeSymbolicSummary,
  shouldBlockRawSensitiveInput,
} from '../intelligenceSafety';
import { SymbolicInputSummary } from '../intelligenceTypes';

describe('intelligenceSafety', () => {
  describe('isLayerAllowedForSymbolicInference', () => {
    it('should allow if the layer is in the open list', () => {
      expect(isLayerAllowedForSymbolicInference('layer1', ['layer1', 'layer2'])).toBe(true);
    });

    it('should deny if the layer is not in the open list', () => {
      expect(isLayerAllowedForSymbolicInference('layer3', ['layer1', 'layer2'])).toBe(false);
    });
  });

  describe('shouldBlockRawSensitiveInput', () => {
    it('should block inputs with PII', () => {
      const input: SymbolicInputSummary = {
        id: '1',
        layerId: 'test',
        kind: "system_summary",
        summary: 'My email is test@example.com',
        createdAt: '',
        intensity: 0,
      };
      expect(shouldBlockRawSensitiveInput(input)).toBe(true);
    });

    it('should not block inputs without PII', () => {
      const input: SymbolicInputSummary = {
        id: '1',
        layerId: 'test',
        kind: "system_summary",
        summary: 'This is a test summary',
        createdAt: '',
        intensity: 0,
      };
      expect(shouldBlockRawSensitiveInput(input)).toBe(false);
    });
  });

  describe('sanitizeSymbolicSummary', () => {
    it('should redact emails', () => {
      const summary = 'My email is test@example.com';
      expect(sanitizeSymbolicSummary(summary)).toBe('My email is [email removed]');
    });

    it('should redact phone numbers', () => {
      const summary = 'My phone number is 123-456-7890';
      expect(sanitizeSymbolicSummary(summary)).toBe('My phone number is [phone number removed]');
    });

    it('should not redact GPS coordinates', () => {
      const summary = 'My location is 34.0522 N, 118.2437 W';
      expect(sanitizeSymbolicSummary(summary)).toBe('My location is 34.0522 N, 118.2437 W');
    });
  });

  describe('getSafetyBandForInput', () => {
    it('should return "blocked" for inputs with PII', () => {
      const input: SymbolicInputSummary = {
        id: '1',
        layerId: 'test',
        kind: "system_summary",
        summary: 'My email is test@example.com',
        createdAt: '',
        intensity: 0,
      };
      expect(getSafetyBandForInput(input)).toBe('blocked');
    });

    it('should return "safe" for inputs without PII', () => {
      const input: SymbolicInputSummary = {
        id: '1',
        layerId: 'test',
        kind: "system_summary",
        summary: 'This is a test summary',
        createdAt: '',
        intensity: 0,
      };
      expect(getSafetyBandForInput(input)).toBe('safe');
    });
  });
});
