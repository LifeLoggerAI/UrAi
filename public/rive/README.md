# Rive Assets

## ChronoMirror Sky

Expected asset:

```txt
public/rive/chrono-sky.riv
```

Expected state machine:

```txt
ChronoSky
```

Expected numeric inputs:

- particleVelocity
- particleDensity
- cloudOpacity
- auroraIntensity
- fractureIntensity
- dawnGlow

These map to `CHRONO_RIVE_CONFIG` in:

```txt
src/lib/chronoRuntimeConfig.ts
```

The current runtime component can render without the `.riv` asset, but production visual animation should supply the above asset and state machine.
