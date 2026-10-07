export type RendererCounters = Readonly<{
  render?: Readonly<{ calls?: number; triangles?: number; points?: number; lines?: number }>;
  memory?: Readonly<{ geometries?: number; textures?: number }>;
}>;

export type LegacyFrameMetrics = Readonly<{
  framesPerSecond: number;
  frameMilliseconds: number;
  drawCalls: number | null;
  triangles: number | null;
  points: number | null;
  lines: number | null;
  geometries: number | null;
  textures: number | null;
}>;

const SAMPLE_SECONDS = 0.5;

function counter(value: number | undefined): number | null {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

/** Read renderer counters locally; never retain renderer objects or scene data. */
export function createFrameDiagnosticSampler() {
  let elapsedSeconds = 0;
  let frames = 0;

  function reset() {
    elapsedSeconds = 0;
    frames = 0;
  }

  function sample(deltaSeconds: number, info: RendererCounters): LegacyFrameMetrics | null {
    // A paused/resumed frame is not a runtime FPS or GPU timing measurement.
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0 || deltaSeconds > 1) {
      reset();
      return null;
    }

    elapsedSeconds += deltaSeconds;
    frames += 1;
    if (elapsedSeconds < SAMPLE_SECONDS) return null;

    const result = Object.freeze({
      framesPerSecond: frames / elapsedSeconds,
      frameMilliseconds: (elapsedSeconds / frames) * 1000,
      drawCalls: counter(info.render?.calls),
      triangles: counter(info.render?.triangles),
      points: counter(info.render?.points),
      lines: counter(info.render?.lines),
      geometries: counter(info.memory?.geometries),
      textures: counter(info.memory?.textures),
    });
    reset();
    return result;
  }

  return { sample, reset };
}
