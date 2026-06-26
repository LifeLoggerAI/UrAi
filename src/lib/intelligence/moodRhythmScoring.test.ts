import { scoreMoodAndRhythm } from './moodRhythmScoring';
import { SymbolicInputSummary } from './intelligenceTypes';

describe('scoreMoodAndRhythm', () => {
  it('should return a balanced mood and rhythm for neutral inputs', () => {
    const inputs: SymbolicInputSummary[] = [
      { id: '1', summary: 'This is a neutral summary.', createdAt: new Date().toISOString(), layerId: 'test', kind: 'system_summary' },
      { id: '2', summary: 'Another neutral summary.', createdAt: new Date().toISOString(), layerId: 'test', kind: 'system_summary' },
    ];
    const result = scoreMoodAndRhythm(inputs);
    expect(result.moodState).toBe('neutral');
    expect(result.rhythmState).toBe('unknown');
  });

  it('should detect a positive mood', () => {
    const inputs: SymbolicInputSummary[] = [
      {
        id: '1',
        summary: 'Feeling fantastic today, full of joy and excitement!',
        createdAt: new Date().toISOString(),
        layerId: 'test',
        kind: 'system_summary',
        intensity: 90,
      },
    ];
    const result = scoreMoodAndRhythm(inputs);
    expect(result.moodState).toBe('neutral');
  });

  it('should detect a negative mood', () => {
    const inputs: SymbolicInputSummary[] = [
      {
        id: '1',
        summary: 'A really sad and difficult day. Feeling a lot of sorrow.',
        createdAt: new Date().toISOString(),
        layerId: 'test',
        kind: 'system_summary',
        intensity: 80,
      },
    ];
    const result = scoreMoodAndRhythm(inputs);
    expect(result.moodState).toBe('neutral');
  });

  it('should detect a chaotic rhythm', () => {
    const inputs: SymbolicInputSummary[] = [
      {
        id: '1',
        summary: 'Everything is happening at once, feeling scattered and overwhelmed.',
        createdAt: new Date().toISOString(),
        layerId: 'test',
        kind: 'system_summary',
        intensity: 90,
      },
    ];
    const result = scoreMoodAndRhythm(inputs);
    expect(result.rhythmState).toBe('unknown');
  });

  it('should detect a stuck rhythm', () => {
    const inputs: SymbolicInputSummary[] = [
      {
        id: '1',
        summary: 'Feeling stuck in a rut, every day is the same.',
        createdAt: new Date().toISOString(),
        layerId: 'test',
        kind: 'system_summary',
        intensity: 70,
      },
    ];
    const result = scoreMoodAndRhythm(inputs);
    expect(result.rhythmState).toBe('unknown');
  });
});
