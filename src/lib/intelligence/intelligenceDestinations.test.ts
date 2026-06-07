import {
  toLifeMapStarDraft,
  toGroundBloomDraft,
  toMirrorReflectionDraft,
  toRitualSuggestionDraft,
} from './intelligenceDestinations';
import { IntelligenceSignal } from './intelligenceTypes';

describe('Intelligence Destination Converters', () => {
  const now = new Date().toISOString();

  const makeSignal = (suggestedDestination: IntelligenceSignal['suggestedDestination']): IntelligenceSignal => ({
    id: 'test-signal',
    title: 'Test Signal',
    summary: 'This is a test summary.',
    confidence: 'medium',
    createdAt: now,
    moodState: 'hopeful',
    suggestedDestination,
  });

  describe('toLifeMapStarDraft', () => {
    it('should convert a lifemap signal to a LifeMapStarDraft', () => {
      const signal = makeSignal('lifemap');
      const draft = toLifeMapStarDraft(signal);
      expect(draft).not.toBeNull();
      expect(draft?.userApproved).toBe(false);
      expect(draft?.sourceSignalId).toBe('test-signal');
      expect(draft?.id).toBe('test-signal-lifemap-draft');
    });

    it('should return null for non-lifemap signals', () => {
      const signal = makeSignal('ground');
      const draft = toLifeMapStarDraft(signal);
      expect(draft).toBeNull();
    });
  });

  describe('toGroundBloomDraft', () => {
    it('should convert a ground signal to a GroundBloomDraft', () => {
      const signal = makeSignal('ground');
      const draft = toGroundBloomDraft(signal);
      expect(draft).not.toBeNull();
      expect(draft?.userApproved).toBe(false);
      expect(draft?.sourceSignalId).toBe('test-signal');
      expect(draft?.id).toBe('test-signal-ground-draft');
      expect(draft?.bloomType).toBe('unknown');
    });

    it('should return null for non-ground signals', () => {
      const signal = makeSignal('mirror');
      const draft = toGroundBloomDraft(signal);
      expect(draft).toBeNull();
    });
  });

  describe('toMirrorReflectionDraft', () => {
    it('should convert a mirror signal to a MirrorReflectionDraft', () => {
      const signal = makeSignal('mirror');
      const draft = toMirrorReflectionDraft(signal);
      expect(draft).not.toBeNull();
      expect(draft?.userApproved).toBe(false);
      expect(draft?.sourceSignalId).toBe('test-signal');
      expect(draft?.id).toBe('test-signal-mirror-draft');
    });

    it('should return null for non-mirror signals', () => {
      const signal = makeSignal('lifemap');
      const draft = toMirrorReflectionDraft(signal);
      expect(draft).toBeNull();
    });
  });

  describe('toRitualSuggestionDraft', () => {
    it('should convert a ritual signal to a RitualSuggestionDraft', () => {
      const signal = makeSignal('ritual');
      const draft = toRitualSuggestionDraft(signal);
      expect(draft).not.toBeNull();
      expect(draft?.userApproved).toBe(false);
      expect(draft?.sourceSignalId).toBe('test-signal');
      expect(draft?.id).toBe('test-signal-ritual-draft');
      expect(draft?.ritualType).toBe('unknown');
    });

    it('should correctly identify ritual types from summary', () => {
      const groundingSignal = {
        ...makeSignal('ritual'),
        summary: 'This summary is about grounding.',
      };
      const resetSignal = {
        ...makeSignal('ritual'),
        summary: 'I need a reset in my life.',
      };

      const groundingDraft = toRitualSuggestionDraft(groundingSignal);
      const resetDraft = toRitualSuggestionDraft(resetSignal);

      expect(groundingDraft?.ritualType).toBe('grounding');
      expect(resetDraft?.ritualType).toBe('reset');
    });

    it('should return null for non-ritual signals', () => {
      const signal = makeSignal('ground');
      const draft = toRitualSuggestionDraft(signal);
      expect(draft).toBeNull();
    });
  });
});
