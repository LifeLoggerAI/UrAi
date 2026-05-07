import {
  buildAncientNarratorProfile,
  buildAncientSignalSnapshot,
  buildAncientSkyParams,
  computeAncientSignals,
  computePreverbalState,
  mapUserDataToAncientSignals,
} from '../ancientSignals';

describe('Ancient Signals', () => {
  test('computes a high load state', () => {
    const result = computeAncientSignals({
      voiceTension: 0.9,
      pauseDensity: 0.8,
      frictionTapScore: 0.9,
      motionJitter: 0.8,
      mentalLoadScore: 0.85,
      socialAbsence: 0.7,
      silenceWeight: 0.6,
    });

    expect(result.activationScore).toBeGreaterThan(0.45);
    expect(result.visualState.shadowStatic).toBeGreaterThan(0);
    expect(result.narratorHint.shouldSpeak).toBe(true);
  });

  test('computes a recovery state', () => {
    const result = computeAncientSignals({
      recoverySignal: 0.95,
      positiveValence: 0.8,
      mentalLoadScore: 0.15,
      nocturnalDrift: 0.1,
      connectionPull: 0.7,
    });

    expect(result.preverbalState).toBe('recovering');
    expect(result.recoveryPulseScore).toBeGreaterThan(0.7);
    expect(result.auraAtmosphere.bloomPotential).toBeGreaterThan(0.7);
  });

  test('computes a distance state', () => {
    const result = computeAncientSignals({
      socialAbsence: 0.9,
      stagnationScore: 0.8,
      silenceWeight: 0.75,
      placeAvoidanceScore: 0.7,
      nocturnalDrift: 0.6,
      connectionPull: 0.1,
    });

    expect(result.withdrawalScore).toBeGreaterThan(0.64);
    expect(result.visualState.constellationDrift).toBeGreaterThan(0.6);
  });

  test('computes direct state scoring', () => {
    expect(
      computePreverbalState({
        activationScore: 0.2,
        withdrawalScore: 0.2,
        recoveryPulseScore: 0.2,
        numbnessScore: 0.2,
        seekingScore: 0.2,
      }),
    ).toBe('settled');
  });

  test('maps raw telemetry', () => {
    const signals = mapUserDataToAncientSignals({
      moodScore: 0.4,
      stressScore: 0.7,
      sleepDebtHours: 5,
      notificationFrictionScore: 0.8,
      socialGapScore: 0.6,
      frictionTapScore: 0.7,
      hesitationScore: 0.6,
      cancelLoopScore: 0.5,
      lateNightUseScore: 0.8,
    });

    expect(signals.sleepDebt).toBeGreaterThan(0);
    expect(signals.notificationFriction).toBeGreaterThan(0);
    expect(signals.obscuraScore).toBeGreaterThan(0);
  });

  test('builds snapshot and runtime bindings', () => {
    const snapshot = buildAncientSignalSnapshot({
      id: 'ancient-1',
      ownerUid: 'demo-user',
      createdAt: '2026-05-06T00:00:00.000Z',
      sourceWindow: {
        startAt: '2026-05-05T00:00:00.000Z',
        endAt: '2026-05-06T00:00:00.000Z',
        durationMinutes: 1440,
      },
      consentBasis: {
        audioProcessing: true,
        relationshipInsights: true,
        healthWellnessInsights: true,
      },
      input: {
        recoverySignal: 0.8,
        positiveValence: 0.7,
        mentalLoadScore: 0.2,
      },
    });

    const sky = buildAncientSkyParams(snapshot);
    const narrator = buildAncientNarratorProfile(snapshot);

    expect(snapshot.ownerUid).toBe('demo-user');
    expect(sky.bloomReadiness).toBeGreaterThan(0);
    expect(narrator.prompt).toBeDefined();
  });
});
