import {
  clampScore,
  confidenceFromScore,
  isLayerAllowedForSymbolicInference,
  shouldBlockRawSensitiveInput,
  sanitizeSymbolicSummary,
  getSafetyBandForInput,
  makeUncertaintyPrefix
} from './intelligenceSafety';

describe('Intelligence Safety Functions', () => {
  describe('clampScore', () => {
    it('should clamp values to be within 0 and 100', () => {
      expect(clampScore(110)).toBe(100);
      expect(clampScore(-10)).toBe(0);
      expect(clampScore(50)).toBe(50);
      expect(clampScore(NaN)).toBe(0);
    });
  });

  describe('confidenceFromScore', () => {
    it('should return the correct confidence level for a given score', () => {
      expect(confidenceFromScore(30)).toBe('low');
      expect(confidenceFromScore(60)).toBe('medium');
      expect(confidenceFromScore(90)).toBe('high');
    });
  });

  describe('isLayerAllowedForSymbolicInference', () => {
    it('should return true if the layer is in the open layers list', () => {
      expect(isLayerAllowedForSymbolicInference('layer1', ['layer1', 'layer2'])).toBe(true);
    });
    it('should return false if the layer is not in the open layers list', () => {
      expect(isLayerAllowedForSymbolicInference('layer3', ['layer1', 'layer2'])).toBe(false);
    });
  });

  describe('shouldBlockRawSensitiveInput', () => {
    it('should block inputs with sensitive raw data flag', () => {
      expect(shouldBlockRawSensitiveInput({ summary: '', containsSensitiveRawData: true })).toBe(true);
    });
    it('should block inputs with GPS coordinates', () => {
      expect(shouldBlockRawSensitiveInput({ summary: 'I am at 40.7128, -74.0060' })).toBe(true);
    });
    it('should block inputs with email addresses', () => {
      expect(shouldBlockRawSensitiveInput({ summary: 'My email is test@example.com' })).toBe(true);
    });
    it('should block inputs with phone numbers', () => {
      expect(shouldBlockRawSensitiveInput({ summary: 'My number is 555-555-5555' })).toBe(true);
    });
  });

  describe('sanitizeSymbolicSummary', () => {
    it('should sanitize email addresses from the summary', () => {
      expect(sanitizeSymbolicSummary('My email is test@example.com')).toBe('My email is [REDACTED_EMAIL]');
    });
    it('should sanitize phone numbers from the summary', () => {
      expect(sanitizeSymbolicSummary('My number is 555-555-5555')).toBe('My number is [REDACTED_PHONE]');
    });
    it('should sanitize GPS coordinates from the summary', () => {
      expect(sanitizeSymbolicSummary('I am at 40.7128, -74.0060')).toBe('I am at [REDACTED_GPS]');
    });
  });

  describe('getSafetyBandForInput', () => {
    it('should return danger for PII input', () => {
      expect(getSafetyBandForInput({ summary: 'I am at 40.7128, -74.0060' })).toBe('danger');
    });
  });

  describe('makeUncertaintyPrefix', () => {
    it('should return the correct prefix for each confidence level', () => {
      expect(makeUncertaintyPrefix('low')).toBe('A faint pattern may be forming:');
      expect(makeUncertaintyPrefix('medium')).toBe('A possible pattern is emerging:');
      expect(makeUncertaintyPrefix('high')).toBe('A stronger symbolic pattern appears:');
    });
  });
});
