import {
  runSymbolicInference,
  DEFAULT_SYMBOLIC_INFERENCE_CONFIG,
} from './symbolicInferenceEngine';
import { SymbolicInputSummary } from './intelligenceTypes';

describe('runSymbolicInference', () => {
  const sampleInputs: SymbolicInputSummary[] = [
    {
      id: '1',
      createdAt: new Date().toISOString(),
      layerId: 'com.urai.journal',
      kind: 'journal_summary',
      summary: 'This is a test summary for a life map candidate.',
      tags: ['milestone'],
    },
    {
      id: '2',
      createdAt: new Date().toISOString(),
      layerId: 'com.urai.movement',
      kind: 'movement_summary',
      summary: 'A grounding walk in the park.',
      tags: ['grounding'],
    },
    {
      id: '3',
      createdAt: new Date().toISOString(),
      layerId: 'com.urai.calendar',
      kind: 'calendar_summary',
      summary: 'A recurring pattern of too many meetings.',
      tags: ['repeated pattern'],
    },
    {
      id: '4',
      createdAt: new Date().toISOString(),
      layerId: 'com.urai.journal',
      kind: 'journal_summary',
      summary: 'A difficult memory that may be a shadow candidate.',
      tags: ['shadow'],
    },
    {
      id: '5',
      createdAt: new Date().toISOString(),
      layerId: 'com.urai.journal',
      kind: 'journal_summary',
      summary: 'A beautiful memory to be saved as a legacy.',
      tags: ['legacy'],
    },
    {
      id: '6',
      createdAt: new Date().toISOString(),
      layerId: 'com.urai.journal',
      kind: 'journal_summary',
      summary: 'A summary that could be a ritual.',
      tags: ['ritual'],
    },
    {
      id: '7',
      createdAt: new Date().toISOString(),
      layerId: 'com.urai.private',
      kind: 'private',
      summary: 'This is a private layer that should be ignored',
    },
  ];

  it('should expose the default symbolic inference config', () => {
    expect(DEFAULT_SYMBOLIC_INFERENCE_CONFIG.maxSignalsPerRun).toBeGreaterThan(0);
  });

  it('should generate candidates for all enabled destinations', () => {
    const result = runSymbolicInference({
      inputs: sampleInputs,
      openPassportLayerIds: ['com.urai.journal', 'com.urai.movement', 'com.urai.calendar'],
    });

    expect(result.lifeMapCandidates.length).toBe(1);
    expect(result.groundCandidates.length).toBe(1);
    expect(result.mirrorCandidates.length).toBe(1);
    expect(result.ritualCandidates.length).toBe(1);
    expect(result.legacyCandidates.length).toBe(1);
    expect(result.shadowCandidates.length).toBe(0);
  });

  it('should enable shadow candidates when configured', () => {
    const result = runSymbolicInference({
      inputs: sampleInputs,
      openPassportLayerIds: ['com.urai.journal', 'com.urai.movement', 'com.urai.calendar'],
      config: { allowShadowCandidates: true },
    });
    expect(result.shadowCandidates.length).toBe(1);
  });

  it('should disable legacy candidates when configured', () => {
    const result = runSymbolicInference({
      inputs: sampleInputs,
      openPassportLayerIds: ['com.urai.journal', 'com.urai.movement', 'com.urai.calendar'],
      config: { allowLegacyCandidates: false },
    });
    expect(result.legacyCandidates.length).toBe(0);
  });

  it('should disable ritual suggestions when configured', () => {
    const result = runSymbolicInference({
      inputs: sampleInputs,
      openPassportLayerIds: ['com.urai.journal', 'com.urai.movement', 'com.urai.calendar'],
      config: { allowRitualSuggestions: false },
    });
    expect(result.ritualCandidates.length).toBe(0);
  });

  it('should not use forbidden language', () => {
    const result = runSymbolicInference({
      inputs: sampleInputs,
      openPassportLayerIds: ['com.urai.journal', 'com.urai.movement', 'com.urai.calendar'],
      config: { allowShadowCandidates: true },
    });

    const forbiddenWords = ['detected', 'proves', 'depressed', 'anxiety', 'truth', 'lie', 'betrayal'];

    const allSummaries = [
      ...result.lifeMapCandidates.map((c) => c.summary),
      ...result.groundCandidates.map((c) => c.summary),
      ...result.mirrorCandidates.map((c) => c.summary),
      ...result.ritualCandidates.map((c) => c.summary),
      ...result.legacyCandidates.map((c) => c.summary),
      ...result.shadowCandidates.map((c) => c.summary),
    ];

    for (const summary of allSummaries) {
      for (const word of forbiddenWords) {
        expect(summary).not.toContain(word);
      }
    }
  });
});
