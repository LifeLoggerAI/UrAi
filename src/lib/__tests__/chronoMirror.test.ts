import {
  computeChronoForecast,
  computeChronoMirror,
  computeEmotionalPhysics,
  computeFeltTimeReplaySegments,
  mapUserDataToChronoSignals,
} from '../chronoMirror';

describe('ChronoMirror', () => {
  test('computes chrono mirror state', () => {
    const result = computeChronoMirror({
      emotionalIntensity: 0.8,
      stressLoad: 0.7,
      replayLoopLoad: 0.6,
      memoryAnchorCount: 8,
    });

    expect(result.timeDilationScore).toBeGreaterThan(0);
    expect(result.realityDensity).toBeGreaterThan(0);
    expect(result.chronoTherapyMode).toBeDefined();
  });

  test('maps raw user telemetry to chrono signals', () => {
    const signals = mapUserDataToChronoSignals({
      moodScore: 0.5,
      stressScore: 0.6,
      sleepDebtHours: 4,
      memoryAnchorCount: 5,
    });

    expect(signals.stressLoad).toBeGreaterThan(0);
    expect(signals.sleepDebt).toBeGreaterThan(0);
  });

  test('computes replay segments', () => {
    const segments = computeFeltTimeReplaySegments([
      {
        id: '1',
        label: 'Heavy moment',
        signals: {
          emotionalIntensity: 0.95,
          stressLoad: 0.9,
          memoryAnchorCount: 10,
        },
      },
      {
        id: '2',
        label: 'Routine day',
        signals: {
          emotionalIntensity: 0.1,
          routineDensity: 0.95,
        },
      },
    ]);

    expect(segments.length).toBe(2);
    expect(segments[0].feltWeight).toBeGreaterThan(segments[1].feltWeight);
  });

  test('computes emotional physics', () => {
    const result = computeChronoMirror({
      emotionalIntensity: 0.8,
      stressLoad: 0.6,
      memoryAnchorCount: 9,
    });

    const physics = computeEmotionalPhysics(result);

    expect(physics.emotionalGravity).toBeGreaterThan(0);
    expect(physics.recoveryVelocity).toBeGreaterThanOrEqual(0);
  });

  test('computes forecast state', () => {
    const history = [
      computeChronoMirror({ emotionalIntensity: 0.7, stressLoad: 0.8 }),
      computeChronoMirror({ emotionalIntensity: 0.6, stressLoad: 0.7 }),
      computeChronoMirror({ emotionalIntensity: 0.5, stressLoad: 0.6 }),
    ];

    const forecast = computeChronoForecast(history);

    expect(forecast.burnoutRisk).toBeGreaterThanOrEqual(0);
    expect(forecast.recoveryProbability).toBeGreaterThanOrEqual(0);
  });
});
