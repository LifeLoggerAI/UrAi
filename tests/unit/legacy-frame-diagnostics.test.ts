import { createFrameDiagnosticSampler } from '../../src/lib/runtime/frame-diagnostics';

const info = {
  render: { calls: 4, triangles: 120, points: 3, lines: 5 },
  memory: { geometries: 2, textures: 7 },
};

describe('local legacy frame diagnostics', () => {
  it('samples actual frame cadence and renderer counters after half a second', () => {
    const sampler = createFrameDiagnosticSampler();
    expect(sampler.sample(0.25, info)).toBeNull();
    expect(sampler.sample(0.25, info)).toEqual({
      framesPerSecond: 4, frameMilliseconds: 250,
      drawCalls: 4, triangles: 120, points: 3, lines: 5, geometries: 2, textures: 7,
    });
  });

  it.each([0, -1, NaN, Infinity, 2])('does not certify an invalid or resumed frame delta %s', delta => {
    const sampler = createFrameDiagnosticSampler();
    sampler.sample(0.25, info);
    expect(sampler.sample(delta, info)).toBeNull();
    expect(sampler.sample(0.25, info)).toBeNull();
    expect(sampler.sample(0.25, info)?.framesPerSecond).toBe(4);
  });

  it('represents unsupported counters as unavailable instead of numeric defaults', () => {
    const sample = createFrameDiagnosticSampler().sample(0.5, {
      render: { calls: NaN, triangles: -1, points: Infinity, lines: 0.5 },
      memory: { geometries: Number.MAX_SAFE_INTEGER + 1 },
    });
    expect(sample).toEqual({ framesPerSecond: 2, frameMilliseconds: 500,
      drawCalls: null, triangles: null, points: null, lines: null, geometries: null, textures: null });
  });

  it('copies only counters and retains no source or renderer object', () => {
    const source = { ...info, privateScene: 'private sentinel', render: { ...info.render } };
    const sample = createFrameDiagnosticSampler().sample(0.5, source);
    source.render.calls = 90;
    expect(sample?.drawCalls).toBe(4);
    expect(sample).not.toHaveProperty('privateScene');
    expect(sample).not.toHaveProperty('render');
    expect(Object.isFrozen(sample)).toBe(true);
  });

  it('does not carry old metrics into the next sampling window', () => {
    const sampler = createFrameDiagnosticSampler();
    expect(sampler.sample(0.5, info)?.drawCalls).toBe(4);
    expect(sampler.sample(0.25, {})).toBeNull();
    expect(sampler.sample(0.25, {})?.drawCalls).toBeNull();
  });
});
